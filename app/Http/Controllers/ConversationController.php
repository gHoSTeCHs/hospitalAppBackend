<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ConversationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = $user->conversations()
            ->with(['lastMessage', 'participants' => function ($query) use ($user) {
                $query->where('users.id', '!=', $user->id);
            }])
            ->withCount(['messages as unread_count' => function ($query) use ($user) {
                $query->whereNull('read_at')
                    ->where('sender_id', '!=', $user->id);
            }])
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json(['conversations' => $conversations]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255', // Required for group chats
            'type' => 'required|in:individual,group',
            'participants' => 'required|array|min:1',
            'participants.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Check if all participants belong to the same hospital
        $participants = User::query()->whereIn('id', $request->participants)->get();
        foreach ($participants as $participant) {
            if ($participant->hospital_id !== $user->hospital_id) {
                return response()->json(['error' => 'You can only chat with members of your hospital'], 403);
            }
        }

        // For individual chats, check if a conversation already exists
        if ($request->type === 'individual' && count($request->participants) === 1) {
            $existingConversation = Conversation::query()->where('type', 'individual')
                ->where('hospital_id', $user->hospital_id)
                ->whereHas('participants', function ($query) use ($user) {
                    $query->where('users.id', $user->id);
                })
                ->whereHas('participants', function ($query) use ($request) {
                    $query->where('users.id', $request->participants[0]);
                })
                ->first();

            if ($existingConversation) {
                return response()->json([
                    'conversation' => $existingConversation->load('participants'),
                    'message' => 'Conversation already exists',
                ]);
            }
        }

        DB::beginTransaction();

        try {
            $conversation = Conversation::query()->create([
                'name' => $request->name, // Will be null for individual chats
                'type' => $request->type,
                'hospital_id' => $user->hospital_id,
                'created_by' => $user->id,
            ]);

            // Add participants including the creator
            $allParticipants = array_merge($request->participants, [$user->id]);
            $participantsData = [];

            foreach (array_unique($allParticipants) as $participantId) {
                $isAdmin = ($participantId === $user->id);
                $participantsData[$participantId] = ['is_admin' => $isAdmin];
            }

            $conversation->participants()->attach($participantsData);

            DB::commit();

            return response()->json([
                'conversation' => $conversation->load('participants'),
                'message' => 'Conversation created successfully',
            ], 201);
        } catch (Exception $e) {
            DB::rollback();

            return response()->json(['error' => 'Failed to create conversation: '.$e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();

        $conversation = Conversation::query()->where('id', $id)
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->with('participants')
            ->firstOrFail();

        return response()->json(['conversation' => $conversation]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Conversation $conversation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        $conversation = Conversation::query()->where('id', $id)
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('users.id', $user->id)
                    ->where('conversation_participants.is_admin', true);
            })
            ->firstOrFail();

        $conversation->name = $request->name;
        $conversation->save();

        return response()->json([
            'conversation' => $conversation,
            'message' => 'Conversation updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $conversation = Conversation::query()->where('id', $id)
            ->where(function ($query) use ($user) {
                $query->where('created_by', $user->id)
                    ->orWhereHas('participants', function ($query) use ($user) {
                        $query->where('users.id', $user->id)
                            ->where('conversation_participants.is_admin', true);
                    });
            })
            ->firstOrFail();

        $conversation->delete();

        return response()->json(['message' => 'Conversation deleted successfully']);
    }
}
