<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/up', function (Request $request) {
    return ['status' => 'ok'];
});
