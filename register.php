<?php
require 'db.php';
$isValid = null;

if ($_POST) {
    $username = $_POST["name"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $confirmPassword = $_POST["confirm_password"];

    // Verificar si las contraseñas coinciden
    if ($password !== $confirmPassword) {
        $isValid = false;
        echo '<p class="message">Passwords do not match</p>';
    } else {
        // Comprobar si el usuario ya existe
        $existingUser = $database->select("tb_users", "*", [
            "username" => $username
        ]);

        if (count($existingUser) > 0) {
            $isValid = false;
            echo '<p class="message">Username already exists</p>';
        } else {
            // Insertar el nuevo usuario en la base de datos
            $database->insert("tb_users", [
                "username" => $username,
                "email" => $email,
                "password" => password_hash($password, PASSWORD_BCRYPT),
                "role" => 'user'
            ]);
            $isValid = true;
            echo '<p class="message">Registration successful</p>';
            // Redirige al usuario a la página de inicio de sesión
            header("Location: response.php?message=" . urlencode("Registrado correctamente, Ok para loguearte") . "&redirect=" . urlencode("login.php"));

            exit;
        }
    }
}
?>

<!doctype html>
<html class="no-js" lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Slimy Game</title>

    <link rel="stylesheet" href="Juego-Plataformas/css/main.css">
    <meta name="description" content="">

    <meta property="og:title" content="">
    <meta property="og:type" content="">
    <meta property="og:url" content="">
    <meta property="og:image" content="">
    <meta property="og:image:alt" content="">

    <link rel="icon" href="/icon.ico" sizes="any">
    <link rel="icon" href="/icon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="icon.png">

    <link rel="manifest" href="site.webmanifest">
    <meta name="theme-color" content="#fafafa">

    <!-- fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@100;300;400;900&display=swap"
        rel="stylesheet">
</head>

<body class="clr-bg">


    <section>
        <header class="on-top">
            <nav class="top-nav">

                <!-- LOGO -->
                <img class="main-logo" src="Juego-Plataformas/img/logo.png" alt="logo">

                <!-- NAV -->
                <ul class="nav-list">
                    <li><a class="nav-list-link" href="Juego-Plataformas/index.html">Principal</a></li>
                    <li><a class="nav-list-link" href="Juego-Plataformas/html/game.html">Game</a></li>
                    <li><a class="nav-list-link" href="login.html">Story</a></li>
                    <li><a class="nav-list-link" href="ranking.html">Rankings</a></li>
                </ul>
                <!-- LOGIN BTN -->
                <a class="btn login-btn" href="login.php">LOGIN</a>
            </nav>
        </header>
        <!-- FIRST BG IMAGE -->
        <img class="full-width3" src="Juego-Plataformas/img/bg1.png" alt="background">
    </section>

    <div class="login-sub-container">
    <img class="login-logo" src="Juego-Plataformas/img/logo.png" alt="logo">

        <div class="login-container">

            <form action="./register.php" method="POST">
                <input type="text" name="name" placeholder="Username" required>
                <input type="text" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <input type="password" name="confirm_password" placeholder="Confirm Password" required>

                <div class="button-group">
                    <input class="btn" type="submit" value="Register">
                </div>

            </form>

        </div>
    </div>

</body>

</html>