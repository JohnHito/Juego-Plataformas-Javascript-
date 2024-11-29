<?php 
    require '../db.php';
    $configs = $database->select("tb_game_config", "*");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game - config</title>
</head>
<body>
    <h1>Registered Game - Configs</h1>
    <a href="./add.php">Create New JSON</a>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Updated at</th>
            <th>Actions</th>
        </tr>
        <?php 
            foreach($configs as $config){
                echo "
                    <tr>
                        <td>GC-{$config['id_game_config']}</td>
                        <td>{$config['created_at']}</td>
                        <td>{$config['updated_at']}</td>
                        <td>
                            <a target='_blank' href='./api.php?id={$config['id_game_config']}'>View</a>
                            <a href='./edit.php?id={$config['id_game_config']}'>Edit</a>
                            <a href='./delete.php?id={$config['id_game_config']}'>Delete</a>
                        </td>
                    </tr>
                ";
            }
        ?>
    </table>
</body>
</html>