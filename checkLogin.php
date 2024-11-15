<?php
session_start();
//var_dump($_SESSION);
// Check if the user is logged in
if (isset($_SESSION['username'])) {
    // Assuming you store the user ID in the session when the user logs in

    echo json_encode([
        'loggedIn' => true,
        'username' => $_SESSION['username'],
        'role' => $_SESSION['role'],
        'id' => $_SESSION['id']
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>
