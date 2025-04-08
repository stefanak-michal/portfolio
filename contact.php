<?php
ini_set('display_errors', 1);
ini_set('error_reporting', E_ALL);
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed.';
    exit;
}

// Throttling logic
$ip = $_SERVER['REMOTE_ADDR'];
$time = time();
$throttle_limit = 60; // 60 seconds
$max_attempts = 5;

if (!isset($_SESSION['throttle'])) {
    $_SESSION['throttle'] = [];
}

// Remove expired entries
$_SESSION['throttle'] = array_filter($_SESSION['throttle'], function ($timestamp) use ($time, $throttle_limit) {
    return ($time - $timestamp) <= $throttle_limit;
});

// Check if the IP has exceeded the limit
if (count($_SESSION['throttle']) >= $max_attempts) {
    http_response_code(429);
    echo 'Too many requests. Please try again later.';
    exit;
}

// Log the current attempt
$_SESSION['throttle'][] = $time;

$name = htmlspecialchars($_POST['name']);
$email = htmlspecialchars($_POST['email']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Invalid email address.';
    exit;
}
$message = htmlspecialchars($_POST['message']);

$to = 'contact@stefanak.serv00.net';
$subject = 'New Contact Form Submission';
$headers = [
    'From' => $to,
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'PHP/' . phpversion(),
];
$body = "Name: $name\r\nEmail: $email\r\n\r\nMessage:\r\n" . wordwrap($message, 70, "\r\n");

if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo 'Message sent successfully.';
} else {
    http_response_code(500);
    echo 'Failed to send the message.';
}
