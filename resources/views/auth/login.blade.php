@extends('layouts.app')

@section('content')
    <article class="card">
        <h1>Entrar</h1>

        @include('partials.errors')

        <form method="POST" action="{{ route('login') }}">
            @csrf
            <label for="email">
                E-mail
                <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus>
            </label>

            <label for="password">
                Senha
                <input type="password" id="password" name="password" required>
            </label>

            <label>
                <input type="checkbox" name="remember"> Lembrar-me
            </label>

            <button type="submit">Acessar</button>
        </form>
    </article>
@endsection
