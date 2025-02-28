<?php

namespace App\Helpers;

use App\Models\Hospital;

class HospitalCodeHelper
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public static function generateHospitalCode(): int
    {
        do {
            $hospitalCode = mt_rand(1000000000, 9999999999);
        } while (Hospital::query()->where('hospital_code', $hospitalCode)->exists());

        return $hospitalCode;
    }
}
