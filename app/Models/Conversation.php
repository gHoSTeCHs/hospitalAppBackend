<?php

namespace App\Models;

use Database\Factories\ConversationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    /** @use HasFactory<ConversationFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'hospital_id',
        'created_by',
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
            ->withPivot('is_admin', 'muted', 'last_read_message_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }

    public function lastMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latest();
    }
}
