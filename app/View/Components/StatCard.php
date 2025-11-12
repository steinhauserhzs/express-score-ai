<?php

namespace App\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class StatCard extends Component
{
    public function __construct(
        public readonly string $label,
        public readonly string $value,
        public readonly float $change = 0,
        public readonly string $icon = ''
    ) {
    }

    public function render(): View
    {
        return view('components.stat-card', [
            'changeVariant' => $this->change >= 0 ? 'success' : 'danger',
        ]);
    }
}
