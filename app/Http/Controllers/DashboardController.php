<?php

namespace App\Http\Controllers;

use App\Models\Recommendation;
use App\Services\AnalyticsService;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __construct(private readonly AnalyticsService $analytics)
    {
        $this->middleware('auth');
    }

    public function __invoke(): View
    {
        $user = Auth::user();
        $diagnostics = $user->diagnostics()->with('responses')->latest()->take(3)->get();
        $goals = $user->goals()->orderByDesc('created_at')->take(4)->get();
        $alerts = $user->smartAlerts()->latest()->take(5)->get();
        $recommendations = Recommendation::query()
            ->where('user_id', $user->id)
            ->with('resources')
            ->orderBy('priority')
            ->take(4)
            ->get();

        return view('dashboard.index', [
            'user' => $user,
            'diagnostics' => $diagnostics,
            'scoreHistory' => $this->analytics->userScoreHistory($user->id),
            'goals' => $goals,
            'alerts' => $alerts,
            'recommendations' => $recommendations,
        ]);
    }
}
