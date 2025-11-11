<?php

namespace App\Http\Controllers;

use App\Models\Diagnostic;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HistoryController extends Controller
{
    public function index(Request $request): View
    {
        $diagnostics = Diagnostic::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return view('history.index', [
            'diagnostics' => $diagnostics,
        ]);
    }
}
