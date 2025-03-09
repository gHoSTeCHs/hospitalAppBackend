<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\File;
use App\Models\Message;
use App\Models\MessageStatus;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

// use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $conversationId): JsonResponse
    {
        $validator = Validator::make(['conversation_id' => $conversationId], [
            'conversation_id' => 'required|exists:conversations,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Verify user is part of the conversation
        $conversation = Conversation::query()->where('id', $conversationId)
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->firstOrFail();

        $limit = $request->query('limit', 50);
        $offset = $request->query('offset', 0);

        $messages = Message::query()->where('conversation_id', $conversationId)
            ->with(['sender', 'files', 'status'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->offset($offset)
            ->get();

        // Mark messages as read
        Message::query()->where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        // Update last read message
        if ($messages->count() > 0) {
            $lastMessageId = $messages->first()->id;
            $conversation->participants()->updateExistingPivot($user->id, [
                'last_read_message_id' => $lastMessageId,
            ]);
        }

        return response()->json(['messages' => $messages]);
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
    public function store(Request $request, $conversationId): JsonResponse
    {
        $validator = Validator::make(array_merge($request->all(), ['conversation_id' => $conversationId]), [
            'conversation_id' => 'required|exists:conversations,id',
            'message_type' => 'required|in:text,image,audio,video,file,location',
            'content' => 'required_if:message_type,text,location',
            'is_alert' => 'boolean',
            'is_emergency' => 'boolean',
            'file' => 'required_if:message_type,image,audio,video,file|file|max:100000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Verify user is part of the conversation
        $conversation = Conversation::query()->where('id', $conversationId)
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->firstOrFail();

        DB::beginTransaction();

        try {
            $message = Message::query()->create([
                'conversation_id' => $conversationId,
                'sender_id' => $user->id,
                'message_type' => $request->message_type,
                'content' => $request->content ?? null,
                'is_alert' => $request->is_alert ?? false,
                'is_emergency' => $request->is_emergency ?? false,
            ]);

            // Handle file upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('conversation_files', 'public');

                File::query()->create([
                    'message_id' => $message->id,
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }

            // Update conversation timestamp
            $conversation->touch();

            // Create message status records for all participants except sender
            $participantIds = $conversation->participants()
                ->where('users.id', '!=', $user->id)
                ->pluck('users.id');

            foreach ($participantIds as $participantId) {
                MessageStatus::query()->create([
                    'message_id' => $message->id,
                    'user_id' => $participantId,
                    'status' => 'delivered',
                ]);
            }

            // Load relationships for response
            $message->load(['sender', 'files', 'status']);

            DB::commit();

            // Broadcast the new message event to all participants
            // You could add real-time notification here using Laravel's broadcast features
            // broadcast(new NewMessageEvent($message))->toOthers();

            return response()->json([
                'message' => $message,
                'status' => 'Message sent successfully',
            ], 201);
        } catch (Exception $e) {
            DB::rollback();

            return response()->json([
                'error' => 'Failed to send message: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Message $message)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        //
    }
}
