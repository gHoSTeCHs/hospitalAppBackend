<?php

namespace App\Models;

use App\Helpers\HospitalCodeHelper;
use Database\Factories\HospitalFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hospital extends Model
{
    /** @use HasFactory<HospitalFactory> */
    use HasFactory;

    protected $guarded = [];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($code) {
            $code->hospital_code = HospitalCodeHelper::generateHospitalCode();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(HospitalDocument::class);
    }
}
