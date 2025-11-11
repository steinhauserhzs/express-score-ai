@extends('layouts.admin')

@section('admin-content')
<section class="grid" style="gap:2rem;">
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
        @foreach($kpis as $kpi)
            <x-stat-card :label="$kpi['metric']" :value="number_format($kpi['value'], 0, ',', '.')" :change="$kpi['change']" />
        @endforeach
    </div>

    <section class="card">
        <h2>{{ __('Leads mais recentes') }}</h2>
        <table>
            <thead>
                <tr>
                    <th>{{ __('Empresa') }}</th>
                    <th>{{ __('Contato') }}</th>
                    <th>{{ __('Score') }}</th>
                    <th>{{ __('Status') }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($recentLeads as $lead)
                    <tr>
                        <td>{{ $lead->company_name }}</td>
                        <td>{{ $lead->contact_name }}</td>
                        <td>{{ $lead->score }}</td>
                        <td>{{ __($lead->status) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </section>

    <section class="card">
        <h2>{{ __('Consultas agendadas') }}</h2>
        <ul>
            @forelse($upcomingConsultations as $consultation)
                <li>
                    <strong>{{ $consultation->scheduled_at->format('d/m H:i') }}</strong> — {{ $consultation->user->name }}
                    @if($consultation->consultant)
                        <small>{{ __('Consultor: :name', ['name' => $consultation->consultant->name]) }}</small>
                    @endif
                </li>
            @empty
                <li>{{ __('Nenhuma consulta futura cadastrada.') }}</li>
            @endforelse
        </ul>
    </section>

    <section class="card">
        <h2>{{ __('Segmentos em destaque') }}</h2>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
            @foreach($segments as $segment)
                <article class="card" style="box-shadow:none; border:1px solid rgba(99,110,114,0.12);">
                    <strong>{{ $segment->name }}</strong>
                    <p style="color:#636e72;">{{ $segment->description }}</p>
                    <small>{{ __('Leads: :count · Conversão: :rate%', ['count' => $segment->lead_count, 'rate' => $segment->conversion_rate]) }}</small>
                </article>
            @endforeach
        </div>
    </section>
</section>
@endsection
