<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'message' => ['nullable', 'string'],
        ]);

        Log::info('Novo contato recebido', $data);

        return back()->with('status', __('Mensagem recebida! Nossa equipe retornará em breve.'));
    }
}
