<?php
require 'db.php';
$isValid = null;

if ($_POST) {
    $user = $database->select("tb_users", "*", [
        "username" => $_POST["name"]
    ]);

    if (count($user) > 0) {
        if (password_verify($_POST["password"], $user[0]["password"])) {
            session_start();
            $_SESSION["username"] = $user[0]["username"];
            $_SESSION["role"] = $user[0]["role"];
            $_SESSION["id"] = $user[0]["id"];

            echo json_encode(['loggedIn' => true, 'username' => $user[0]["username"], 'role' => $user[0]["role"], 'id' => $user[0]["id"]]);
            // Verifica el rol del usuario y redirige
            if ($user[0]["role"] === 'admin') {
                header("Location: Juego-Plataformas/html/game.html");
            } elseif ($user[0]["role"] === 'user') {
                header("Location: Juego-Plataformas/html/game.html");
            }
            exit;
        } else {
            $isValid = false;
        }
    } else {
        $isValid = false;
    }
}
// If credentials are invalid, return error response
if ($isValid === false) {
    echo json_encode(['loggedIn' => false]);
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
                <a class="btn login-btn" href="#">LOGIN</a>
            </nav>
        </header>
        <!-- FIRST BG IMAGE -->
        <img class="full-width3" src="Juego-Plataformas/img/bg1.png" alt="background">
    </section>

    <div class="login-sub-container">
        <img class="login-logo" src="Juego-Plataformas/img/logo.png" alt="logo">

        <div class="login-container">
            <form action="./login.php" method="POST">
                <input type="text" name="name" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <?php
                if ($isValid === false) {
                    echo '<p class="message">Invalid username or password</p>';
                }
                ?>
                <div class="button-group">
                    <a href="register.php" class="btn">Register</a>
                    <input class="btn" type="submit" value="Login">

                </div>
            </form>

        </div>
    </div>

</body>

</html>