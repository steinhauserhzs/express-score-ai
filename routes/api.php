<?php

use App\Models\Diagnostic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/diagnostics', function (Request $request) {
    return Diagnostic::query()
        ->where('user_id', $request->user()->id)
        ->with('responses')
        ->get();
});
