<?php 
    require '../db.php';

    if($_GET){
        $data = $database->select("tb_game_config","*",[
            "id_game_config"=>$_GET['id']
        ]);
    }
 
    if($_POST){
        date_default_timezone_set('America/Costa_Rica');
        // Reference: https://medoo.in/api/delete
        $database->delete("tb-game-config",[
            "id_game_config"=>$_POST['id']

        ]);
        header("Location: ./index.php");
     }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h3>Delete</h3>
    <p>Are you sure you want to delete this game config?</p>
    <p><strong>GC:</strong> <?php echo $data[0]['id_game_config']; ?></p>
    <form action="./delete.php" method="POST">
        <input type="hidden" name="id" value="<?php echo $_GET['id'];?>">
        <input type="submit" value="Delete">
        <input type="button" value="Cancel" onclick="history.back()">
    </form>
</body>
</html>