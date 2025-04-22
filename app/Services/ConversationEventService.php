<?php

namespace App\Services;

use App\Events\ConversationUpdated;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;

class ConversationEventService
{
    public function broadcastNewMessage(Message $message): void
    {
        $message->load('sender');

        broadcast(new MessageSent($message))->toOthers();

        $conversation = $message->conversation;
        foreach ($conversation->participants as $participant) {

            $conversationForUser = $this->getConversationForUser($conversation, $participant->id);
            broadcast(new ConversationUpdated($conversationForUser))->toOthers();
        }
    }

    private function getConversationForUser(Conversation $conversation, $userId)
    {

        return Conversation::with(['lastMessage', 'participants' => function ($query) use ($userId) {
            $query->where('users.id', '!=', $userId);
        }])
            ->withCount(['messages as unread_count' => function ($query) use ($userId) {
                $query->whereNull('read_at')
                    ->where('sender_id', '!=', $userId);
            }])
            ->find($conversation->id);
    }
}
