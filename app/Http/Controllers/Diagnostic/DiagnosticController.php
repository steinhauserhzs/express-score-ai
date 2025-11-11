<?php

namespace App\Http\Controllers\Diagnostic;

use App\Http\Controllers\Controller;
use App\Models\Diagnostic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DiagnosticController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(): View
    {
        $diagnostics = Diagnostic::query()
            ->where('user_id', Auth::id())
            ->latest()
            ->with('responses')
            ->paginate(10);

        return view('diagnostics.index', compact('diagnostics'));
    }

    public function show(Diagnostic $diagnostic): View
    {
        $this->authorize('view', $diagnostic);

        return view('diagnostics.show', [
            'diagnostic' => $diagnostic->load('responses', 'recommendations.resources'),
        ]);
    }

    public function quickUpdate(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'overall_score' => ['required', 'integer', 'between:0,100'],
            'classification' => ['required', 'string'],
            'strengths' => ['array'],
            'improvements' => ['array'],
        ]);

        $strengths = collect($data['strengths'] ?? [])
            ->flatMap(fn ($value) => array_map('trim', explode(',', $value)))
            ->filter()
            ->values()
            ->all();

        $improvements = collect($data['improvements'] ?? [])
            ->flatMap(fn ($value) => array_map('trim', explode(',', $value)))
            ->filter()
            ->values()
            ->all();

        $diagnostic = Diagnostic::create([
            'user_id' => Auth::id(),
            'title' => __('Quick Diagnostic :date', ['date' => now()->format('d/m/Y')]),
            'mode' => 'quick',
            'overall_score' => $data['overall_score'],
            'classification' => $data['classification'],
            'strengths' => $strengths,
            'improvements' => $improvements,
        ]);

        return redirect()->route('diagnostics.show', $diagnostic)->with('status', __('Quick diagnostic created successfully.'));
    }
}
