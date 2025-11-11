<?php

namespace App\Http\Controllers;

use App\Models\Diagnostic;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ResultsController extends Controller
{
    public function show(Diagnostic $diagnostic, Request $request): View
    {
        abort_if($diagnostic->user_id !== $request->user()->id, 403);

        return view('results.show', [
            'diagnostic' => $diagnostic,
            'scores' => $diagnostic->scores_by_dimension ?? [],
        ]);
    }
}
