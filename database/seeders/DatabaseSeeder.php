<?php

namespace Database\Seeders;

use App\Models\Diagnostic;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Usuário Demo',
            'email' => 'demo@example.com',
            'password' => Hash::make('secret123'),
        ]);

        Diagnostic::factory()->count(3)->create([
            'user_id' => $user->id,
            'status' => 'completed',
            'score_total' => 98,
            'scores_by_dimension' => [
                'dividas' => 18,
                'comportamento' => 16,
                'gastos_vs_renda' => 12,
                'metas' => 14,
                'reserva' => 20,
                'renda' => 18,
            ],
            'financial_profile' => 'Em Evolução',
        ]);
    }
}
