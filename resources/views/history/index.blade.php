@extends('layouts.app')

@section('content')
    <article class="card">
        <h1>Histórico de diagnósticos</h1>
        <p>Acompanhe todos os diagnósticos já realizados com data, score e status.</p>

        <table role="grid">
            <thead>
            <tr>
                <th>Data</th>
                <th>Score</th>
                <th>Status</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            @foreach ($diagnostics as $diagnostic)
                <tr>
                    <td>{{ $diagnostic->created_at->format('d/m/Y H:i') }}</td>
                    <td>{{ $diagnostic->score_total ?? '—' }}</td>
                    <td>{{ ucfirst($diagnostic->status) }}</td>
                    <td><a href="{{ route('results.show', $diagnostic) }}">Detalhes</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>

        {{ $diagnostics->links() }}
    </article>
@endsection
