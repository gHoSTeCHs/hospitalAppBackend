<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerifyHospitalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $hospitals = Hospital::query()->with(['users', 'documents'])->withCount('users')->get();

        return response()->json([
            $hospitals,
        ]);
    }

    public function verify(Request $request, int $hospitalId): JsonResponse
    {
        $hospital = Hospital::query()->findOrFail($hospitalId);

        if (! $hospital->verified) {
            $hospital->verified = true;
            $hospital->save();

            return response()->json([
                'success' => true,
                'message' => 'Hospital verified successfully',
                'hospital' => $hospital,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Hospital was already verified',
            'hospital' => $hospital,
        ]);
    }

    public function revokeVerification(Request $request, int $hospitalId): JsonResponse
    {
        $hospital = Hospital::query()->findOrFail($hospitalId);

        if ($hospital->verified) {
            $hospital->verified = 0;
            $hospital->save();

            return response()->json([
                'success' => true,
                'message' => 'Hospital verification revoked successfully',
                'hospital' => $hospital,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Hospital was not verified',
            'hospital' => $hospital,
        ]);
    }
}
