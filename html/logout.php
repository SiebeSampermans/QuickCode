<?php
session_start();
session_unset();  // Verwijdert alle sessievariabelen
session_destroy(); // Beëindig de sessie
header("Location: login.php"); // Stuur terug naar de loginpagina
exit;
