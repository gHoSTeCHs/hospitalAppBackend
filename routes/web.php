<?php

use App\Http\Controllers\VerifyHospitalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->middleware('superAdmin');

    Route::get('admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard')->middleware('admin');

    Route::middleware(['superAdmin'])->group(function () {
        Route::get('/hospitals', [VerifyHospitalController::class, 'index'])->name('hospitals');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
