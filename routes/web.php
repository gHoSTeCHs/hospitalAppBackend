<?php

use App\Http\Controllers\Api\Web\HospitalDetailsApiController;
use App\Http\Controllers\VerifyHospitalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin routes
    Route::middleware(['admin'])->group(function () {
        // pages
        Route::get('admin/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

        // data
        Route::get('admin/hospitals/{id}', [HospitalDetailsApiController::class, 'index'])->name('admin.hospitals');
        Route::patch('admin/hospitals/{id}', [HospitalDetailsApiController::class, 'upDateHospitalDetails'])->name('admin.hospital.update');

        Route::get('admin/hospitals/documents/{id}', [HospitalDetailsApiController::class, 'getDocumentStatus'])->name('admin.hospital.documents');
        Route::post('admin/hospitals/documents/{id}', [HospitalDetailsApiController::class, 'uploadDocuments'])->name('admin.hospital.documents.upload');
    });

    // Super Admin routes
    Route::middleware(['superAdmin'])->group(function () {
        // pages
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
        // data
        Route::get('/hospitals', [VerifyHospitalController::class, 'index'])->name('hospitals');
        Route::post('/hospitals/verify/{hospitalId}', [VerifyHospitalController::class, 'verify'])->name('hospitals.verify');
        Route::post('/hospitals/revoke/{hospitalId}', [VerifyHospitalController::class, 'revokeVerification'])->name('hospitals.revoke');
    });
});

// Broadcast::routes(['middleware' => ['auth:sanctum']]);
Route::post('/broadcasting/auth', function (Request $request) {
    Log::alert('Broadcasting auth request received', [
        'headers' => $request->headers->all(),
        'payload' => $request->all(),
    ]);

    return Broadcast::auth($request);
})->middleware(['auth:sanctum']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/channels.php';

// admin specific routes
require __DIR__.'/adminSettings.php';
