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

    public function __construct($dbConnector)
    {
        echo "From Generator Constructor...";
        $this->db = $dbConnector;
        $this->gen_pages(0);
    }

    /* Update = 0 => Does not compile file if file exists, 1 => force 
     * compile */
    public function gen_pages($update)
    {
        echo 'Init...';
        $curState = $this->db->db_init();

        /* Generate default pages */
        foreach($curState['pages'] as $value)
        {

            /* Check if file exists */ 
            if(file_exists(dirname(__FILE__).$this->static_dir.
                $value['slug'].'index.html'))
            {

                if($update = 1)
                {
                    /* Recompile the template anyway */
                }

            }
            else 
            {
                if(is_dir(dirname(__FILE__).$this->static_dir.
                $value['slug']))
                {
                    $file = fopen(dirname(__FILE__).$this->static_dir.
                    $value['slug'].'index.html', 'wb');
                    fclose($file);

                }
                else
                {
                    mkdir(dirname(__FILE__).$this->static_dir.
                        $value['slug'], 0774); 
                    $file = fopen(dirname(__FILE__).$this->static_dir.
                    $value['slug'].'index.html', 'wb');
                    fclose($file);

                }
            }
        }

    }

    /* Read the static dir and create dir structure */
    public function read_static_dir(){
        echo "From Generator Method";
        $static_contents = scandir(dirname(__FILE__).$this->static_dir);
        return $static_contents;
    }
}
