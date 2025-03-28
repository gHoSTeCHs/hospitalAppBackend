<?php

namespace App\Http\Controllers;

use App\Events\CallEvent;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CallController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Call $call)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Call $call)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Call $call)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Call $call)
    {
        //
    }

    public function initiateCall(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        $user = Auth::user();

        // Verify user is part of the conversation
        if (!$conversation->participants()->where('users.id', $user->id)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'conversation_id' => $conversationId,
            'caller_id' => $user->id,
            'caller_name' => $user->name,
            'type' => $request->type, // 'video' or 'audio'
            'action' => 'call_initiated',
        ];

        broadcast(new CallEvent($data))->toOthers();

        return response()->json(['message' => 'Call initiated']);
    }

    public function acceptCall(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        $user = Auth::user();

        // Verify user is part of the conversation
        if (!$conversation->participants()->where('users.id', $user->id)->exists()) {
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

    public function rejectCall(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        $user = Auth::user();

        // Verify user is part of the conversation
        if (!$conversation->participants()->where('users.id', $user->id)->exists()) {
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

    public function endCall(Request $request, $conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);
        $user = Auth::user();

        // Verify user is part of the conversation
        if (!$conversation->participants()->where('users.id', $user->id)->exists()) {
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
