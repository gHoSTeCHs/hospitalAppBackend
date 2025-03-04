<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::user()) {
            if (Auth::user()->isAdmin()) {
                return $next($request);
            } elseif (Auth::user()->isSuperAdmin()) {
                return redirect()->route('dashboard');
            }
        }

        return redirect('/')->with('error', 'You do not have enough permissions to access this page.');
    }
}
