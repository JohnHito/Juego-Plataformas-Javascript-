<?php 
    require '../db.php';

    if($_GET){
        $data = $database->select("tb_game_config","*",[
            "id_game_config" => $_GET['id']
        ]);

        $response = $data[0]["game_data"];
        //echo $response;
        
        //decode json string to array
        $response = json_decode($response, true);

        //encode array to json with pretty print
        echo json_encode($response, JSON_PRETTY_PRINT);
    }

?>