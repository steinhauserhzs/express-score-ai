@extends('layouts.app')

@section('title', __('Detalhes do diagnóstico'))

@section('content')
<section class="grid" style="gap:2rem;">
    <x-score-card :title="$diagnostic->title" :score="$diagnostic->overall_score" :subtitle="$diagnostic->created_at->format('d/m/Y')">
        <p style="color:#636e72;">{{ __('Classificação: :classification', ['classification' => $diagnostic->classification]) }}</p>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            @foreach($diagnostic->strengths ?? [] as $strength)
                <span class="chip" style="background:rgba(46, 213, 115, 0.12); color:#27ae60;">{{ $strength }}</span>
            @endforeach
        </div>
    </x-score-card>

    <section class="card">
        <h2>{{ __('Áreas de melhoria prioritárias') }}</h2>
        <ul>
            @foreach($diagnostic->improvements ?? [] as $improvement)
                <li>{{ $improvement }}</li>
            @endforeach
        </ul>
    </section>

    <section class="card">
        <h2>{{ __('Dimensões avaliadas') }}</h2>
        <table>
            <thead>
                <tr>
                    <th>{{ __('Dimensão') }}</th>
                    <th>{{ __('Score') }}</th>
                    <th>{{ __('Peso') }}</th>
                    <th>{{ __('Observações') }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($diagnostic->responses as $response)
                    <tr>
                        <td>{{ $response->dimension }}</td>
                        <td>{{ $response->score }}</td>
                        <td>{{ $response->weight }}%</td>
                        <td>{{ $response->observation }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </section>

    <section class="card">
        <h2>{{ __('Recomendações vinculadas') }}</h2>
        @forelse($diagnostic->recommendations as $recommendation)
            <article class="card" style="box-shadow:none; border:1px solid rgba(99,110,114,0.15);">
                <header style="display:flex; justify-content:space-between;">
                    <strong>{{ $recommendation->title }}</strong>
                    <span class="badge badge-{{ $recommendation->priority === 'high' ? 'danger' : ($recommendation->priority === 'low' ? 'success' : 'warning') }}">{{ __($recommendation->priority) }}</span>
                </header>
                <p style="margin:0; color:#636e72;">{{ $recommendation->description }}</p>
                @if($recommendation->due_date)
                    <small>{{ __('Prazo alvo: :date', ['date' => $recommendation->due_date->format('d/m/Y')]) }}</small>
                @endif
            </article>
        @empty
            <p>{{ __('Ainda não existem recomendações vinculadas a este diagnóstico.') }}</p>
        @endforelse
    </section>
</section>
@endsection
