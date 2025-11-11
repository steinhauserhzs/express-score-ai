@extends('layouts.app')

@section('content')
    <article class="card">
        <h1>Revisar respostas</h1>
        <p>Confirme se as informações estão corretas antes de gerar o score final.</p>

        <table role="grid">
            <tbody>
            @foreach ($answers as $key => $value)
                <tr>
                    <th style="text-transform: capitalize;">{{ str_replace('_', ' ', $key) }}</th>
                    <td>{{ is_numeric($value) ? number_format($value, 2, ',', '.') : $value }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>

        <form method="POST" action="{{ route('diagnostic.review') }}" style="display: flex; gap: 1rem;">
            @csrf
            <a href="{{ route('diagnostic.show') }}" role="button" class="secondary">Editar respostas</a>
            <button type="submit">Gerar score final</button>
        </form>
    </article>
@endsection
