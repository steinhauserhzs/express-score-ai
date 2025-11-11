@extends('layouts.app')

@section('title', __('Criar conta'))

@section('content')
<section class="card" style="max-width:480px; margin:0 auto;">
    <h1>{{ __('Comece com Express Score') }}</h1>
    <form method="POST" action="{{ route('register') }}">
        @csrf
        <label>
            {{ __('Nome completo') }}
            <input type="text" name="name" value="{{ old('name') }}" required>
        </label>
        <label>
            {{ __('Email profissional') }}
            <input type="email" name="email" value="{{ old('email') }}" required>
        </label>
        <label>
            {{ __('Senha') }}
            <input type="password" name="password" required>
        </label>
        <label>
            {{ __('Confirme a senha') }}
            <input type="password" name="password_confirmation" required>
        </label>
        <button type="submit" style="margin-top:1rem;">{{ __('Criar conta') }}</button>
    </form>
    <p style="margin-top:1rem;">{{ __('Já possui acesso?') }} <a href="{{ route('login') }}">{{ __('Entrar') }}</a></p>
</section>
@endsection
