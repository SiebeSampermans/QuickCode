<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Start de sessie
session_start();

// Controleren of het formulier is verzonden en of de vereiste variabelen zijn ingesteld
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["username"]) && isset($_POST["password"])) {
    // Gebruikersnaam en wachtwoord van het formulier ophalen
    $gebruikersnaam = $_POST["username"];
    $wachtwoord = $_POST["password"];

    // Include database constante
    include ("../includes/db_const.php");

    // Create connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_BASE, DB_PORT);

    // Controleren op verbinding
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // SQL-query om gegevens te controleren
    $stmt = $conn->prepare("SELECT * FROM Gebruiker WHERE username = ?");
    $stmt->bind_param("s", $gebruikersnaam);
    $stmt->execute();
    $result = $stmt->get_result();

    // Controleren of er overeenkomende gegevens zijn gevonden
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hash = $row["password"];

        // Controleren of het ingevoerde wachtwoord overeenkomt met de gehashte versie in de database
        if (password_verify($wachtwoord, $hash)) {
            // gebruikersnaam meegeven naar admin pagina zodat dit de enigste manier is om aan de admin-pagina te komen.
            $_SESSION["username"] = $gebruikersnaam;
            // Inloggen is gelukt, doorsturen naar de index pagina (ingelogd)
            header("Location: index.php");
            exit;
        } else {
            // Inloggen is mislukt, toon een foutmelding
            $controle = "Verkeerd wachtwoord of gebruikersnaam";
        }
    } else {
        // Inloggen is mislukt, toon een foutmelding
        $controle = "Verkeerd wachtwoord of gebruikersnaam";
    }
    // Verbinding afsluiten

    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>quickCode Login</title>
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/logIn.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>

    <header>
        <div class="header-content">
            <img src="../images/Logo.png" alt="Title Image">
            <h1></h1>
        </div>
        <div class="auth-buttons">
            <a href="../html/index.php" class="auth-link">Back To Main Menu</a>
        </div>
    </header>

<main>
    <div class="login-box">
        <h1>quickCode</h1>
        <p class="slogan">Conquer the code</p>
        <?php if (isset($controle)) : ?>
            <div style="color: red;"><?php echo $controle; ?></div>
        <?php endif; ?>
        <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" class="btn-login">Login</button>
        </form>
        <div class="footer mt-3">New to quickCode? Join the fun today!</div>
    </div>
</main>

<footer>
    <div class="footer-content">
        <a href="#terms">Terms of Service</a>
        <a href="#privacy">Privacy Policy</a>
        <div class="social-icons">
            <a href="https://facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com/" target="_blank"><i class="fab fa-twitter"></i></a>
            <a href="https://instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://discord.com/" target="_blank"><i class="fab fa-discord"></i></a>
        </div>
    </div>
    <p>&copy; 2023 Your Company Name. All rights reserved.</p>
</footer>

</body>
</html>
