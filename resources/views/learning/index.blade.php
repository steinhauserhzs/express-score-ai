@extends('layouts.app')

@section('title', __('Trilhas de aprendizagem'))

@section('content')
<section class="card">
    <h1>{{ __('Learning Hub') }}</h1>
    <p style="color:#636e72;">{{ __('Conteúdos personalizados de acordo com seu diagnóstico e evolução.') }}</p>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem;">
        @forelse($resources as $resource)
            <article class="card" style="box-shadow:none; border:1px solid rgba(108,92,231,0.15);">
                <span class="badge badge-success">{{ __($resource->type) }}</span>
                <h2 style="margin-top:0.5rem;">{{ $resource->title }}</h2>
                <p style="color:#636e72;">{{ $resource->summary }}</p>
                <small>{{ __('Tempo estimado: :minutes min', ['minutes' => $resource->estimated_minutes]) }}</small>
                <footer style="margin-top:1rem;">
                    <a href="{{ $resource->url }}" target="_blank" role="button">{{ __('Acessar conteúdo') }}</a>
                </footer>
            </article>
        @empty
            <p>{{ __('Cadastre recursos para liberar esta área.') }}</p>
        @endforelse
    </div>
</section>
@endsection
