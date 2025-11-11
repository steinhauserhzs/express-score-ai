<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class GoalController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(): View
    {
        $goals = Goal::query()
            ->where('user_id', Auth::id())
            ->orderBy('target_date')
            ->get();

        return view('goals.index', compact('goals'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'target_date' => ['nullable', 'date'],
        ]);

        Goal::create(array_merge($data, [
            'user_id' => Auth::id(),
            'progress' => 0,
            'status' => 'not_started',
        ]));

        return redirect()->back()->with('status', __('Goal created successfully.'));
    }

    public function update(Request $request, Goal $goal): RedirectResponse
    {
        $this->authorize('update', $goal);

        $data = $request->validate([
            'progress' => ['required', 'integer', 'between:0,100'],
            'status' => ['required', Rule::in(['not_started', 'in_progress', 'completed', 'delayed'])],
        ]);

        $goal->update($data);

        return redirect()->back()->with('status', __('Goal updated successfully.'));
    }
}
