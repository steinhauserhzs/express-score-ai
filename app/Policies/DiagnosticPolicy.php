<?php

namespace App\Policies;

use App\Models\Diagnostic;
use App\Models\User;

class DiagnosticPolicy
{
    public function view(User $user, Diagnostic $diagnostic): bool
    {
        return $diagnostic->user_id === $user->id || $user->can('consultant-access');
    }
}
