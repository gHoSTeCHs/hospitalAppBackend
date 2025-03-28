<?php

use App\Http\Controllers\Admin\Settings;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth', 'admin', 'verified'])->group(function () {
    Route::get('/settings/profile', [Settings::class, 'profile'])->name('admin.profile.edit');
    Route::patch('/settings/profile', [Settings::class, 'profileUpdate'])->name('admin.profile.update');

    Route::get('/settings/documents', [Settings::class, 'documents'])->name('admin.documents');

    Route::get('/settings/appearance', [Settings::class, 'profile'])->name('admin.appearance');
});
