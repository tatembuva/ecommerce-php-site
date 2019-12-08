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
    private $template_dir = '/../templates';
    private $db;

    public function __construct($dbConnector)
    {
        //echo "From Generator Constructor...";
        $this->db = $dbConnector;
        $this->gen_pages(1);
    }

    /* Update = 0 => Does not compile file if file exists, 1 => force 
     * compile */
    public function gen_pages($update)
    {
        //echo 'Init...';
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
                    $temp_text = $this->compile_template($value['template'],
                    $value['page_data_id']);
                    file_put_contents(dirname(__FILE__).$this->static_dir.
                $value['slug'].'index.html', $temp_text);
                    
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

    /* Compile page template */
    private function compile_template($template, $dataId){
        
        $data = $this->db->get_page_data($dataId);
        //echo '<br />';
        //echo $dataId;
        //print_r($data);

        $loader = new \Twig\Loader\FilesystemLoader(
            dirname(__FILE__).$this->template_dir );

        $twig = new \Twig\Environment($loader);

        $output = $twig->render($template, $data);

        return $output;


    }

    /* Read the static dir and create dir structure */
    public function read_static_dir(){
        //echo "From Generator Method";
        $static_contents = scandir(dirname(__FILE__).$this->static_dir);
        return $static_contents;
    }
}
