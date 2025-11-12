<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Diagnostic\DiagnosticController;
use App\Http\Controllers\GoalController;
use App\Models\LearningResource;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']))->name('health');
Route::view('/', 'welcome')->name('home');
Route::view('/about', 'static.about')->name('about');
Route::view('/services', 'static.services')->name('services');
Route::view('/pricing', 'static.pricing')->name('pricing');
Route::view('/contact', 'static.contact')->name('contact');
Route::post('/contact', ContactController::class)->name('contact.submit');

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('diagnostics', [DiagnosticController::class, 'index'])->name('diagnostics.index');
    Route::post('diagnostics/quick', [DiagnosticController::class, 'quickUpdate'])->name('diagnostics.quick');
    Route::get('diagnostics/{diagnostic}', [DiagnosticController::class, 'show'])->name('diagnostics.show');

    Route::get('goals', [GoalController::class, 'index'])->name('goals.index');
    Route::post('goals', [GoalController::class, 'store'])->name('goals.store');
    Route::patch('goals/{goal}', [GoalController::class, 'update'])->name('goals.update');

    Route::get('learning-paths', function () {
        return view('learning.index', [
            'resources' => LearningResource::all(),
        ]);
    })->name('learning.index');

    Route::prefix('admin')->group(function () {
        Route::get('dashboard', AdminDashboardController::class)->name('admin.dashboard');
        Route::get('leads', [LeadController::class, 'index'])->name('admin.leads.index');
        Route::post('leads', [LeadController::class, 'store'])->name('admin.leads.store');
        Route::patch('leads/{lead}', [LeadController::class, 'update'])->name('admin.leads.update');
    });
});
