<?php

require(__DIR__.'/../rb/rb-sqlite.php');

class DBConnector {
    public function __construct(){
        R::setup();

        $w = R::dispense( 'page' );
        $w->name = "HomePage";
        $id = R::store( $w );

        $e = R::dispense('page');
        $e->name = "AboutUsPage";
        $idtwo = R::store($e);

        $pages = R::findAll('page');
        echo json_encode($pages);
    }
}
