<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user_id;

    public $is_online;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($userId, $isOnline)
    {
        $this->user_id = $userId;
        $this->is_online = $isOnline;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): Channel|PrivateChannel
    {
        return new PrivateChannel('user-status' . $this->user_id);
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'user-status-changed';
    }

    public function broadcastWith(): array
    {
        return [
            'user_id' => $this->user_id,
            'is_online' => $this->is_online
        ];
    }
}
