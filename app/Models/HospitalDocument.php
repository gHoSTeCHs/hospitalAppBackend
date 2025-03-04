<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HospitalDocument extends Model
{
    //

    protected $guarded = [];

    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }
}
