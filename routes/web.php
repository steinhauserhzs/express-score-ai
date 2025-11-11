<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DiagnosticController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ResultsController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'dashboard.index')->name('home');

Route::controller(AuthController::class)->group(function () {
    Route::get('/auth/login', 'showLoginForm')->name('login');
    Route::post('/auth/login', 'login');
    Route::post('/auth/logout', 'logout')->name('logout');
    Route::get('/auth/register', 'showRegisterForm')->name('register');
    Route::post('/auth/register', 'register');
});

Route::middleware('auth')->group(function () {
    Route::get('/diagnostic', [DiagnosticController::class, 'show'])->name('diagnostic.show');
    Route::post('/diagnostic', [DiagnosticController::class, 'store']);
    Route::get('/review', [DiagnosticController::class, 'review'])->name('diagnostic.review');
    Route::post('/review', [DiagnosticController::class, 'confirm']);
    Route::get('/results/{diagnostic}', [ResultsController::class, 'show'])->name('results.show');
    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
});
