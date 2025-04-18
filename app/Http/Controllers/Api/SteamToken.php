<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    /**
     * @throws StreamException
     */
    public function generateToken(Request $request): JsonResponse
    {
        return response()->json([
            'token' => $this->client->createToken($request->input('username')),
        ], 200);
    }
}
