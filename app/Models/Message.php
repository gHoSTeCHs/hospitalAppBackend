<?php

namespace App\Models;

use Database\Factories\MessageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    /** @use HasFactory<MessageFactory> */
    use HasFactory;
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'message_type',
        'content',
        'is_alert',
        'is_emergency',
        'read_at',
    ];

    protected $casts = [
        'is_alert' => 'boolean',
        'is_emergency' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function status(): HasMany
    {
        return $this->hasMany(MessageStatus::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }
}
