<?php 
    namespace Medoo;
    require 'Medoo.php';
     
    if(!isset($database)){
        /* 
        - For Laragon: username='root' / password=''
        - For MAMP: username='root' / password='root'
          */
        $database = new Medoo([
            'type'=>'mysql',
            'host' => '127.0.0.1',
            'database' => 'player_db',
            'username' => 'root',
            'password' => ''
        ]);
    }
?>