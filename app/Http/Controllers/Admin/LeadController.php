<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class LeadController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request): View
    {
        Gate::authorize('admin-access');

        $leads = Lead::query()
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return view('admin.leads.index', compact('leads'));
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('admin-access');

        $data = $request->validate([
            'company_name' => ['required', 'string'],
            'contact_name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string'],
            'score' => ['nullable', 'integer', 'between:0,100'],
            'status' => ['required', Rule::in(['new', 'engaged', 'proposal', 'won', 'lost'])],
        ]);

        Lead::create($data);

        return redirect()->back()->with('status', __('Lead created successfully.'));
    }

    public function update(Request $request, Lead $lead): RedirectResponse
    {
        Gate::authorize('admin-access');

        $data = $request->validate([
            'score' => ['nullable', 'integer', 'between:0,100'],
            'status' => ['required', Rule::in(['new', 'engaged', 'proposal', 'won', 'lost'])],
        ]);

        $lead->update($data);

        return redirect()->back()->with('status', __('Lead updated successfully.'));
    }
}
