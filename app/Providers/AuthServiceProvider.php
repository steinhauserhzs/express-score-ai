<?php

namespace App\Providers;

use App\Models\Diagnostic;
use App\Models\Goal;
use App\Policies\DiagnosticPolicy;
use App\Policies\GoalPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Diagnostic::class => DiagnosticPolicy::class,
        Goal::class => GoalPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('admin-access', fn ($user) => $user->role === 'admin');
        Gate::define('consultant-access', fn ($user) => in_array($user->role, ['consultant', 'admin']));
    }
}
