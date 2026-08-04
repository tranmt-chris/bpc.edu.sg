<?php
declare(strict_types=1);

const CONTACT_RECIPIENT = 'enquiry@bpc.edu.sg';
const MAX_REQUEST_BYTES = 51200;

function respond(int $status, string $title, string $message): void
{
    http_response_code($status);
    header('Content-Type: text/html; charset=UTF-8');
    header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'");
    header('Referrer-Policy: no-referrer');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');

    $safeTitle = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<title>' . $safeTitle . ' | Buddhist and Pali College of Singapore</title>';
    echo '<style>body{margin:0;background:#f7f3ea;color:#30251f;font-family:Arial,sans-serif}';
    echo 'main{width:min(620px,calc(100% - 40px));margin:12vh auto;padding:clamp(28px,6vw,56px);box-sizing:border-box;background:#fff;border:1px solid #e3d8ca;border-radius:16px;box-shadow:0 18px 45px rgba(55,38,24,.1)}';
    echo 'p:first-child{margin:0 0 10px;color:#a76513;font-size:.78rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase}';
    echo 'h1{margin:0 0 18px;color:#4d2215;font:700 clamp(2rem,7vw,3.2rem)/1.05 Georgia,serif}';
    echo 'p{font-size:1.05rem;line-height:1.7}a{display:inline-block;margin-top:14px;padding:13px 19px;border-radius:7px;background:#a76513;color:#fff;text-decoration:none;font-weight:700}</style></head><body><main>';
    echo '<p>Contact form</p><h1>' . $safeTitle . '</h1><p>' . $safeMessage . '</p>';
    echo '<a href="contact.html">Return to Contact Us</a></main></body></html>';
    exit;
}

function input(string $key, int $maximum): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        respond(400, 'Unable to send enquiry', 'The submitted form was not valid. Please return and try again.');
    }

    $value = trim(str_replace("\0", '', $value));
    $length = function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
    if ($length > $maximum) {
        respond(400, 'Unable to send enquiry', 'One or more fields are too long. Please shorten your message and try again.');
    }
    return $value;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Form submission only', 'Please use the contact form to send an enquiry.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > MAX_REQUEST_BYTES) {
    respond(413, 'Unable to send enquiry', 'The submitted message is too large.');
}

// A filled honeypot is treated as automated spam, but receives a normal response.
if (input('Website', 200) !== '') {
    respond(200, 'Thank you', 'Your enquiry has been received.');
}

$started = input('FormStarted', 30);
if ($started !== '' && ctype_digit($started)) {
    $elapsedMilliseconds = (int) floor(microtime(true) * 1000) - (int) $started;
    if ($elapsedMilliseconds >= 0 && $elapsedMilliseconds < 1500) {
        respond(429, 'Please try again', 'The form was submitted too quickly. Please return and try again.');
    }
}

$allowedSubjects = [
    'General Enquiry',
    'Certificate in Buddhist Counselling',
    'Introduction to Buddhism',
    'Diploma in Buddhism',
    'Bachelor of Arts in Buddhist Studies',
    'Master of Arts in Buddhist Studies',
    'Introduction to Buddhism (Chinese)',
    'Diploma in Buddhism (Chinese)',
];

$subject = input('Subject', 100);
$name = input('Name', 100);
$email = input('Email', 254);
$message = input('Message', 5000);

if (!in_array($subject, $allowedSubjects, true)) {
    respond(400, 'Unable to send enquiry', 'Please select a valid enquiry subject.');
}
if ($name === '' || $message === '') {
    respond(400, 'Unable to send enquiry', 'Please complete your name and message.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
    respond(400, 'Unable to send enquiry', 'Please enter a valid email address.');
}

$mailSubject = '[BPC Website] ' . $subject;
$body = "A new enquiry was submitted through the BPC website.\n\n";
$body .= "Subject: {$subject}\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n\n";
$body .= "Message:\n{$message}\n\n";
$body .= 'Submitted: ' . gmdate('Y-m-d H:i:s') . " UTC\n";
$body .= 'IP address: ' . ($_SERVER['REMOTE_ADDR'] ?? 'Unavailable') . "\n";

$headers = [
    'From: Buddhist and Pali College Website <' . CONTACT_RECIPIENT . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = mail(CONTACT_RECIPIENT, $mailSubject, $body, implode("\r\n", $headers));
if (!$sent) {
    respond(500, 'Unable to send enquiry', 'The mail server could not send your message. Please email enquiry@bpc.edu.sg directly.');
}

respond(200, 'Thank you', 'Your enquiry has been sent to the College. We will respond as soon as possible.');
