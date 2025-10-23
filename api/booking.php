<?php
// booking.php — handles booking form submissions via Gmail SMTP (PHPMailer)
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
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Rate limiting - 10 requests per minute per IP
function rateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $rateLimitFile = sys_get_temp_dir() . '/booking_rate_' . md5($ip);
    $now = time();
    $window = 60; // 1 minute window
    
    if (file_exists($rateLimitFile)) {
        $data = json_decode(file_get_contents($rateLimitFile), true);
        if ($data['time'] > $now - $window) {
            if ($data['count'] >= 10) {
                http_response_code(429);
                header('Retry-After: ' . ($data['time'] + $window - $now));
                echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again later.']);
                exit();
            }
            $data['count']++;
        } else {
            $data = ['count' => 1, 'time' => $now];
        }
    } else {
        $data = ['count' => 1, 'time' => $now];
    }
    
    file_put_contents($rateLimitFile, json_encode($data));
}

// Apply rate limiting
rateLimit();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST, OPTIONS');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

// Read environment variables with validation
$requiredEnvVars = [
    'MAIL_HOST',
    'MAIL_USERNAME',
    'MAIL_PASSWORD',
    'MAIL_PORT',
    'MAIL_ENCRYPTION',
    'MAIL_FROM_ADDRESS',
    'MAIL_FROM_NAME',
    'MAIL_TO',
    'RECAPTCHA_SECRET_KEY'
];

$missingVars = [];
foreach ($requiredEnvVars as $var) {
    if (empty(getenv($var))) {
        $missingVars[] = $var;
    }
}

if (!empty($missingVars)) {
    error_log('Missing required environment variables: ' . implode(', ', $missingVars));
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit();
}

$mailHost = getenv('MAIL_HOST');
$mailUsername = getenv('MAIL_USERNAME');
$mailPassword = getenv('MAIL_PASSWORD');
$mailPort = (int)getenv('MAIL_PORT');
$mailEncryption = getenv('MAIL_ENCRYPTION');
$mailFrom = getenv('MAIL_FROM_ADDRESS');
$mailFromName = getenv('MAIL_FROM_NAME');
$mailTo = getenv('MAIL_TO');
$mailPrefix = getenv('MAIL_SUBJECT_PREFIX') ?: '[Rabaul Hotel]';
$recaptchaSecret = getenv('RECAPTCHA_SECRET_KEY');

// Read and validate JSON input
$jsonData = json_decode(file_get_contents('php://input'), true);
$data = $jsonData !== null ? $jsonData : $_POST;

// Verify reCAPTCHA token
$recaptchaToken = $data['recaptchaToken'] ?? '';
if (empty($recaptchaToken)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA token is required']);
    exit();
}

$recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify?secret=$recaptchaSecret&response=$recaptchaToken";
$recaptchaResponse = @file_get_contents($recaptchaUrl);
$recaptchaData = json_decode($recaptchaResponse);

if (!$recaptchaData || !$recaptchaData->success || $recaptchaData->score < 0.5) {
    error_log('reCAPTCHA verification failed: ' . ($recaptchaData->{'error-codes'}[0] ?? 'Unknown error'));
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'reCAPTCHA verification failed']);
    exit();
}

// Sanitize and validate input
function sanitizeInput($data, $key, $type = 'string', $required = true) {
    if ($required && !isset($data[$key])) {
        return null;
    }
    
    $value = $data[$key] ?? '';
    
    switch ($type) {
        case 'email':
            $value = filter_var(trim($value), FILTER_SANITIZE_EMAIL);
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                return null;
            }
            break;
        case 'int':
            $value = (int)$value;
            if ($value < 0) {
                return null;
            }
            break;
        case 'date':
            $value = date('Y-m-d', strtotime($value));
            if ($value === '1970-01-01') {
                return null;
            }
            break;
        case 'phone':
            $value = preg_replace('/[^0-9+]/', '', $value);
            if (empty($value)) {
                return null;
            }
            break;
        default: // string
            $value = htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
            if (empty($value) && $required) {
                return null;
            }
    }
    
    return $value;
}

// Validate and sanitize all inputs
$name = sanitizeInput($data, 'name');
$email = sanitizeInput($data, 'email', 'email');
$phone = sanitizeInput($data, 'phone', 'phone');
$checkIn = sanitizeInput($data, 'checkIn', 'date');
$checkOut = sanitizeInput($data, 'checkOut', 'date');
$adults = sanitizeInput($data, 'adults', 'int');
$children = sanitizeInput($data, 'children', 'int', false) ?? 0;
$roomType = sanitizeInput($data, 'roomType');
$specialRequests = sanitizeInput($data, 'specialRequests', 'string', false) ?? '';

