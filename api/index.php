<?php

include __DIR__ . "/../vendor/autoload.php";

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

$app = new Application([
    'debug'   => true,
    'version' => 4,
]);

$app->after(function (Request $request, Response $response) {
    $response->headers->set('Access-Control-Allow-Origin', '*');
});

$app->get('/hello', function (Request $request, Application $app) {
    if ($request->get('_version') != $app['version']) {
        throw new HttpException(410, "Wrong version");
    } else {
        return $app->json('hello');
    }
});

$app->run();