<?php

/* Class defines all the static site generator functions : */
/*  - At construction */
/*     - Connects to the db */
/*     - Checks if all required files and folders exist, if not creates them */
/*     - Reads db searching for updates to data */
/*     - Appropriately generates the required .html pages */
/*  - All above functions are invoked in the constructor but are public and */ 
/*    can be independently called */

class StaticGenerator {
    private $static_dir = '/../../../static';
    private $db;
    public function __construct($dbConnector){
        echo "From Generator Constructor...";
        $this->db = $dbConnector;
    }

    /* Read the static dir and create dir structure */
    public function read_static_dir(){
        echo "From Generator Method";
        $static_contents = scandir(dirname(__FILE__).$this->static_dir);
        return $static_contents;
    }
}
