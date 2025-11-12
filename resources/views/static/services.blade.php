@extends('layouts.app')

@section('title', __('Serviços Express Score'))

@section('content')
<section class="grid" style="gap:2rem;">
    <article class="card">
        <h2>{{ __('Diagnostic Express') }}</h2>
        <p>{{ __('Mapeamento completo da jornada comercial com entregáveis em 10 dias.') }}</p>
        <ul>
            <li>{{ __('Workshops imersivos com áreas de marketing e vendas.') }}</li>
            <li>{{ __('Scorecard detalhado com forças, gaps e priorização de sprints.') }}</li>
            <li>{{ __('Acesso à plataforma com relatórios comparativos.') }}</li>
        </ul>
    </article>
    <article class="card">
        <h2>{{ __('Growth Sprints') }}</h2>
        <p>{{ __('Execução de squads multidisciplinares orientados por dados e IA.') }}</p>
        <ul>
            <li>{{ __('Campanhas always-on com otimização semanal.') }}</li>
            <li>{{ __('Chatbot consultivo alimentado com as respostas da equipe.') }}</li>
            <li>{{ __('Reporting executivo com análises preditivas.') }}</li>
        </ul>
    </article>
    <article class="card">
        <h2>{{ __('Key Account Program') }}</h2>
        <p>{{ __('Trilhas de relacionamento B2B com monitoramento de contas estratégicas.') }}</p>
        <ul>
            <li>{{ __('Monitoramento de funil e engajamento em tempo real.') }}</li>
            <li>{{ __('Recomendações automáticas de próximos passos.') }}</li>
            <li>{{ __('Integração com CRM e plataformas de atendimento.') }}</li>
        </ul>
    </article>
</section>
@endsection
