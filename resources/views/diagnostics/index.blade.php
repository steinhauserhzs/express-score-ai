@extends('layouts.app')

@section('title', __('Diagnósticos'))

@section('content')
<section class="card">
    <header style="display:flex; justify-content:space-between; align-items:center;">
        <div>
            <h1>{{ __('Diagnósticos realizados') }}</h1>
            <p style="color:#636e72;">{{ __('Acompanhe evolução e baixe relatórios detalhados.') }}</p>
        </div>
        <details role="list">
            <summary role="button">{{ __('Novo diagnóstico rápido') }}</summary>
            <form method="POST" action="{{ route('diagnostics.quick') }}" style="padding:1rem; width:320px;">
                @csrf
                <label>{{ __('Score geral') }}<input type="number" name="overall_score" min="0" max="100" required></label>
                <label>{{ __('Classificação') }}<input type="text" name="classification" required></label>
                <label>{{ __('Pontos fortes (separe por vírgula)') }}<input type="text" name="strengths[]"></label>
                <label>{{ __('Oportunidades (separe por vírgula)') }}<input type="text" name="improvements[]"></label>
                <button type="submit">{{ __('Salvar diagnóstico') }}</button>
            </form>
        </details>
    </header>

    <table>
        <thead>
            <tr>
                <th>{{ __('Data') }}</th>
                <th>{{ __('Modo') }}</th>
                <th>{{ __('Classificação') }}</th>
                <th>{{ __('Score') }}</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        @forelse($diagnostics as $diagnostic)
            <tr>
                <td>{{ $diagnostic->created_at->format('d/m/Y') }}</td>
                <td>{{ ucfirst($diagnostic->mode) }}</td>
                <td>{{ $diagnostic->classification }}</td>
                <td><span class="badge badge-{{ score_color($diagnostic->overall_score) }}">{{ $diagnostic->overall_score }}</span></td>
                <td><a href="{{ route('diagnostics.show', $diagnostic) }}">{{ __('Ver detalhes') }}</a></td>
            </tr>
        @empty
            <tr><td colspan="5">{{ __('Você ainda não realizou diagnósticos.') }}</td></tr>
        @endforelse
        </tbody>
    </table>

    {{ $diagnostics->links() }}
</section>
@endsection
