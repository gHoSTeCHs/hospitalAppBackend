<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('conversation.{conversation_id}', function ($user, $conversationId) {

    return Conversation::query()->where('id', $conversationId)
        ->whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->exists();
});
