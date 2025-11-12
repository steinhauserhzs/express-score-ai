@extends('layouts.app')

@section('title', __('Entrar na plataforma'))

@section('content')
<section class="card" style="max-width:420px; margin:0 auto;">
    <h1>{{ __('Acesse sua conta') }}</h1>
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <label>
            {{ __('Email') }}
            <input type="email" name="email" value="{{ old('email') }}" required autofocus>
        </label>
        <label>
            {{ __('Senha') }}
            <input type="password" name="password" required>
        </label>
        <label>
            <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}>
            {{ __('Manter conectado') }}
        </label>
        @error('email')
            <small style="color:#d63031;">{{ $message }}</small>
        @enderror
        <button type="submit" style="margin-top:1rem;">{{ __('Entrar') }}</button>
    </form>
    <p style="margin-top:1rem;">{{ __('Ainda não tem acesso?') }} <a href="{{ route('register') }}">{{ __('Crie sua conta') }}</a></p>
</section>
@endsection
