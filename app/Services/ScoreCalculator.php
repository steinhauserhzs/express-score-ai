<?php

namespace App\Services;

use App\Models\Diagnostic;

class ScoreCalculator
{
    public const DIMENSIONS = [
        'dividas' => 25,
        'comportamento' => 20,
        'gastos_vs_renda' => 15,
        'metas' => 15,
        'reserva' => 15,
        'renda' => 10,
    ];

    public function calculate(array $answers): array
    {
        $scores = collect(self::DIMENSIONS)
            ->mapWithKeys(function ($weight, $dimension) use ($answers) {
                $value = $answers[$dimension] ?? 0;
                $score = (int) round($weight * min(1, max(0, $value)));

                return [$dimension => $score];
            })
            ->toArray();

        $total = array_sum($scores);

        return [
            'scores' => $scores,
            'total' => $total,
            'profile' => $this->resolveProfile($total),
        ];
    }

    private function resolveProfile(int $total): string
    {
        return match (true) {
            $total <= 50 => 'Crítico',
            $total <= 100 => 'Em Evolução',
            $total <= 125 => 'Saudável',
            default => 'Avançado',
        };
    }
}
