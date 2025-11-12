@extends('layouts.app')

@section('title', __('Firece Express Score'))

@section('content')
<section class="grid" style="gap:2rem; align-items:center;">
    <div>
        <span class="chip">{{ __('Consultoria + IA') }}</span>
        <h1 style="font-size:3rem; margin-top:1rem;">{{ __('Seu diagnóstico de marketing em minutos') }}</h1>
        <p style="font-size:1.1rem; color:#636e72;">{{ __('Descubra prioridades, acompanhe evolução e transforme leads em clientes com o Express Score AI.') }}</p>
        <div style="display:flex; gap:1rem;">
            <a href="{{ route('register') }}" role="button">{{ __('Começar agora') }}</a>
            <a href="{{ route('pricing') }}" class="secondary">{{ __('Ver planos') }}</a>
        </div>
    </div>
    <article class="card" style="background: linear-gradient(135deg,#6c5ce7,#00cec9); color:white;">
        <h2>{{ __('Diagnóstico em tempo real') }}</h2>
        <p>{{ __('Combine IA generativa com metodologia consultiva para priorizar ações de marketing e vendas.') }}</p>
        <ul>
            <li>{{ __('Comparativo de performance com empresas do seu segmento.') }}</li>
            <li>{{ __('Roadmap com próximos passos, desafios semanais e alertas inteligentes.') }}</li>
            <li>{{ __('Plataforma pronta para consultores, analistas e executivos.') }}</li>
        </ul>
    </article>
</section>
@endsection
