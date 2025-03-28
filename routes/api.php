<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CallController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
//  -> Mobile api routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Users
    Route::get('/users/{id}', [UserController::class, 'index']);

    // Conversation Api
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations/create', [ConversationController::class, 'store']);

    // Messages
    Route::get('/messages/{id}', [MessageController::class, 'index']);
    Route::post('/messages/{id}', [MessageController::class, 'store']);

    // Call routes
    Route::post('/conversations/{conversationId}/call/initiate', [CallController::class, 'initiateCall']);
    Route::post('/conversations/{conversationId}/call/accept', [CallController::class, 'acceptCall']);
    Route::post('/conversations/{conversationId}/call/reject', [CallController::class, 'rejectCall']);
    Route::post('/conversations/{conversationId}/call/end', [CallController::class, 'endCall']);
});
