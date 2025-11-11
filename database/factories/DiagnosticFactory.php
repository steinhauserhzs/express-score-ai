<?php

namespace Database\Factories;

use App\Models\Diagnostic;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiagnosticFactory extends Factory
{
    protected $model = Diagnostic::class;

    public function definition(): array
    {
        $dimensions = [
            'dividas',
            'comportamento',
            'gastos_vs_renda',
            'metas',
            'reserva',
            'renda',
        ];

        $scores = collect($dimensions)
            ->mapWithKeys(fn ($dimension) => [$dimension => $this->faker->numberBetween(10, 25)])
            ->toArray();

        return [
            'user_id' => User::factory(),
            'status' => 'completed',
            'raw_answers' => [],
            'scores_by_dimension' => $scores,
            'score_total' => array_sum($scores),
            'financial_profile' => $this->faker->randomElement([
                'Crítico',
                'Em Evolução',
                'Saudável',
                'Avançado',
            ]),
        ];
    }
}
