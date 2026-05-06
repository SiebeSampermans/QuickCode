<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Connectiegegevens database ophalen
include ("../includes/db_const.php");

// Maak verbinding met de db
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_BASE, DB_PORT);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query om gebruikers + ranks op te halen
$sql = "SELECT Gebruiker.username , Gebruiker.score, Level.name
FROM Gebruiker 
JOIN Level on Level.levelId = Gebruiker.levelID 
ORDER BY `Gebruiker`.`score` DESC
LIMIT 10";
$result = $conn->query($sql);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Typeracer Game</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>

<header>
    <div class="header-content">
        <img src="../images/Logo.png" alt="Title Image">
        <h1></h1>
    </div>
    <div class="auth-buttons">
        <?php if (isset($_SESSION['username'])): ?>
            <a href="logout.php" class="auth-link">Logout</a>
        <?php else: ?>
            <a href="../html/login.php" class="auth-link">Login</a>
            <a href="../html/register.php" class="auth-link">Register</a>
        <?php endif; ?>
    </div>

</header>

<main>
<div class="button-container">
   <a href="../html/singleplayer.html" class="button-link">
       
       <span>Single player</span>
   </a>
   <a href="../html/multiplayer.php" class="button-link">Multiplayer</a>
</div>

    <div class="instructions">
        <h2>Instructions</h2>
        <p>Welcome to Quickcode! In this game, you will race against time to type out code snippets as quickly and accurately as possible.</p>
        <p>Choose between Single player mode to practice your typing skills or Multiplayer mode to compete against friends or other players online.</p>
        <p>Good luck, and may the fastest typist win!</p>
    </div>

    <div class="scoreboard">
        <h2>Scoreboard</h2>
        <table>
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Rank</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            echo "<tr>";
                            echo "<td>" . htmlspecialchars($row['username']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['name']) . "</td>";
                            echo "<td>" . $row['score'] . "</td>";
                            echo "</tr>";
                        }
                    } else {
                        echo "<tr><td colspan='3'>No players found</td></tr>";
                    }
                ?>
            </tbody>
        </table>
    </div>
</main>

<footer>
    <div>
        <a href="#terms">Terms of Service</a>
        <a href="#privacy">Privacy Policy</a>
        <div class="social-icons">
            <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
            <a href="https://instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://discord.com" target="_blank"><i class="fab fa-discord"></i></a>
        </div>
    </div>
    <p>&copy; 2023 Your Company Name. All rights reserved.</p>
</footer>

</body>
</html>
