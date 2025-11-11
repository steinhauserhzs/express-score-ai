@if ($errors->any())
    <article class="card" style="border: 1px solid #f87171;">
        <h3>Verifique os campos</h3>
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </article>
@endif
