<?php
require 'db.php'; // Incluye el archivo de conexión a la base de datos (Medoo)

header('Content-Type: application/json');

try {
    // Usamos Medoo para hacer una consulta con un JOIN para obtener los 10 mejores puntajes junto con el nombre de usuario
    $topScores = $database->select(
        "game_runs", // Tabla principal
        [
            "[><]tb_users" => ["user_id" => "id"] // Hacemos un JOIN con tb_users usando user_id y id
        ],
        [
            "tb_users.username", // Seleccionamos el nombre de usuario
            "game_runs.total_score", // Seleccionamos el puntaje total
            "game_runs.coins",// Seleccionamos el puntaje total
            "game_runs.kills",// Seleccionamos el puntaje total
            "game_runs.time",// Seleccionamos el puntaje total
        ],
        [
            "ORDER" => ["game_runs.total_score" => "DESC"], // Ordenamos por puntaje
            "LIMIT" => 10 // Limitamos los resultados a los 10 primeros
        ]
    );

    // Devolvemos los resultados en formato JSON
    echo json_encode($topScores);

} catch (Exception $e) {
    // En caso de error, devolver el mensaje de error en formato JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
