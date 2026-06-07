<?php
/**
 * Shared Resend mailer for the site's PHP forms
 * (data deletion request + invitation request).
 *
 * The API key lives in pages/config.php (gitignored). Copy
 * pages/config.example.php to pages/config.php on the server and paste
 * your key. The key is never sent to the browser.
 */

$__configPath = __DIR__ . '/config.php';
if (file_exists($__configPath)) {
    require_once $__configPath;
}

$RESEND_API_KEY = getenv('RESEND_API_KEY') ?: (defined('RESEND_API_KEY') ? RESEND_API_KEY : '');
$RESEND_FROM    = 'Divine Christian Assembly Global <noreply@divinechristianassembly.com>';

if (!function_exists('e')) {
    /** HTML-escape a value for safe output. */
    function e($value) {
        return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('send_via_resend')) {
    /**
     * Send an email through Resend.
     *
     * @param string       $apiKey  Resend API key
     * @param string       $from    "Name <addr@domain>"
     * @param string|array $to      One recipient or a list of recipients
     * @param string       $replyTo Reply-to address (usually the requester)
     * @param string       $subject Email subject
     * @param string       $html    HTML body
     * @return array [bool $success, string $error]
     */
    function send_via_resend($apiKey, $from, $to, $replyTo, $subject, $html) {
        $payload = json_encode([
            'from'     => $from,
            'to'       => is_array($to) ? array_values($to) : [$to],
            'reply_to' => $replyTo,
            'subject'  => $subject,
            'html'     => $html,
        ]);

        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($ch);
        $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr  = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            return [false, 'Network error: ' . $curlErr];
        }
        if ($status >= 200 && $status < 300) {
            return [true, ''];
        }

        $decoded = json_decode($response, true);
        $message = $decoded['message'] ?? ('Email service returned status ' . $status);
        return [false, $message];
    }
}
