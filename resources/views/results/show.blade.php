@extends('layouts.app')

@section('content')
    <article class="card">
        <h1>Resultado do diagnóstico</h1>
        <p>Status: <strong>{{ ucfirst($diagnostic->status) }}</strong></p>
        <p>Perfil financeiro: <strong>{{ $diagnostic->financial_profile }}</strong></p>

        <div class="score-grid">
            <div class="score-card">
                <h2>Score total</h2>
                <p style="font-size: 2.5rem; font-weight: 700;">{{ $diagnostic->score_total }}</p>
                <p>Classificação final baseada nas dimensões avaliadas.</p>
            </div>
            @foreach ($scores as $dimension => $value)
                <div class="score-card">
                    <h3>{{ ucfirst(str_replace('_', ' ', $dimension)) }}</h3>
                    <p style="font-size: 1.75rem; font-weight: 600;">{{ $value }}</p>
                    <p>Peso máximo: {{ \App\Services\ScoreCalculator::DIMENSIONS[$dimension] }}</p>
                </div>
            @endforeach
        </div>

        <footer style="margin-top: 2rem; display: flex; gap: 1rem;">
            <a href="{{ route('history.index') }}" role="button">Ver histórico</a>
            <a href="{{ route('diagnostic.show') }}" role="button" class="secondary">Novo diagnóstico</a>
        </footer>
    </article>
@endsection
