<?php
require 'db.php';
$isValid = null;

if ($_POST) {
    $user = $database->select("tb_users", "*", [
        "username" => $_POST["name"]
    ]);

    if (count($user) > 0) {
        if ($_POST["password"] == $user[0]["password"]) {
            session_start();
            $_SESSION["username"] = $user[0]["username"];

            // Verifica el rol del usuario y redirige
            if ($user[0]["role"] === 'admin') {
                header("Location: ./admin.php");
            } elseif ($user[0]["role"] === 'student') {
                header("Location: ./student.php");
            }
            exit;
        } else {
            $isValid = false;
        }
    } else {
        $isValid = false;
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="styles.css">

</head>

<body>
    <div class="login-container">
        <h1>Login</h1>
        <form action="./login.php" method="POST">
            <input type="text" name="name" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="submit" value="Login">
        </form>
        <?php
        if ($isValid === false) {
            echo '<p class="message">Invalid username or password</p>';
        }
        ?>
    </div>
</body>

</html>
