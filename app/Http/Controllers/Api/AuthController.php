<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Hospital;
use App\Models\User;
use Exception;
use GetStream\StreamChat\Client as StreamClient;
use GetStream\StreamChat\StreamException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    protected StreamClient $client;

    public function __construct()
    {
        try {
            $this->client = new StreamClient(
                getenv('STREAM_API_KEY'),
                getenv('STREAM_API_SECRET')
            );
        } catch (StreamException $e) {
            Log::error($e->getMessage());
        }
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            $hospital = Hospital::query()->where('hospital_code', $validatedData['hospital_code'])
                ->where('verified', true)
                ->first();

            if (! $hospital) {
                Log::warning('Registration attempt with invalid/unverified hospital code', [
                    'hospital_code' => $validatedData['hospital_code'],
                ]);

                return response()->json([
                    'message' => 'Please enter a valid and verified hospital code',
                    'errors' => ['hospital_code' => ['Invalid or unverified hospital code provided']],
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

                $tokenResult = $user->createToken('auth_token');
                $token = $tokenResult->plainTextToken;

                // getStream.io
                $this->client->upsertUser(
                    [
                        'id' => strval($user->id),
                        'name' => $user->name,
                        'email' => $user->email,
                    ]
                );
                $userToken = $this->client->createToken($user->id);
                $user->stream_token = $userToken;
                $user->save();

                // event(new Registered($user));

                Log::info('User registered successfully', ['user_id' => $user->id]);

                return response()->json([
                    'user' => $user->makeHidden(['password']),
                    'token' => $token,
                    'hospital' => $hospital->only(['id', 'name']),
                    'message' => 'Registration successful',
                    'stream_token' => $user->stream_token,
                ], Response::HTTP_CREATED);
            });
        } catch (Exception $e) {
            Log::error('Registration Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
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
        try {
            $this->client->upsertUser(
                [
                    'id' => strval($user->id),
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());
        }

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
