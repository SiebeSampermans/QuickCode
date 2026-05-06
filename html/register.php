<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include("../includes/db_const.php");

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_BASE, DB_PORT);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get and sanitize inputs
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = $_POST['password'] ?? '';

    // Check if username or email already exists
    $stmt = $conn->prepare("SELECT userId FROM Gebruiker WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        die("Username or email already exists.");
    }
    $stmt->close();

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Default levelID and score
    $defaultLevelID = 1;
    $defaultScore = 0;

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO Gebruiker (username, password, email, levelID, score) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssii", $username, $hashedPassword, $email, $defaultLevelID, $defaultScore);

    if ($stmt->execute()) {
        $_SESSION['username'] = $username;
        header("Location: ../index.php");
        exit;
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Quick Code Sign-Up</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../css/register.css" />
</head>
<body>
<header>
  <div class="header-content">
      <img src="../images/Logo.png" alt="Title Image">
      <h1></h1>
  </div>
  <div class="auth-buttons">
      <a href="../html/index.html" class="auth-link">Back To Main Menu</a>
  </div>
</header>

<!-- Main content -->
<div class="container-fluid py-5" id="main-section">
  <div class="row justify-content-center align-items-center">
    <!-- Info Text -->
    <div class="col-lg-5 text-white mb-4 mb-lg-0">
      <h2 class="mb-3">Start coding instantly</h2>
      <p>Access developer-friendly tools to build, test, and deploy your code with speed.</p>
      <h2 class="mt-4 mb-3">Built for every coder</h2>
      <p>Whether you're building web apps, APIs, or automating tasks—Quick Code supports every stack.</p>
      <h2 class="mt-4 mb-3">Join a thriving dev community</h2>
      <p>Quick Code is trusted by thousands of developers and teams around the world.</p>
    </div>

    <!-- Sign-Up Form -->
    <div class="col-lg-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="mb-4">Create your Quick Code account</h4>
          <form action="register.php" method="POST">
            <div class="mb-3">
              <input type="email" name="email" class="form-control" placeholder="Email" required />
            </div>
            <div class="mb-3">
              <input type="text" name="username" class="form-control" placeholder="Full name" required />
            </div>
            <div class="mb-3">
              <input type="password" name="password" class="form-control" placeholder="Password" required />
            </div>
            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" id="updatesCheck" />
              <label class="form-check-label" for="updatesCheck">
                Get updates about new features, coding tips, and events.
              </label>
            </div>
            <button type="submit" class="btn btn-success w-100">Create account</button>
          </form>
          <p class="text-center mt-3 mb-0">
            Already have an account? <a href="#">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
