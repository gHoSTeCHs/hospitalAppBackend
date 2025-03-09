<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Hospital;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            $hospital = Hospital::query()->where('hospital_code', $validatedData['hospital_code'])->first();
            if (! $hospital) {
                Log::warning('Registration attempt with invalid hospital code', [
                    'hospital_code' => $validatedData['hospital_code'],
                    'email' => $validatedData['email'],
                ]);

                return response()->json([
                    'message' => 'Please enter a valid hospital code',
                    'errors' => ['hospital_code' => ['Invalid hospital code provided']],
                ], Response::HTTP_BAD_REQUEST);
            }

            return DB::transaction(function () use ($validatedData, $hospital) {
                // Create user
                $user = User::query()->create([
                    'name' => $validatedData['name'],
                    'email' => $validatedData['email'],
                    'password' => Hash::make($validatedData['password']),
                    'hospital_id' => $hospital->id,
                ]);

                // Generate token
                $token = $user->createToken('auth_token')->plainTextToken;

                // Send welcome email
                //                $this->sendWelcomeEmail($user);

                // Log successful registration
                Log::info('User registered successfully', ['user_id' => $user->id]);

                // Return user data (excluding sensitive information) and token
                return response()->json([
                    'user' => $user->makeHidden(['password']),
                    'token' => $token,
                    'hospital' => $hospital->only(['id', 'name']),
                    'message' => 'Registration successful',
                ], Response::HTTP_CREATED);
            });

        } catch (Exception $e) {
            Log::error('Registration Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTrace(),
            ]);

            return response()->json([
                'message' => 'Registration Failed. Please try again later.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login credentials',
            ], 401);
        }

        $user = User::query()->where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
