<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class Settings extends Controller
{
    public function profile(Request $request): Response
    {
        return Inertia::render('Admin/pages/settings/profile', []);
    }

    public function profileUpdate(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('admin.profile.update');
    }

    public function documents(Request $request): Response
    {
        return Inertia::render('Admin/pages/settings/documents', []);
    }
}
