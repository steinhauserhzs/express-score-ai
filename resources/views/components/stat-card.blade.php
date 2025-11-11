<article class="card">
    <div style="display:flex; align-items:center; justify-content:space-between;">
        <div>
            <p style="margin:0; text-transform:uppercase; font-size:0.75rem; color:#8395a7; letter-spacing:0.08em;">
                {{ $label }}
            </p>
            <strong style="font-size:2rem;">{{ $value }}</strong>
        </div>
        @if ($icon)
            <span style="font-size:2rem;">{{ $icon }}</span>
        @endif
    </div>
    <footer style="margin-top:1rem; color:#636e72;">
        <span class="badge badge-{{ $changeVariant }}">
            {{ $change >= 0 ? '+' : '' }}{{ number_format($change, 1) }}%
        </span>
        {{ __('na última semana') }}
    </footer>
</article>
