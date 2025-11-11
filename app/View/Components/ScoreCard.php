<?php

namespace App\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class ScoreCard extends Component
{
    public function __construct(
        public readonly string $title,
        public readonly int $score,
        public readonly ?int $previous = null,
        public readonly string $subtitle = ''
    ) {
    }

    public function render(): View
    {
        $change = $this->previous !== null ? percentage_change($this->score, $this->previous) : null;

        return view('components.score-card', [
            'change' => $change,
            'badge' => score_color($this->score),
        ]);
    }
}