// Validate required fields
$missing = [];
$fields = [
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'checkIn' => $checkIn,
    'checkOut' => $checkOut,
    'roomType' => $roomType,
    'adults' => $adults
];

foreach ($fields as $key => $value) {
    if ($value === null) {
        $missing[] = $key;
    }
}

if ($missing) {
    error_log('Missing or invalid fields: ' . implode(', ', $missing));
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Please fill in all required fields correctly',
        'missing' => $missing
    ]);
    exit();
}

// Validate date range
if (strtotime($checkIn) >= strtotime($checkOut)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Check-out date must be after check-in date'
    ]);
    exit();
}

// Validate number of guests
$totalGuests = $adults + $children;
if ($totalGuests < 1 || $totalGuests > 10) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Total number of guests must be between 1 and 10'
    ]);
    exit();
}

// Email templates
$clientSubject = 'Your Booking Confirmation - Rabaul Hotel';
$clientBody = "
<h2>Thank you for your booking, {$name}!</h2>
<p>We've received your booking request and will process it shortly.</p>
<h3>Booking Details:</h3>
<p><strong>Check-in:</strong> {$checkIn}</p>
<p><strong>Check-out:</strong> {$checkOut}</p>
<p><strong>Room Type:</strong> {$roomType}</p>
<p><strong>Adults:</strong> {$adults}</p>
<p><strong>Children:</strong> {$children}</p>
<p><strong>Special Requests:</strong> " . ($specialRequests ?: 'None') . "</p>
<p>Best regards,<br>Rabaul Hotel Team</p>";

$adminSubject = "{$mailPrefix} New Booking from {$name}";
$adminBody = "
<h2>New Booking Received</h2>
<p><strong>Name:</strong> {$name}</p>
<p><strong>Email:</strong> {$email}</p>
<p><strong>Phone:</strong> {$phone}</p>
<p><strong>Check-in:</strong> {$checkIn}</p>
<p><strong>Check-out:</strong> {$checkOut}</p>
<p><strong>Room Type:</strong> {$roomType}</p>
<p><strong>Adults:</strong> {$adults}</p>
<p><strong>Children:</strong> {$children}</p>
<p><strong>Special Requests:</strong> " . ($specialRequests ?: 'None') . "</p>";

// Log the booking attempt
$logMessage = sprintf(
    "[%s] Booking attempt - Name: %s, Email: %s, Room: %s, Check-in: %s, Check-out: %s, IP: %s\n",
    date('Y-m-d H:i:s'),
    $name,
    $email,
    $roomType,
    $checkIn,
    $checkOut,
    $_SERVER['REMOTE_ADDR'] ?? 'unknown'
);

error_log($logMessage, 3, __DIR__ . '/../storage/logs/booking.log');

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $mailHost;
    $mail->SMTPAuth = true;
    $mail->Username = $mailUsername;
    $mail->Password = $mailPassword;
    $mail->SMTPSecure = $mailEncryption;
    $mail->Port = $mailPort;
    $mail->SMTPDebug = 0; // Disable debug output in production
    $mail->Debugoutput = function($str, $level) {
        error_log("PHPMailer: $str");
    };

    $mail->setFrom($mailFrom, $mailFromName);

    // Send to client
    $mail->addAddress($email, $name);
    $mail->isHTML(true);
    $mail->Subject = $clientSubject;
    $mail->Body = $clientBody;
    $mail->send();
    
    // Log successful client email
    error_log("Confirmation email sent to: $email", 3, __DIR__ . '/../storage/logs/email.log');

    // Send to admin
    $mail->clearAddresses();
    $mail->addAddress($mailTo, 'Rabaul Hotel Admin');
    $mail->addReplyTo($email, $name);
    $mail->Subject = $adminSubject;
    $mail->Body = $adminBody;
    $mail->send();
    
    // Log successful admin email
    error_log("Notification email sent to admin: $mailTo", 3, __DIR__ . '/../storage/logs/email.log');

    // Log successful booking
    error_log("Booking successful for: $name ($email)", 3, __DIR__ . '/../storage/logs/booking.log');

    echo json_encode([
        'success' => true, 
        'message' => 'Booking request received! Check your email for confirmation.'
    ]);
} catch (Exception $e) {
    $errorMessage = 'Email failed: ' . $e->getMessage();
    error_log($errorMessage, 3, __DIR__ . '/../storage/logs/error.log');
    
    // Log detailed error for debugging
    error_log("Error details: " . print_r([
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ], true), 3, __DIR__ . '/../storage/logs/error.log');
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'An error occurred while processing your request. Please try again later.'
    ]);
}
?>
