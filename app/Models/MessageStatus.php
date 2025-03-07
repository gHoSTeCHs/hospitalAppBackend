<?php

namespace App\Models;

use Database\Factories\MessageStatusFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageStatus extends Model
{
    /** @use HasFactory<MessageStatusFactory> */
    use HasFactory;

    protected $fillable = [
        'message_id',
        'user_id',
        'status',
    ];

    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
