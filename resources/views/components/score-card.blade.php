<article class="card">
    <header style="display:flex; justify-content: space-between; align-items:center; margin-bottom: 1rem;">
        <div>
            <h2 style="margin:0; font-weight:700;">{{ $title }}</h2>
            @if ($subtitle)
                <p style="margin:0; color:#636e72;">{{ $subtitle }}</p>
            @endif
        </div>
        <span class="badge badge-{{ $badge }}">{{ __('Score') }}</span>
    </header>
    <div style="display:flex; align-items:flex-end; gap: 1.5rem;">
        <strong style="font-size:3rem;">{{ $score }}</strong>
        @if (! is_null($change))
            <span class="chip" style="background: rgba(76, 201, 240, 0.12); color:#0984e3;">
                {{ number_format($change, 1) }}%
                {{ $change >= 0 ? __('acima do diagnóstico anterior') : __('abaixo do diagnóstico anterior') }}
            </span>
        @endif
    </div>
    <div style="margin-top:1.5rem;">
        {{ $slot }}
    </div>
</article>
