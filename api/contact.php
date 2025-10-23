<?php
// contact.php — handles contact form submissions via Gmail SMTP (PHPMailer)
header('Content-Type: application/json');

// Allow CORS
$allowedOrigins = [
    'https://rabaulhotel.com',
    'https://www.rabaulhotel.com',
    'https://cms.rabaulhotel.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

// Read environment variables
$mailHost = getenv('MAIL_HOST');
$mailUsername = getenv('MAIL_USERNAME');
$mailPassword = getenv('MAIL_PASSWORD');
$mailPort = getenv('MAIL_PORT');
$mailEncryption = getenv('MAIL_ENCRYPTION');
$mailFrom = getenv('MAIL_FROM_ADDRESS');
$mailFromName = getenv('MAIL_FROM_NAME');
$mailTo = getenv('MAIL_TO');
$mailPrefix = getenv('MAIL_SUBJECT_PREFIX') ?: '[Rabaul Hotel]';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// Sanitize
$name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$subject = filter_var($data['subject'] ?? 'No Subject', FILTER_SANITIZE_STRING);
$message = filter_var($data['message'] ?? '', FILTER_SANITIZE_STRING);

// Validate
if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide valid name, email, and message']);
    exit();
}

// Email templates
$clientSubject = 'Thank you for contacting Rabaul Hotel';
$clientBody = "
<h2>Thank you for your message, {$name}!</h2>
<p>We've received your message and will get back to you soon.</p>
<p>Your message: " . nl2br(htmlspecialchars($message)) . "</p>
<p>We'll respond to: {$email}</p>
<p>Best regards,<br>Rabaul Hotel Team</p>";

$adminSubject = "{$mailPrefix} New Contact from {$name}";
$adminBody = "
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> {$name} &lt;{$email}&gt;</p>
<p><strong>Subject:</strong> {$subject}</p>
<p><strong>Message:</strong></p>
<p>" . nl2br(htmlspecialchars($message)) . "</p>";

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $mailHost;
    $mail->SMTPAuth = true;
    $mail->Username = $mailUsername;
    $mail->Password = $mailPassword;
    $mail->SMTPSecure = $mailEncryption;
    $mail->Port = $mailPort;

    $mail->setFrom($mailFrom, $mailFromName);

    // Send to client
    $mail->addAddress($email, $name);
    $mail->isHTML(true);
    $mail->Subject = $clientSubject;
    $mail->Body = $clientBody;
    $mail->send();

    // Send to admin
    $mail->clearAddresses();
    $mail->addAddress($mailTo, 'Rabaul Hotel Admin');
    $mail->addReplyTo($email, $name);
    $mail->Subject = $adminSubject;
    $mail->Body = $adminBody;
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Email failed: ' . $e->getMessage()]);
}
?>
