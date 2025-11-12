<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ app_name() }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <style>
            :root {
                color-scheme: light dark;
            }
            body {
                font-family: 'Figtree', sans-serif;
                display: grid;
                place-items: center;
                min-height: 100vh;
                margin: 0;
                background: radial-gradient(circle at top, #eef2ff, #fff);
                color: #0f172a;
            }
            .card {
                background: rgba(255, 255, 255, 0.85);
                border-radius: 24px;
                box-shadow: 0 25px 45px rgba(15, 23, 42, 0.15);
                padding: 3rem;
                text-align: center;
                max-width: 640px;
                width: 90%;
            }
            h1 {
                font-size: clamp(2.5rem, 4vw, 3.5rem);
                margin-bottom: 1rem;
            }
            p {
                font-size: 1.125rem;
                line-height: 1.75rem;
                margin-bottom: 1.5rem;
            }
            a.button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(120deg, #6366f1, #22d3ee);
                color: #fff;
                border-radius: 9999px;
                padding: 0.75rem 1.75rem;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 12px 24px rgba(79, 70, 229, 0.2);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            a.button:hover {
                transform: translateY(-2px);
                box-shadow: 0 16px 30px rgba(79, 70, 229, 0.3);
            }
            footer {
                margin-top: 1.5rem;
                font-size: 0.875rem;
                color: rgba(15, 23, 42, 0.65);
            }
        </style>
    </head>
    <body>
        <main class="card">
            <h1>Bem-vindo ao {{ app_name() }}</h1>
            <p>Este projeto foi migrado para Laravel 11 utilizando Blade, oferecendo uma base sólida e produtiva para a sua equipe desenvolver novas funcionalidades com rapidez e segurança.</p>
            <a class="button" href="{{ route('home') }}">Explorar aplicação</a>
            <footer>
                <span>Laravel v{{ Illuminate\Foundation\Application::VERSION }} · PHP v{{ PHP_VERSION }}</span>
            </footer>
        </main>
    </body>
</html>
