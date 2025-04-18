<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use GetStream\StreamChat\Client as StreamClient;
use GetStream\StreamChat\StreamException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SteamToken extends Controller
{
    protected $client;

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

    public function generateToken(Request $request): JsonResponse
    {
        $userId = $request->input('userId');
        $user = User::query()->where('id', $userId)->first();
        try {
            $upsert = $this->client->upsertUser(
                [
                    'id' => strval($user->id),
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            );
            return response()->json([
                'token' => $this->client->createToken(strval($user->id)),
            ], 200);
        } catch (StreamException $e) {
            Log::error($e->getMessage());

            return response()->json([
                'error' => 'Failed to generate token',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
