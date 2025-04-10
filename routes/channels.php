<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    if ($user->id === $userId) {
        return ['name' => $user->name];
    }
});

Broadcast::channel('conversation.{conversation_id}', function ($user, $conversationId) {
    Log::info('Broadcast channel authorization attempt', [
        'channel' => "conversation.{$conversationId}",
        'user_id' => $user->id,
        'conversation_id' => $conversationId,
    ]);

    $hasAccess = Conversation::query()->where('id', $conversationId)
        ->whereHas('participants', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->exists();

    Log::info('Broadcast channel authorization result', [
        'channel' => "conversation.{$conversationId}",
        'user_id' => $user->id,
        'conversation_id' => $conversationId,
        'authorized' => $hasAccess,
    ]);

    return $hasAccess;
});

Broadcast::channel('private-conversation.{conversation_id}', function ($user, $conversationId) {
    Log::info('Private conversation channel authorization attempt', [
        'channel' => "private-conversation.{$conversationId}",
        'user_id' => $user->id,
        'conversation_id' => $conversationId,
    ]);

    $hasAccess = Conversation::query()->where('id', $conversationId)
        ->whereHas('participants', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->exists();

    Log::info('Private conversation authorization result', [
        'user_id' => $user->id,
        'conversation_id' => $conversationId,
        'authorized' => $hasAccess,
    ]);

    return $hasAccess;
});

Broadcast::channel('presence-conversation.{conversation_id}', function ($user, $conversationId) {
    Log::info('Presence conversation data:', [
        'user' => $user->toArray(),
        'conversation_id' => $conversationId,
    ]);

    Log::info('Presence conversation channel authorization attempt', [
        'channel' => "presence-conversation.{$conversationId}",
        'user_id' => $user->id,
        'conversation_id' => $conversationId,
    ]);

    $conversation = Conversation::query()->where('id', $conversationId)
        ->whereHas('participants', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->first();

    if ($conversation) {
        Log::info('Presence conversation authorization successful', [
            'user_id' => $user->id,
            'conversation_id' => $conversationId,
        ]);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'avatar' => $user->avatar ?? null,
        ];
    }

    Log::info('Presence conversation authorization failed', [
        'user_id' => $user->id,
        'conversation_id' => $conversationId,
    ]);

    return false;
});

Broadcast::channel('private-calls.{conversation_id}', function ($user, $conversationId) {
    Log::info('Private calls channel authorization attempt', [
        'channel' => "private-calls.{$conversationId}",
        'user_id' => $user->id,
        'conversation_id' => $conversationId,
    ]);

    $hasAccess = Conversation::query()->where('id', $conversationId)
        ->whereHas('participants', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->exists();

    Log::info('Private calls authorization result', [
        'user_id' => $user->id,
        'conversation_id' => $conversationId,
        'authorized' => $hasAccess,
    ]);

    return $hasAccess;
});
