<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }} - @yield('title', 'Firece Express Score')</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        :root {
            --brand-primary: #6c5ce7;
            --brand-secondary: #fd79a8;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: #f6f7fb;
        }
        header.navbar {
            background: white;
            box-shadow: 0 10px 30px rgba(10, 10, 10, 0.05);
        }
        .badge {
            display: inline-block;
            border-radius: 999px;
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .badge-success { background: rgba(46, 213, 115, 0.1); color: #2ed573; }
        .badge-warning { background: rgba(255, 159, 67, 0.1); color: #ff9f43; }
        .badge-danger { background: rgba(255, 71, 87, 0.1); color: #ff4757; }
        .card {
            border-radius: 24px;
            border: none;
            box-shadow: 0 30px 60px rgba(11, 15, 45, 0.08);
            background: white;
            padding: 1.5rem;
        }
        .card h2 {
            font-size: 1.25rem;
        }
        .chip {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 16px;
            background: rgba(108, 92, 231, 0.08);
            color: var(--brand-primary);
            font-weight: 600;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
<header class="navbar container-fluid">
    <nav>
        <ul>
            <li><strong>{{ config('app.name') }}</strong></li>
        </ul>
        <ul>
            <li><a href="{{ route('home') }}">{{ __('Home') }}</a></li>
            <li><a href="{{ route('services') }}">{{ __('Services') }}</a></li>
            <li><a href="{{ route('pricing') }}">{{ __('Pricing') }}</a></li>
            @auth
                <li><a href="{{ route('dashboard') }}">{{ __('Dashboard') }}</a></li>
                <li>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button class="secondary outline">{{ __('Logout') }}</button>
                    </form>
                </li>
            @else
                <li><a href="{{ route('login') }}" role="button">{{ __('Login') }}</a></li>
            @endauth
        </ul>
    </nav>
</header>
<main class="container" style="padding: 3rem 0">
    @if (session('status'))
        <article class="card" style="border-left: 4px solid var(--brand-primary);">
            {{ session('status') }}
        </article>
    @endif
    @yield('content')
</main>
<footer class="container" style="padding-bottom: 3rem; text-align: center; color: #636e72;">
    <small>&copy; {{ now()->year }} {{ config('app.name') }}. {{ __('All rights reserved.') }}</small>
</footer>
</body>
</html>
