@extends('layouts.app')

@section('content')
    <article class="card">
        <h1>Criar conta</h1>

        @include('partials.errors')

        <form method="POST" action="{{ route('register') }}">
            @csrf
            <label for="name">
                Nome
                <input type="text" id="name" name="name" value="{{ old('name') }}" required>
            </label>

            <label for="email">
                E-mail
                <input type="email" id="email" name="email" value="{{ old('email') }}" required>
            </label>

            <label for="password">
                Senha
                <input type="password" id="password" name="password" required>
            </label>

            <label for="password_confirmation">
                Confirmar senha
                <input type="password" id="password_confirmation" name="password_confirmation" required>
            </label>

            <button type="submit">Criar conta</button>
        </form>
    </article>
@endsection
