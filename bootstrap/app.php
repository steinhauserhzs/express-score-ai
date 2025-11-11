<?php

use Illuminate\Foundation\Application;

$app = new Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

$app->useAppPath($app->basePath('app'));
$app->useBootstrapPath($app->basePath('bootstrap'));
$app->useConfigPath($app->basePath('config'));
$app->useDatabasePath($app->basePath('database'));
$app->useLangPath($app->basePath('lang'));
$app->usePublicPath($app->basePath('public'));
$app->useResourcePath($app->basePath('resources'));
$app->useStoragePath($app->basePath('storage'));

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

return $app;
