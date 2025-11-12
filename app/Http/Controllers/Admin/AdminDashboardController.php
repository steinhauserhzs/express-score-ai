<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\Lead;
use App\Models\Segment;
use App\Services\AnalyticsService;
use Illuminate\Support\Facades\Gate;
use Illuminate\View\View;

class AdminDashboardController extends Controller
{
    public function __construct(private readonly AnalyticsService $analytics)
    {
        $this->middleware(['auth']);
    }

    public function __invoke(): View
    {
        Gate::authorize('admin-access');

        return view('admin.dashboard', [
            'kpis' => $this->analytics->adminKpis(),
            'recentLeads' => Lead::latest()->limit(6)->get(),
            'upcomingConsultations' => Consultation::with(['user', 'consultant'])
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at')
                ->limit(6)
                ->get(),
            'segments' => Segment::latest()->limit(4)->get(),
        ]);
    }
}
