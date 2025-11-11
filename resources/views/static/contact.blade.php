@extends('layouts.app')

@section('title', __('Fale com a equipe'))

@section('content')
<section class="grid" style="gap:2rem; align-items:flex-start;">
    <article class="card">
        <h1>{{ __('Vamos acelerar seu crescimento?') }}</h1>
        <p>{{ __('Preencha o formulário e receba um diagnóstico inicial em até 48 horas.') }}</p>
        <form method="POST" action="{{ route('contact.submit') }}">
            @csrf
            <label>
                {{ __('Nome completo') }}
                <input name="name" type="text" placeholder="{{ __('Seu nome') }}" required>
            </label>
            <label>
                {{ __('Email corporativo') }}
                <input name="email" type="email" placeholder="email@empresa.com" required>
            </label>
            <label>
                {{ __('Mensagem') }}
                <textarea name="message" rows="4" placeholder="{{ __('Conte um pouco sobre seus desafios') }}"></textarea>
            </label>
            <button type="submit">{{ __('Enviar mensagem') }}</button>
        </form>
    </article>
    <article class="card">
        <h2>{{ __('Outros canais') }}</h2>
        <ul>
            <li><strong>WhatsApp:</strong> +55 11 99999-9999</li>
            <li><strong>Email:</strong> ola@firece.com.br</li>
            <li><strong>LinkedIn:</strong> linkedin.com/company/firece</li>
        </ul>
    </article>
</section>
@endsection
