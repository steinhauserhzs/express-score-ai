<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Consultation;
use App\Models\Diagnostic;
use App\Models\DiagnosticResponse;
use App\Models\Goal;
use App\Models\LearningResource;
use App\Models\Lead;
use App\Models\MetricSnapshot;
use App\Models\Recommendation;
use App\Models\Segment;
use App\Models\SmartAlert;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Ana Consultora',
            'email' => 'ana@expressscore.ai',
            'role' => 'admin',
        ]);

        $client = User::factory()->create([
            'name' => 'João Ribeiro',
            'email' => 'joao@cliente.com',
            'role' => 'client',
        ]);

        $diagnostic = Diagnostic::create([
            'user_id' => $client->id,
            'title' => 'Diagnóstico Novembro',
            'mode' => 'complete',
            'overall_score' => 78,
            'classification' => 'Em evolução',
            'strengths' => ['Branding', 'CRM Integrado'],
            'improvements' => ['Automação de marketing', 'Nutrição de leads'],
            'metadata' => ['benchmark' => 82],
        ]);

        foreach ([
            ['Aquisição digital', 72, 'Campanhas com CPA acima do ideal'],
            ['Conversão', 66, 'Landing pages precisam de testes A/B'],
            ['Retenção', 84, 'Programa de fidelidade em destaque'],
            ['Sucesso do cliente', 81, 'NPS acima do benchmark'],
            ['Revenue Ops', 70, 'Forecast manual e suscetível a erros'],
        ] as [$dimension, $score, $note]) {
            DiagnosticResponse::create([
                'diagnostic_id' => $diagnostic->id,
                'dimension' => $dimension,
                'score' => $score,
                'observation' => $note,
            ]);
        }

        $recommendation = Recommendation::create([
            'user_id' => $client->id,
            'diagnostic_id' => $diagnostic->id,
            'title' => 'Implementar sequências automatizadas',
            'description' => 'Criar jornadas de nutrição para leads frios utilizando conteúdo consultivo.',
            'priority' => 'high',
            'status' => 'open',
            'due_date' => now()->addWeeks(4),
        ]);

        Goal::create([
            'user_id' => $client->id,
            'title' => 'Aumentar conversão em 20%',
            'description' => 'Estruturar experimentos em páginas-chave e revisar copy de ofertas.',
            'progress' => 35,
            'status' => 'in_progress',
            'target_date' => now()->addMonth(),
        ]);

        SmartAlert::create([
            'user_id' => $client->id,
            'type' => 'performance_drop',
            'title' => 'Queda de leads qualificados',
            'message' => 'O volume de SQLs caiu 14% vs média das últimas 4 semanas.',
            'action_url' => '/diagnostics/'.$diagnostic->id,
        ]);

        Consultation::create([
            'user_id' => $client->id,
            'consultant_id' => $admin->id,
            'scheduled_at' => now()->addDays(3)->setTime(10, 30),
            'status' => 'scheduled',
            'notes' => 'Revisar plano de automação e KPIs críticos.',
        ]);

        Lead::factory()->count(4)->create();

        MetricSnapshot::create([
            'metric' => 'Leads Qualificados',
            'value' => 128,
            'change' => 6.4,
            'captured_at' => Carbon::now()->subDay(),
        ]);

        MetricSnapshot::create([
            'metric' => 'Consultas concluídas',
            'value' => 34,
            'change' => 3.2,
            'captured_at' => Carbon::now()->subDay(),
        ]);

        Segment::insert([
            [
                'name' => 'SaaS Series A',
                'description' => 'Empresas B2B em rodada Série A focadas em PLG.',
                'lead_count' => 28,
                'conversion_rate' => 32,
                'criteria' => json_encode(['ARR' => '5-20MM', 'Headcount' => '50-120']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Educação Premium',
                'description' => 'Escolas e edtechs com ticket médio acima de R$3k.',
                'lead_count' => 19,
                'conversion_rate' => 24,
                'criteria' => json_encode(['Region' => 'Brasil', 'ICP' => 'B2C high-ticket']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        LearningResource::insert([
            [
                'title' => 'Playbook de automações para marketing B2B',
                'type' => 'ebook',
                'summary' => 'Sequências recomendadas para leads inbound, outbound e clientes ativos.',
                'url' => 'https://firece.com.br/resources/playbook-automacoes.pdf',
                'estimated_minutes' => 25,
                'tags' => json_encode(['automacao', 'nutricao', 'crm']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Workshop: Forecast guiado por dados',
                'type' => 'webinar',
                'summary' => 'Como consolidar pipeline e projetar receita com IA generativa.',
                'url' => 'https://firece.com.br/resources/workshop-forecast',
                'estimated_minutes' => 45,
                'tags' => json_encode(['revenue ops', 'forecast']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $resourceIds = LearningResource::pluck('id');
        $recommendation->resources()->sync($resourceIds);

        Badge::insert([
            [
                'code' => 'kickoff-completed',
                'name' => 'Kick-off concluído',
                'description' => 'Primeira rodada de entrevistas finalizada.',
                'points' => 150,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'automation-master',
                'name' => 'Automação em produção',
                'description' => 'Sequências de e-mail e CRM automatizadas.',
                'points' => 200,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $client->badges()->attach(Badge::first()->id, ['unlocked_at' => now()]);
    }
}
