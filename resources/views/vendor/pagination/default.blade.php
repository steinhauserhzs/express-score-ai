@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Pagination Navigation" class="pagination">
        <ul style="display:flex; gap:0.5rem; list-style:none; padding:0;">
            {{-- Previous Page Link --}}
            @if ($paginator->onFirstPage())
                <li><span class="secondary outline" aria-disabled="true">&lsaquo;</span></li>
            @else
                <li><a class="secondary outline" href="{{ $paginator->previousPageUrl() }}" rel="prev">&lsaquo;</a></li>
            @endif

            {{-- Pagination Elements --}}
            @foreach ($elements as $element)
                @if (is_string($element))
                    <li><span class="secondary outline" aria-disabled="true">{{ $element }}</span></li>
                @endif

                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <li><span class="secondary" aria-current="page">{{ $page }}</span></li>
                        @else
                            <li><a class="secondary outline" href="{{ $url }}">{{ $page }}</a></li>
                        @endif
                    @endforeach
                @endif
            @endforeach

            {{-- Next Page Link --}}
            @if ($paginator->hasMorePages())
                <li><a class="secondary outline" href="{{ $paginator->nextPageUrl() }}" rel="next">&rsaquo;</a></li>
            @else
                <li><span class="secondary outline" aria-disabled="true">&rsaquo;</span></li>
            @endif
        </ul>
    </nav>
@endif
