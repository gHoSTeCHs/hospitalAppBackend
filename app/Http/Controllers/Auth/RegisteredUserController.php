<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use App\Models\HospitalDocument;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::query()->create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        $documentTitles = ['Corporate Affairs Commission', 'Operation Permit'];

        if ($user->email !== 'kingswatter@gmail.com') {
            $hospital = Hospital::query()->create([
                'user_id' => $user->id,
            ]);

            $user->hospital_id = $hospital->id;
            $user->save();

            foreach ($documentTitles as $documentTitle) {
                HospitalDocument::query()->create([
                    'hospital_id' => $hospital->id,
                    'document_title' => $documentTitle,
                ]);
            }

        }

        event(new Registered($user));

        Auth::login($user);

        if ($user->role == 'admin') {
            return to_route('admin.dashboard');
        }

        return to_route('dashboard');
    }
}
