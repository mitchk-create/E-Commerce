<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>

<?php
session_start();
include "db.php";

if (!isset($_SESSION['user_id'])) {
    die("You must <a href='login.php'>login</a> first.");
}

$user_id = $_SESSION['user_id'];
$total = $_POST['total'] ?? 0;

// Create new order
$sql = "INSERT INTO orders (user_id, order_total, status) VALUES ('$user_id', '$total', 'success')";
if ($conn->query($sql)) {
    $order_id = $conn->insert_id;

    // Example: store products (replace with real cart loop)
    $products = [
        ["Smart Watch", "M", 4000, 1],
        ["Slim Fit Jeans", "32", 2500, 1]
    ];

    foreach ($products as $p) {
        $conn->query("INSERT INTO order_items (order_id, product_name, size, price, quantity) 
                      VALUES ('$order_id', '{$p[0]}', '{$p[1]}', '{$p[2]}', '{$p[3]}')");
    }

    echo "<h2>🎉 Order Successful!</h2>";
    echo "<p>Your order ID is: $order_id</p>";
    echo "<a href='index.php'>Go Back Home</a>";
} else {
    echo "Error: " . $conn->error;
}
?>
