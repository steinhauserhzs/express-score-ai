@extends('layouts.app')

@section('content')
    <article class="card">
        <h1>Diagnóstico Financeiro Completo</h1>
        <p>Realize o diagnóstico com 39 perguntas, confirme os dados e receba um score de 0 a 150 com avaliação por dimensão.</p>
        @auth
            <a href="{{ route('diagnostic.show') }}" role="button">Começar diagnóstico</a>
        @else
            <div style="display: flex; gap: 1rem;">
                <a href="{{ route('login') }}" role="button">Entrar</a>
                <a href="{{ route('register') }}" role="button" class="secondary">Criar conta</a>
            </div>
        @endauth
    </article>
@endsection
