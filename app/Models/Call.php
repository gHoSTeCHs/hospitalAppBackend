<?php

namespace App\Models;

use Database\Factories\CallFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Call extends Model
{
    /** @use HasFactory<CallFactory> */
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'caller_id',
        'call_type',
        'status',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function caller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caller_id');
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'call_participants')
            ->withPivot('joined_at', 'left_at');
    }
}
