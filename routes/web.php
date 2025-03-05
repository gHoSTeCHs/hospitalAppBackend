<?php

use App\Http\Controllers\Api\Web\HospitalDetailsApiController;
use App\Http\Controllers\VerifyHospitalController;
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
    });

    // Super Admin routes
    Route::middleware(['superAdmin'])->group(function () {
        // pages
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
        // data
        Route::get('/hospitals', [VerifyHospitalController::class, 'index'])->name('hospitals');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// admin specific routes
require __DIR__.'/adminSettings.php';
