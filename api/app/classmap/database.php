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
            $page->pageDataId = $this->new_page_data('Home');
            $page->slug = '/';
            $page->template = 'home_page.twig';
            $id = R::store($page);

            unset($page, $id);

            $page = R::dispense('page');
            $page->title = 'About';
            $page->pageDataId = $this->new_page_data('About');
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
    /* Create new page-data row */ 
    private function new_page_data($title)
    {

            $page_data = R::dispense('pagedata');
            $page_data->page = $title;
            $page_data->pageTitle = '';
            $page_data->seo = '';
            $data_id = R::store($page_data);

    
            return $data_id;
    }
    /* Get a pages page data from pagedata table */
    public function get_page_data($id)
    {
        $page_data = R::load('pagedata', $id);
        /* Returns an object so typecasting to array is needed here */
        $array = (array) $page_data;
        return $array["\0*\0" . "properties"];
    }

    public function get_product($id){
        //Prepare Query
        $product = R::findAll('product');
        $item = R::load('product', $product[$id]->id);

        return $item;
    }

    public function get_order($id){
        //Prepare Query
        $product = R::findAll('order');
        $item = R::load('order', $order[$id]->client_id);

        return $item;
    }

    public function post_order($data){
        //Prepare Query
        $order = R::dispense('order');
        $order->items = $data['str_items'];
        $order->total_price = $data['totalPrice'];
        $order->total_qnty = $data['totalQty'];
        $order->client_id = $data['client_id'];
        $order->order_date = $data['order_date'];
        $id = R::store($order);

        return $id;
    }


    
}
