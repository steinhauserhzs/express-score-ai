@extends('layouts.app')

@section('title', __('Planos e investimentos'))

@section('content')
<section class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem;">
    <article class="card">
        <h2>{{ __('Starter') }}</h2>
        <strong style="font-size:2.5rem;">R$ 2.900</strong>
        <p>{{ __('Diagnóstico completo + 2 sessões de alinhamento.') }}</p>
        <ul>
            <li>{{ __('Scorecard detalhado com benchmark setorial.') }}</li>
            <li>{{ __('Roadmap de prioridades por trimestre.') }}</li>
            <li>{{ __('Onboarding com assistente virtual.') }}</li>
        </ul>
    </article>
    <article class="card" style="border:2px solid var(--brand-primary);">
        <h2>{{ __('Scale') }}</h2>
        <strong style="font-size:2.5rem;">R$ 6.900</strong>
        <p>{{ __('Tudo do Starter + execução guiada e squads sob demanda.') }}</p>
        <ul>
            <li>{{ __('4 encontros mensais com consultores especializados.') }}</li>
            <li>{{ __('Integração com CRM e dashboards personalizados.') }}</li>
            <li>{{ __('Gamificação e desafios semanais para times.') }}</li>
        </ul>
    </article>
    <article class="card">
        <h2>{{ __('Enterprise') }}</h2>
        <strong style="font-size:2.5rem;">{{ __('Sob consulta') }}</strong>
        <p>{{ __('Para redes e operações complexas com múltiplos squads.') }}</p>
        <ul>
            <li>{{ __('Key Account Managers dedicados.') }}</li>
            <li>{{ __('Integração avançada com dados de vendas e suporte.') }}</li>
            <li>{{ __('Workshops presenciais e treinamentos in-company.') }}</li>
        </ul>
    </article>
</section>
@endsection
