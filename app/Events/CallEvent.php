<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CallEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $callData;

    public function __construct(array $callData)
    {
        $this->callData = $callData;
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('private-calls.'.$this->callData['conversation_id']);
    }

    public function broadcastAs(): string
    {
        return 'CallEvent';
    }

    public function broadcastWith(): array
    {
        return $this->callData;
    }
}
