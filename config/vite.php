<?php

return [
    'manifest' => env('VITE_MANIFEST', public_path('build/manifest.json')),

    'build_directory' => 'build',

    'dev_server' => [
        'url' => env('VITE_DEV_SERVER_URL', 'http://localhost:5173'),
    ],
];
