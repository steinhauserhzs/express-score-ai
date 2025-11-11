<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Authenticate
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        if (! $request->user()) {
            throw new HttpException(401, 'Não autenticado.');
        }

        return $next($request);
    }
}
