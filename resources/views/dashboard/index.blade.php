@extends('layouts.app')

@section('title', __('Painel Express Score'))

@section('content')
<section class="grid" style="gap:2rem;">
    <x-score-card :title="__('Express Score')" :score="$diagnostics->first()?->overall_score ?? 0" :previous="$diagnostics->skip(1)->first()?->overall_score" :subtitle="__('Resultado mais recente')">
        <p style="color:#636e72;">{{ __('Classificação: :class', ['class' => $diagnostics->first()?->classification ?? __('Sem classificação')]) }}</p>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            @foreach(($diagnostics->first()?->strengths ?? []) as $strength)
                <span class="chip" style="background:rgba(46, 213, 115, 0.12); color:#27ae60;">{{ $strength }}</span>
            @endforeach
        </div>
    </x-score-card>

    <section class="grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem;">
        <x-stat-card :label="__('Consultas marcadas')" :value="$user->consultations()->where('scheduled_at', '>=', now())->count()" :change="12.4" icon="📅" />
        <x-stat-card :label="__('Metas concluídas')" :value="$goals->where('status', 'completed')->count().'/' . $goals->count()" :change="8.1" icon="🎯" />
        <x-stat-card :label="__('Alertas ativos')" :value="$alerts->whereNull('acknowledged_at')->count()" :change="-4.2" icon="⚡" />
    </section>

    <section class="card">
        <h2>{{ __('Próximos passos recomendados') }}</h2>
        <div class="grid" style="gap:1rem;">
            @forelse($recommendations as $recommendation)
                <article class="card" style="box-shadow:none; border:1px solid rgba(108,92,231,0.15);">
                    <header style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>{{ $recommendation->title }}</strong>
                            <p style="margin:0; color:#636e72;">{{ $recommendation->description }}</p>
                        </div>
                        <span class="badge badge-{{ $recommendation->priority === 'high' ? 'danger' : ($recommendation->priority === 'low' ? 'success' : 'warning') }}">
                            {{ __($recommendation->priority) }}
                        </span>
                    </header>
                    @if($recommendation->resources->isNotEmpty())
                        <footer style="margin-top:1rem;">
                            <small style="color:#636e72; text-transform:uppercase; font-weight:600;">{{ __('Recursos sugeridos') }}</small>
                            <ul>
                                @foreach($recommendation->resources as $resource)
                                    <li><a href="{{ $resource->url }}" target="_blank">{{ $resource->title }}</a> · {{ $resource->estimated_minutes }} {{ __('min') }}</li>
                                @endforeach
                            </ul>
                        </footer>
                    @endif
                </article>
            @empty
                <p>{{ __('Nenhuma recomendação cadastrada ainda.') }}</p>
            @endforelse
        </div>
    </section>

    <section class="card">
        <h2>{{ __('Histórico de evolução') }}</h2>
        @if($scoreHistory->isNotEmpty())
            <table>
                <thead>
                    <tr>
                        <th>{{ __('Período') }}</th>
                        <th>{{ __('Score') }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($scoreHistory as $entry)
                        <tr>
                            <td>{{ $entry['label'] }}</td>
                            <td>{{ $entry['score'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>{{ __('Realize seu primeiro diagnóstico para liberar comparativos de evolução.') }}</p>
        @endif
    </section>

    <section class="card">
        <h2>{{ __('Desafios da semana') }}</h2>
        <ul>
            <li>{{ __('Atualizar pipeline no CRM e registrar aprendizados da última campanha.') }}</li>
            <li>{{ __('Agendar sessão de benchmarking com equipe comercial.') }}</li>
            <li>{{ __('Implementar automações de nutrição com base no diagnóstico.') }}</li>
        </ul>
    </section>
</section>
@endsection
