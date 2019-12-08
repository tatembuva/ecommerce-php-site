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

$app->get('/api/new-cat', function(Request $request, Response $response, $args){
    global $gen;
    $array = $gen->read_static_dir();
    $response->getBody()->write(print_r($array, true));
    return $response;
});

$app->get('/api/site-gen', function(Request $request, Response $response, $args){
    global $gen;
    $array = $gen->read_static_dir();
    $response->getBody()->write(print_r($array, true));
    return $response;
});

$app->get('/api/get-product/{id}', function(Request $request, Response $response, $args){
   
    global $db;

    $id = $args['id'];
    $data = array($db-> get_product($id));
    $payload = json_encode($data);

    $response->getBody()->write($payload);

    return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
});

$app->get('/api/get-orders/{client-id}', function(Request $request, Response $response, $args){
   
    global $db;

    $id = $args['client-id'];
    $data = array($db-> get_order($id));
    $payload = json_encode($data);

    $response->getBody()->write($payload);

    return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
});


$app->post('/api/new-order',
    function ( Request $request, Response $response, array $args) {
        global $db;
        $req = $request->getParsedBody();

        $data = array($db-> post_order($req));
        $payload = json_encode($data);

        $response->getBody()->write($payload);
        //Return new response obj to client
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
);


$app->run();
