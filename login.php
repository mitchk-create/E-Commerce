<?php
session_start();
include 'db.php';

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    $sql = "SELECT * FROM users WHERE email=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();

        if (password_verify($password, $row['password'])) {
            $_SESSION['user'] = $row['name'];
            header("Location: success.php"); // redirect after login
            exit();
        } else {
            $error = "Invalid password!";
        }
    } else {
        $error = "No account found with that email!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <style>
        body { font-family: Arial; display: flex; justify-content: center; margin-top: 50px; }
        .box { width: 300px; padding: 20px; border: 1px solid #ccc; border-radius: 6px; }
        input { width: 100%; padding: 10px; margin: 10px 0; }
        button { width: 100%; padding: 10px; background: orange; border: none; color: white; font-weight: bold; }
        .error { color: red; font-size: 14px; }
    </style>
</head>
<body>
    <div class="box">
        <h2>Login</h2>
        <form action="success.php" method="POST">
            <input type="email" name="email" placeholder="Email" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
        <p class="error"><?php echo $error; ?></p>
        <p>Not registered? <a href="register.php">Create an account</a></p>
    </div>
</body>
</html>
