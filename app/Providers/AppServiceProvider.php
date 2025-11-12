<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind interfaces to implementations here when needed.
    }

    public function boot(): void
    {
        Blade::component('score-card', \App\View\Components\ScoreCard::class);
        Blade::component('stat-card', \App\View\Components\StatCard::class);
    }
}
