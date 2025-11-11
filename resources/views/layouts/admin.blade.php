@extends('layouts.app')

@section('title', __('Admin Panel'))

@section('content')
<div class="grid" style="grid-template-columns: 260px 1fr; gap: 2rem; align-items: flex-start;">
    <aside class="card" style="position: sticky; top: 2rem;">
        <h2>{{ __('Navigation') }}</h2>
        <ul>
            <li><a href="{{ route('admin.dashboard') }}">{{ __('Visão geral') }}</a></li>
            <li><a href="{{ route('admin.leads.index') }}">{{ __('Leads') }}</a></li>
        </ul>
    </aside>
    <section>
        @yield('admin-content')
    </section>
</div>
@endsection
