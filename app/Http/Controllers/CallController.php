<?php

namespace App\Http\Controllers;

use App\Events\CallEvent;
use App\Models\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CallController extends Controller
{
    public function initiateCall(Request $request, $conversationId): JsonResponse
    {
        $conversation = Conversation::query()->findOrFail($conversationId);
        $user = $request->user();

        if (! $conversation->participants()->where('users.id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'conversation_id' => $conversationId,
            'caller_id' => $user->id,
            'caller_name' => $user->name,
            'type' => $request->type,
            'action' => 'call_initiated',
        ];

        broadcast(new CallEvent($data))->toOthers();

        return response()->json(['message' => 'Call initiated']);
    }

    public function acceptCall(Request $request, $conversationId): JsonResponse
    {
        $conversation = Conversation::query()->findOrFail($conversationId);
        $user = $request->user();

        if (! $conversation->participants()->where('users.id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'conversation_id' => $conversationId,
            'acceptor_id' => $user->id,
            'acceptor_name' => $user->name,
            'action' => 'call_accepted',
        ];

        broadcast(new CallEvent($data))->toOthers();

        return response()->json(['message' => 'Call accepted']);
    }

    public function rejectCall(Request $request, $conversationId): JsonResponse
    {
        $conversation = Conversation::query()->findOrFail($conversationId);
        $user = $request->user();

        if (! $conversation->participants()->where('users.id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'conversation_id' => $conversationId,
            'rejector_id' => $user->id,
            'rejector_name' => $user->name,
            'action' => 'call_rejected',
        ];

        broadcast(new CallEvent($data))->toOthers();

        return response()->json(['message' => 'Call rejected']);
    }

    public function endCall(Request $request, $conversationId): JsonResponse
    {
        $conversation = Conversation::query()->findOrFail($conversationId);
        $user = $request->user();

        if (! $conversation->participants()->where('users.id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'conversation_id' => $conversationId,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'action' => 'call_ended',
        ];

        broadcast(new CallEvent($data))->toOthers();

        return response()->json(['message' => 'Call ended']);
    }
}
