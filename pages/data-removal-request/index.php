<?php
/**
 * Account & Data Deletion Request page for the
 * Divine Christian Assembly Global mobile app (Google Play data-deletion URL).
 *
 * Renders the request form (GET) and emails the request to the church
 * operations inbox via Resend (POST). The Resend API key is read from a
 * gitignored config.php (see config.example.php) so it never reaches the
 * browser or the repository.
 */

// ---- Configuration -------------------------------------------------------
$configPath = __DIR__ . '/config.php';
if (file_exists($configPath)) {
    require $configPath;
}

$RESEND_API_KEY = getenv('RESEND_API_KEY') ?: (defined('RESEND_API_KEY') ? RESEND_API_KEY : '');
$RECIPIENT      = 'operationsdac@gmail.com';
$FROM           = 'Divine Christian Assembly Global <noreply@divinechristianassembly.com>';
$APP_NAME       = 'Divine Christian Assembly Global';

// ---- Helpers -------------------------------------------------------------
function e($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

/**
 * Send the deletion request through Resend. Returns [bool success, string error].
 */
function send_via_resend($apiKey, $from, $to, $replyTo, $subject, $html) {
    $payload = json_encode([
        'from'     => $from,
        'to'       => [$to],
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

// ---- Request handling ----------------------------------------------------
$errors  = [];
$success = false;
$values  = [
    'name'         => '',
    'email'        => '',
    'phone'        => '',
    'account_id'   => '',
    'request_type' => '',
    'details'      => '',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Honeypot: real users never fill this hidden field.
    if (!empty($_POST['website'])) {
        $success = true; // silently swallow obvious bots
    } else {
        foreach ($values as $key => $_) {
            $values[$key] = trim($_POST[$key] ?? '');
        }
        $confirmed = isset($_POST['confirm']);

        if ($values['name'] === '') {
            $errors[] = 'Please enter your full name.';
        }
        if ($values['email'] === '' || !filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address.';
        }
        if ($values['request_type'] === '') {
            $errors[] = 'Please choose what you would like us to delete.';
        }
        if (!$confirmed) {
            $errors[] = 'Please confirm that you are the owner of this account.';
        }

        if (empty($errors)) {
            if ($RESEND_API_KEY === '') {
                $errors[] = 'Email sending is not configured on the server yet. '
                          . 'Please email ' . $RECIPIENT . ' directly to submit your request.';
            } else {
                $requestTypeLabels = [
                    'full'         => 'Delete my entire account and all associated data',
                    'data_all'     => 'Delete all of my data, but keep my account active',
                    'data_partial' => 'Delete only specific data, but keep my account (see details)',
                ];
                $typeLabel = $requestTypeLabels[$values['request_type']] ?? $values['request_type'];
                $submittedAt = gmdate('Y-m-d H:i:s') . ' UTC';
                $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

                $html = '<div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6">'
                      . '<h2 style="color:#2b215d">New Data Deletion Request</h2>'
                      . '<p>A user submitted a data/account deletion request via the '
                      . e($APP_NAME) . ' website.</p>'
                      . '<table cellpadding="6" style="border-collapse:collapse;font-size:14px">'
                      . '<tr><td style="font-weight:bold">Full name</td><td>' . e($values['name']) . '</td></tr>'
                      . '<tr><td style="font-weight:bold">Email</td><td>' . e($values['email']) . '</td></tr>'
                      . '<tr><td style="font-weight:bold">Phone</td><td>' . e($values['phone'] ?: '—') . '</td></tr>'
                      . '<tr><td style="font-weight:bold">Account / username</td><td>' . e($values['account_id'] ?: '—') . '</td></tr>'
                      . '<tr><td style="font-weight:bold">Request type</td><td>' . e($typeLabel) . '</td></tr>'
                      . '<tr><td style="font-weight:bold;vertical-align:top">Details</td><td>' . nl2br(e($values['details'] ?: '—')) . '</td></tr>'
                      . '<tr><td style="font-weight:bold">Submitted at</td><td>' . e($submittedAt) . '</td></tr>'
                      . '<tr><td style="font-weight:bold">IP address</td><td>' . e($ip) . '</td></tr>'
                      . '</table>'
                      . '<p style="font-size:13px;color:#777">Reply directly to this email to reach the requester.</p>'
                      . '</div>';

                $subject = 'Data Deletion Request — ' . $values['name'];

                [$sent, $sendError] = send_via_resend(
                    $RESEND_API_KEY, $FROM, $RECIPIENT, $values['email'], $subject, $html
                );

                if ($sent) {
                    $success = true;
                    $values = array_fill_keys(array_keys($values), '');
                } else {
                    $errors[] = 'We could not send your request right now. '
                              . 'Please try again, or email ' . $RECIPIENT . ' directly.';
                    error_log('Data deletion Resend error: ' . $sendError);
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="../../index.css?v=222">
    <link rel="stylesheet" href="./style.css?v=222">
    <link rel="shortcut icon" href="../../assets/icons/Logo.png?v=222" type="image/x-icon">
    <title>Divine Christian Assembly Global | Account &amp; Data Deletion Request</title>
</head>

<body class="drr-body">
    <main class="drr">
        <!-- Branding header (identifies the app / developer per Play Store policy) -->
        <header class="drr-header">
            <img class="drr-header__logo" src="../../assets/icons/Logo.png?v=222" alt="Divine Christian Assembly Global logo">
            <div>
                <h1 class="drr-header__title">Account &amp; Data Deletion Request</h1>
                <p class="drr-header__app">Divine Christian Assembly Global mobile app</p>
            </div>
        </header>

        <section class="drr-intro">
            <p>
                This page lets users of the <strong>Divine Christian Assembly Global</strong> mobile app
                (published by Divine Christian Assembly Global) request deletion of their account and the
                personal data we hold about them. Submit the form below and our team will process your request.
            </p>
        </section>

        <!-- Steps (prominent, per Play Store policy) -->
        <section class="drr-card drr-steps">
            <h2>How to request deletion</h2>
            <ol class="drr-steps__list">
                <li>Enter the <strong>email address linked to your account</strong> in the form below so we can locate your data.</li>
                <li>Choose what to delete: your <strong>entire account</strong>, or <strong>some or all of your data while keeping your account active</strong>.</li>
                <li>Confirm you are the account owner and press <strong>Submit request</strong>.</li>
                <li>We email your request to our operations team. We may contact you to verify your identity, then complete the deletion <strong>within 30 days</strong> and confirm by email.</li>
            </ol>
            <p class="drr-steps__alt">
                Prefer email? You can also send your request directly to
                <a href="mailto:operationsdac@gmail.com">operationsdac@gmail.com</a>.
            </p>
        </section>

        <!-- What is deleted vs kept, with retention (per Play Store policy) -->
        <section class="drr-card">
            <h2>What data is deleted, and what we keep</h2>

            <h3>Deleted when you request account deletion</h3>
            <ul class="drr-list">
                <li>Your account profile — full name, email address and phone number</li>
                <li>Your in-app preferences, saved items and account settings</li>
                <li>Usage and device data associated with your account</li>
            </ul>
            <p class="drr-note">
                You don't have to delete your account to remove your data — you can request that
                <strong>some or all of your data is deleted while keeping your account active</strong>
                using the options in the form below.
            </p>

            <h3>Data we may keep, and for how long</h3>
            <ul class="drr-list">
                <li>
                    <strong>Donation / payment records.</strong> We never store your card details (payments are
                    handled by Paystack). Records of donations are retained for accounting, tax and legal
                    compliance for the period required by applicable law (typically up to 6 years), after which
                    they are deleted or anonymised.
                </li>
                <li>
                    <strong>Information we are legally required to keep</strong>, or that we need to resolve
                    disputes, prevent fraud or enforce our agreements — retained only for as long as required,
                    then deleted.
                </li>
                <li>
                    <strong>Backups.</strong> Residual copies of your data may remain in our secure backups and
                    are purged within 90 days of your request.
                </li>
            </ul>
            <p class="drr-note">
                For full details on how we handle your information, see our
                <a href="../privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.
            </p>
        </section>

        <!-- The form -->
        <section class="drr-card">
            <h2>Submit your request</h2>

            <?php if ($success): ?>
                <div class="drr-alert drr-alert--success" role="status">
                    <strong>Thank you.</strong> Your deletion request has been received and sent to our team.
                    We will process it within 30 days and email you a confirmation.
                </div>
            <?php else: ?>
                <?php if (!empty($errors)): ?>
                    <div class="drr-alert drr-alert--error" role="alert">
                        <ul>
                            <?php foreach ($errors as $error): ?>
                                <li><?= e($error) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <form class="drr-form" method="post" action="" novalidate>
                    <!-- Honeypot: hidden from users, catches bots -->
                    <div class="drr-hp" aria-hidden="true">
                        <label>Leave this field empty
                            <input type="text" name="website" tabindex="-1" autocomplete="off">
                        </label>
                    </div>

                    <label class="drr-field">
                        <span class="drr-field__label">Full name <span class="drr-req">*</span></span>
                        <input type="text" name="name" value="<?= e($values['name']) ?>" required>
                    </label>

                    <label class="drr-field">
                        <span class="drr-field__label">Account email address <span class="drr-req">*</span></span>
                        <input type="email" name="email" value="<?= e($values['email']) ?>" required>
                    </label>

                    <label class="drr-field">
                        <span class="drr-field__label">Phone number on the account</span>
                        <input type="tel" name="phone" value="<?= e($values['phone']) ?>">
                    </label>

                    <label class="drr-field">
                        <span class="drr-field__label">Account name / username (if any)</span>
                        <input type="text" name="account_id" value="<?= e($values['account_id']) ?>">
                    </label>

                    <label class="drr-field">
                        <span class="drr-field__label">What would you like us to delete? <span class="drr-req">*</span></span>
                        <select name="request_type" required>
                            <option value="" disabled <?= $values['request_type'] === '' ? 'selected' : '' ?>>Select an option</option>
                            <option value="full" <?= $values['request_type'] === 'full' ? 'selected' : '' ?>>Delete my entire account and all associated data</option>
                            <option value="data_all" <?= $values['request_type'] === 'data_all' ? 'selected' : '' ?>>Delete all of my data, but keep my account active</option>
                            <option value="data_partial" <?= $values['request_type'] === 'data_partial' ? 'selected' : '' ?>>Delete only specific data, but keep my account (describe below)</option>
                        </select>
                    </label>

                    <label class="drr-field">
                        <span class="drr-field__label">Additional details</span>
                        <textarea name="details" rows="4" placeholder="If you chose 'specific data only', tell us what to delete."><?= e($values['details']) ?></textarea>
                    </label>

                    <label class="drr-check">
                        <input type="checkbox" name="confirm" value="1">
                        <span>I confirm that I am the owner of this account and that the information above is accurate. <span class="drr-req">*</span></span>
                    </label>

                    <button type="submit" class="drr-submit">Submit request</button>
                </form>
            <?php endif; ?>
        </section>

        <footer class="drr-footer">
            <p>Divine Christian Assembly Global &middot; 33, Community Road, Off LASU-Isheri Road, Obadore, Lagos State, Nigeria</p>
            <p>Questions? <a href="mailto:operationsdac@gmail.com">operationsdac@gmail.com</a></p>
        </footer>
    </main>
</body>

</html>
