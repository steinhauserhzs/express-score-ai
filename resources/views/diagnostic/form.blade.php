@extends('layouts.app')

@section('content')
    <article class="card">
        <h1>Diagnóstico IA</h1>
        <p>Responda as perguntas para gerar o diagnóstico financeiro. Seus dados são salvos automaticamente.</p>

        @include('partials.errors')

        <form method="POST" action="{{ route('diagnostic.show') }}">
            @csrf
            <section>
                <h2>Renda e Orçamento</h2>
                <label>
                    Renda mensal (R$)
                    <input type="number" step="0.01" name="renda_mensal" value="{{ old('renda_mensal', $answers['renda_mensal'] ?? '') }}" required>
                </label>
                <label>
                    Porcentagem de gastos essenciais
                    <input type="number" name="gastos_essenciais" value="{{ old('gastos_essenciais', $answers['gastos_essenciais'] ?? '') }}" min="0" max="1" step="0.01" required>
                </label>
            </section>

            <section>
                <h2>Dívidas</h2>
                <label>
                    Total de dívidas (R$)
                    <input type="number" step="0.01" name="dividas_valor" value="{{ old('dividas_valor', $answers['dividas_valor'] ?? '') }}" required>
                </label>
                <label>
                    Pagamentos em dia (%)
                    <input type="number" name="dividas_pontualidade" value="{{ old('dividas_pontualidade', $answers['dividas_pontualidade'] ?? '') }}" min="0" max="1" step="0.01" required>
                </label>
            </section>

            <section>
                <h2>Comportamento e Metas</h2>
                <label>
                    Reserva de emergência (meses)
                    <input type="number" name="reserva_meses" value="{{ old('reserva_meses', $answers['reserva_meses'] ?? '') }}" min="0" step="0.5" required>
                </label>
                <label>
                    Progresso das metas (%)
                    <input type="number" name="metas_progresso" value="{{ old('metas_progresso', $answers['metas_progresso'] ?? '') }}" min="0" max="1" step="0.01" required>
                </label>
                <label>
                    Comportamento financeiro (%)
                    <input type="number" name="comportamento_disciplina" value="{{ old('comportamento_disciplina', $answers['comportamento_disciplina'] ?? '') }}" min="0" max="1" step="0.01" required>
                </label>
            </section>

            <button type="submit">Revisar respostas</button>
        </form>
    </article>
@endsection
