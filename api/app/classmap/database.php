<?php

require(__DIR__.'/../rb/rb-sqlite.php');
define('DBPath', __DIR__.'/../db/store.db');


class DBConnector {
    public function __construct(){
        if(file_exists(DBPath)){
            /* If file exists setup RedBean */
            R::setup('sqlite:'.DBPath);
        }else{
            $dbf = fopen(DBPath, "wb");
            fclose($dbf);
            R::setup('sqlite:'.DBPath);
        }
    }

    /* Initialize default tables and data */
    public function db_init(){

        $res = array(
            "pages" => array(),
            "categories" => array()
        );

        $tables = R::inspect(); 
        if(in_array('page', $tables)){

            $res['pages'] = R::findAll('page');
            
        }else{

            $page = R::dispense('page');
            $page->title = 'Home';
            $page->slug = '/';
            $page->template = 'home_page.twig';
            $id = R::store($page);

            unset($page, $id);

            $page = R::dispense('page');
            $page->title = 'About';
            $page->slug = '/about/';
            $page->template = 'about_page.twig';
            $id = R::store($page);

            unset($page, $id);
        }

        if(in_array('category', $tables)){
        }else{
        }


        return $res;
    }
    /* Returns all tables */
    public function get_tables(){
        $tables = R::inspect();
        return $tables;
    }

    
}
