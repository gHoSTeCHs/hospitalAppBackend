<?php

// app/Events/ConversationUpdated.php

namespace App\Events;

use App\Models\Conversation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Conversation $conversation;

    public function __construct(Conversation $conversation)
    {
        $this->conversation = $conversation;
    }

    public function broadcastOn(): array
    {

        $channels = [];
        foreach ($this->conversation->participants as $participant) {
            $channels[] = new PrivateChannel('user-conversations.'.$participant->id);
        }

        return $channels;
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->conversation->id,
            'participants' => $this->conversation->participants,
        ];
    }
}
