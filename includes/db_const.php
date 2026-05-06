<?php
/**
 * Database configuration loader.
 *
 * Priority:
 * 1. Environment variables (works well on Railway/Aiven/other hosts)
 * 2. Optional local override file: includes/db_local.php
 * 3. Safe defaults for local development
 */

$dbLocalConfig = [];
$dbLocalPath = __DIR__ . '/db_local.php';

if (file_exists($dbLocalPath)) {
    include $dbLocalPath;
}

function dbConfigValue(array $keys, $fallback = '')
{
    global $dbLocalConfig;

    foreach ($keys as $key) {
        $envValue = getenv($key);
        if ($envValue !== false && $envValue !== '') {
            return $envValue;
        }

        if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
            return $_ENV[$key];
        }

        if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') {
            return $_SERVER[$key];
        }

        if (isset($dbLocalConfig[$key]) && $dbLocalConfig[$key] !== '') {
            return $dbLocalConfig[$key];
        }
    }

    return $fallback;
}

define('DB_HOST', dbConfigValue(['DB_HOST', 'MYSQLHOST'], '127.0.0.1'));
define('DB_PORT', (int) dbConfigValue(['DB_PORT', 'MYSQLPORT'], '3306'));
define('DB_USER', dbConfigValue(['DB_USER', 'MYSQLUSER'], 'root'));
define('DB_PASS', dbConfigValue(['DB_PASS', 'MYSQLPASSWORD'], ''));
define('DB_BASE', dbConfigValue(['DB_BASE', 'MYSQLDATABASE'], 'quickcode'));
define(
    'DB_PDO_DSN',
    'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_BASE . ';charset=utf8mb4'
);
?>
