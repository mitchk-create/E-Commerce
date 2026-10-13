<?php
$host = "localhost";
$user = "root";  // default in XAMPP
$pass = "";      // leave empty
$dbname = "ecommerce";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
