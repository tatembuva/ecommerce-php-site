<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\NotFoundException;
use Slim\Factory\AppFactory;

/* Composer Bundle Loader */
require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$db = new DBConnector();

$gen = new StaticGenerator($db);


$app->get('/api', function (Request $request, Response $response, $args) {

    $info = phpinfo();
    $response->getBody()->write("SlimPhp Store Api");
    return $response;
    echo $info;

});

$app->get('/api/site-gen', function(Request $request, Response $response, $args){
    global $gen;
    $array = $gen->read_static_dir();
    $response->getBody()->write(print_r($array, true));
    return $response;
});



$app->run();
