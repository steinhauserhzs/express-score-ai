<?php

namespace App\Services;

use App\Models\Diagnostic;
use App\Models\MetricSnapshot;
use Illuminate\Support\Collection;

class AnalyticsService
{
    public function userScoreHistory(int $userId): Collection
    {
        return Diagnostic::query()
            ->where('user_id', $userId)
            ->orderBy('created_at')
            ->get()
            ->map(fn (Diagnostic $diagnostic) => [
                'label' => $diagnostic->created_at->format('d/m'),
                'score' => $diagnostic->overall_score,
            ]);
    }

    public function adminKpis(): Collection
    {
        return MetricSnapshot::query()
            ->latest('captured_at')
            ->limit(8)
            ->get()
            ->map(fn (MetricSnapshot $metric) => [
                'metric' => $metric->metric,
                'value' => $metric->value,
                'change' => $metric->change,
                'captured_at' => $metric->captured_at,
            ]);
    }
}
