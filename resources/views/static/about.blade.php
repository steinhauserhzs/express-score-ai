@extends('layouts.app')

@section('title', __('Sobre a Firece'))

@section('content')
<section class="card">
    <h1>{{ __('Nossa abordagem híbrida') }}</h1>
    <p>{{ __('Aliamos consultores especialistas com assistentes de IA para mapear maturidade digital, priorizar ações e gerar impacto em menos de 90 dias.') }}</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;">
        <article class="card">
            <h2>{{ __('Diagnóstico 360°') }}</h2>
            <p>{{ __('Avaliamos marketing, vendas e sucesso do cliente com mais de 60 variáveis.') }}</p>
        </article>
        <article class="card">
            <h2>{{ __('Plataforma própria') }}</h2>
            <p>{{ __('Análises automatizadas, comparativos com benchmark e acompanhamento contínuo.') }}</p>
        </article>
        <article class="card">
            <h2>{{ __('Consultores especialistas') }}</h2>
            <p>{{ __('Plano de ação priorizado, reuniões mensais e ativação de squads sob demanda.') }}</p>
        </article>
    </div>
</section>
@endsection
