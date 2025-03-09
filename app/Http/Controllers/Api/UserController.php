<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index($id)
    {
        // Ensure the user exists
        $currentUser = User::query()->findOrFail($id);

        // Get hospital members excluding the current user
        $hospitalMembers = User::query()->where('hospital_id', $currentUser->hospital_id)
            ->where('id', '!=', $id) // Exclude the current user
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Hospital members retrieved successfully',
            'data' => $hospitalMembers,
        ]);
    }
}
