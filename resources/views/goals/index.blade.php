@extends('layouts.app')

@section('title', __('Metas estratégicas'))

@section('content')
<section class="card">
    <header style="display:flex; justify-content:space-between; align-items:center;">
        <div>
            <h1>{{ __('Metas e OKRs') }}</h1>
            <p style="color:#636e72;">{{ __('Acompanhe progresso das iniciativas conectadas ao Express Score.') }}</p>
        </div>
        <details role="list">
            <summary role="button">{{ __('Nova meta') }}</summary>
            <form method="POST" action="{{ route('goals.store') }}" style="padding:1rem; width:320px;">
                @csrf
                <label>{{ __('Título') }}<input type="text" name="title" required></label>
                <label>{{ __('Descrição') }}<textarea name="description" rows="3"></textarea></label>
                <label>{{ __('Prazo alvo') }}<input type="date" name="target_date"></label>
                <button type="submit">{{ __('Adicionar meta') }}</button>
            </form>
        </details>
    </header>

    <div class="grid" style="gap:1rem;">
        @forelse($goals as $goal)
            <article class="card" style="box-shadow:none; border:1px solid rgba(108,92,231,0.15);">
                <header style="display:flex; justify-content:space-between;">
                    <strong>{{ $goal->title }}</strong>
                    <span class="badge badge-{{ $goal->status === 'completed' ? 'success' : ($goal->status === 'delayed' ? 'danger' : 'warning') }}">
                        {{ __($goal->status) }}
                    </span>
                </header>
                <p style="color:#636e72;">{{ $goal->description }}</p>
                <progress value="{{ $goal->progress }}" max="100">{{ $goal->progress }}%</progress>
                @if($goal->target_date)
                    <small>{{ __('Prazo alvo: :date', ['date' => $goal->target_date->format('d/m/Y')]) }}</small>
                @endif
                <form method="POST" action="{{ route('goals.update', $goal) }}" style="margin-top:1rem; display:flex; gap:0.5rem;">
                    @csrf
                    @method('PATCH')
                    <input type="number" name="progress" min="0" max="100" value="{{ $goal->progress }}" style="max-width:90px;">
                    <select name="status">
                        <option value="not_started" @selected($goal->status === 'not_started')>{{ __('Não iniciada') }}</option>
                        <option value="in_progress" @selected($goal->status === 'in_progress')>{{ __('Em progresso') }}</option>
                        <option value="completed" @selected($goal->status === 'completed')>{{ __('Concluída') }}</option>
                        <option value="delayed" @selected($goal->status === 'delayed')>{{ __('Atrasada') }}</option>
                    </select>
                    <button type="submit">{{ __('Atualizar') }}</button>
                </form>
            </article>
        @empty
            <p>{{ __('Nenhuma meta cadastrada até o momento.') }}</p>
        @endforelse
    </div>
</section>
@endsection
