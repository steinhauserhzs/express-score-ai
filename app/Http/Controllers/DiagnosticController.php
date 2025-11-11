<?php

namespace App\Http\Controllers;

use App\Models\Diagnostic;
use App\Services\DiagnosticValidator;
use App\Services\ScoreCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class DiagnosticController extends Controller
{
    public function __construct(
        private readonly DiagnosticValidator $validator,
        private readonly ScoreCalculator $calculator
    ) {
    }

    public function show(Request $request): View
    {
        $diagnostic = $this->currentDraft($request);

        return view('diagnostic.form', [
            'diagnostic' => $diagnostic,
            'answers' => $diagnostic?->raw_answers ?? [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->all();
        $errors = $this->validator->validate($data);

        if ($errors->isNotEmpty()) {
            return back()->withErrors($errors)->withInput();
        }

        $diagnostic = $this->currentDraft($request) ?? Diagnostic::create([
            'user_id' => $request->user()->id,
            'status' => 'draft',
        ]);

        $diagnostic->update([
            'raw_answers' => $data,
        ]);

        return redirect()->route('diagnostic.review');
    }

    public function review(Request $request): View
    {
        $diagnostic = $this->currentDraft($request);

        abort_unless($diagnostic, 404);

        return view('review.index', [
            'answers' => $diagnostic->raw_answers,
        ]);
    }

    public function confirm(Request $request): RedirectResponse
    {
        $diagnostic = $this->currentDraft($request);

        abort_unless($diagnostic, 404);

        $result = $this->calculator->calculate($diagnostic->raw_answers ?? []);

        $diagnostic->update([
            'status' => 'completed',
            'score_total' => $result['total'],
            'scores_by_dimension' => $result['scores'],
            'financial_profile' => $result['profile'],
        ]);

        return redirect()->route('results.show', $diagnostic);
    }

    private function currentDraft(Request $request): ?Diagnostic
    {
        return Diagnostic::query()
            ->where('user_id', $request->user()->id)
            ->whereIn('status', ['draft', 'in_review'])
            ->latest()
            ->first();
    }
}
