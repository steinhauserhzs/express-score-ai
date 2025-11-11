@extends('layouts.admin')

@section('admin-content')
<section class="card">
    <header style="display:flex; justify-content:space-between; align-items:center;">
        <div>
            <h1>{{ __('Gestão de leads') }}</h1>
            <p style="color:#636e72;">{{ __('Classifique oportunidades, acompanhe pipeline e priorize follow-ups.') }}</p>
        </div>
        <details role="list">
            <summary role="button">{{ __('Novo lead') }}</summary>
            <form method="POST" action="{{ route('admin.leads.store') }}" style="padding:1rem; width:320px;">
                @csrf
                <label>{{ __('Empresa') }}<input type="text" name="company_name" required></label>
                <label>{{ __('Contato') }}<input type="text" name="contact_name" required></label>
                <label>{{ __('Email') }}<input type="email" name="email" required></label>
                <label>{{ __('Telefone') }}<input type="text" name="phone"></label>
                <label>{{ __('Score') }}<input type="number" name="score" min="0" max="100"></label>
                <label>{{ __('Status') }}
                    <select name="status">
                        <option value="new">{{ __('Novo') }}</option>
                        <option value="engaged">{{ __('Engajado') }}</option>
                        <option value="proposal">{{ __('Proposta enviada') }}</option>
                        <option value="won">{{ __('Ganho') }}</option>
                        <option value="lost">{{ __('Perdido') }}</option>
                    </select>
                </label>
                <button type="submit">{{ __('Salvar lead') }}</button>
            </form>
        </details>
    </header>

    <table>
        <thead>
            <tr>
                <th>{{ __('Empresa') }}</th>
                <th>{{ __('Contato') }}</th>
                <th>{{ __('Email') }}</th>
                <th>{{ __('Score') }}</th>
                <th>{{ __('Status') }}</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach($leads as $lead)
                <tr>
                    <td>{{ $lead->company_name }}</td>
                    <td>{{ $lead->contact_name }}</td>
                    <td>{{ $lead->email }}</td>
                    <td>{{ $lead->score }}</td>
                    <td>{{ __($lead->status) }}</td>
                    <td>
                        <details>
                            <summary>{{ __('Atualizar') }}</summary>
                            <form method="POST" action="{{ route('admin.leads.update', $lead) }}">
                                @csrf
                                @method('PATCH')
                                <label>{{ __('Score') }}<input type="number" name="score" min="0" max="100" value="{{ $lead->score }}"></label>
                                <label>{{ __('Status') }}
                                    <select name="status">
                                        <option value="new" @selected($lead->status === 'new')>{{ __('Novo') }}</option>
                                        <option value="engaged" @selected($lead->status === 'engaged')>{{ __('Engajado') }}</option>
                                        <option value="proposal" @selected($lead->status === 'proposal')>{{ __('Proposta enviada') }}</option>
                                        <option value="won" @selected($lead->status === 'won')>{{ __('Ganho') }}</option>
                                        <option value="lost" @selected($lead->status === 'lost')>{{ __('Perdido') }}</option>
                                    </select>
                                </label>
                                <button type="submit">{{ __('Salvar alterações') }}</button>
                            </form>
                        </details>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $leads->links() }}
</section>
@endsection
