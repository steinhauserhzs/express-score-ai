<?php

if (! function_exists('app_name')) {
    function app_name(): string
    {
        return config('app.name', 'Express Score AI');
    }
}
