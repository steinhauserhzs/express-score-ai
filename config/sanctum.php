<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')), 

    'guard' => ['web'],

    'expiration' => 120,
];
