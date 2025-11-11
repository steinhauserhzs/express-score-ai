<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
    <style>
        body { background-color: #0f172a; color: #e2e8f0; }
        header, main { max-width: 980px; margin: 0 auto; }
        .card { background: rgba(15, 23, 42, 0.8); border-radius: 16px; padding: 2rem; box-shadow: 0 15px 35px rgba(15, 23, 42, 0.5); }
        nav ul { display: flex; gap: 1rem; }
        nav a { color: #38bdf8; }
        .score-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        .score-card { background: rgba(30, 41, 59, 0.8); padding: 1.5rem; border-radius: 12px; }
    </style>
</head>
<body>
<header>
    <nav>
        <ul>
            <li><strong>{{ config('app.name') }}</strong></li>
        </ul>
        <ul>
            @auth
                <li><a href="{{ route('diagnostic.show') }}">Diagnóstico</a></li>
                <li><a href="{{ route('history.index') }}">Histórico</a></li>
                <li>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" role="button" class="secondary">Sair</button>
                    </form>
                </li>
            @else
                <li><a href="{{ route('login') }}">Entrar</a></li>
                <li><a href="{{ route('register') }}">Criar conta</a></li>
            @endauth
        </ul>
    </nav>
</header>

<main>
    @if (session('status'))
        <article class="card">{{ session('status') }}</article>
    @endif

    @yield('content')
</main>
</body>
</html>
