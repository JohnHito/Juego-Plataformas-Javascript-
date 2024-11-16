<?php
require 'db.php';  // Include your database connection
// Get the raw POST data (JSON)
$inputData = file_get_contents("php://input");

// Decode the JSON into a PHP associative array
$data = json_decode($inputData, true);

if ($data) {
    // Extract values from the received data
    $userId = $data['user_id'];
    $totalScore = $data['total_score'];
    $keys = $data['keys'];
    $coins = $data['coins'];
    $kills = $data['kills'];
    $seed = $data['seed'];
    $time = $data['time'];

    // Insert the game_run data into the database
    $result = $database->insert("game_runs", [
        "user_id" => $userId,
        "total_score" => $totalScore,
        "keys" => $keys,
        "coins" => $coins,
        "kills" => $kills,
        "seed" => $seed,
        "time" => $time,

    ]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Game run saved successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save game run"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid data received"]);
}
?>
