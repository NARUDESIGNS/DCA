<?php
/**
 * Invitation request page — lets visitors extend an invitation to
 * Rev. Dr. Olubusayo Folarin. Renders the form (GET) and emails the
 * request to the church office via Resend (POST).
 */

require_once __DIR__ . '/../mailer.php'; // $RESEND_API_KEY, $RESEND_FROM, e(), send_via_resend()

$RECIPIENTS = ['operationsdca@gmail.com', 'busayo4larin@gmail.com'];

$errors  = [];
$success = false;
$values  = ['name' => '', 'email' => '', 'phone' => '', 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Honeypot: real users never fill this hidden field.
    if (!empty($_POST['website'])) {
        $success = true; // silently swallow obvious bots
    } else {
        foreach ($values as $key => $_) {
            $values[$key] = trim($_POST[$key] ?? '');
        }

        if ($values['name'] === '') {
            $errors[] = 'Please enter your name.';
        }
        if ($values['email'] === '' || !filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address.';
        }
        if ($values['message'] === '') {
            $errors[] = 'Please enter a message with the details of your invitation.';
        }

        if (empty($errors)) {
            if ($RESEND_API_KEY === '') {
                $errors[] = 'Email sending is not configured on the server yet. '
                          . 'Please email operationsdca@gmail.com directly to send your invitation.';
            } else {
                $submittedAt = gmdate('Y-m-d H:i:s') . ' UTC';
                $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

                $html = '<div style="font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6">'
                      . '<h2 style="color:#2b215d">New Invitation Request</h2>'
                      . '<p>Someone submitted an invitation request for Rev. Dr. Olubusayo Folarin '
                      . 'via the Divine Christian Assembly Global website.</p>'
                      . '<table cellpadding="6" style="border-collapse:collapse;font-size:14px">'
                      . '<tr><td style="font-weight:bold">Name</td><td>' . e($values['name']) . '</td></tr>'
                      . '<tr><td style="font-weight:bold">Email</td><td>' . e($values['email']) . '</td></tr>'
                      . '<tr><td style="font-weight:bold">Phone</td><td>' . e($values['phone'] ?: '—') . '</td></tr>'
                      . '<tr><td style="font-weight:bold;vertical-align:top">Message</td><td>' . nl2br(e($values['message'])) . '</td></tr>'
                      . '<tr><td style="font-weight:bold">Submitted at</td><td>' . e($submittedAt) . '</td></tr>'
                      . '<tr><td style="font-weight:bold">IP address</td><td>' . e($ip) . '</td></tr>'
                      . '</table>'
                      . '<p style="font-size:13px;color:#777">Reply directly to this email to reach the sender.</p>'
                      . '</div>';

                $subject = 'Invitation Request — ' . $values['name'];

                [$sent, $sendError] = send_via_resend(
                    $RESEND_API_KEY, $RESEND_FROM, $RECIPIENTS, $values['email'], $subject, $html
                );

                if ($sent) {
                    $success = true;
                    $values = array_fill_keys(array_keys($values), '');
                } else {
                    $errors[] = 'We could not send your invitation right now. '
                              . 'Please try again, or email operationsdca@gmail.com directly.';
                    error_log('Invitation Resend error: ' . $sendError);
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
    <link rel="stylesheet" href="../../index.css?v=222">
    <link rel="stylesheet" href="./style.css?v=222">
    <link rel="shortcut icon" href="../../assets/icons/Logo.png?v=222" type="image/x-icon">
    <title>DCA | Extend an Invitation</title>
</head>

<body>
    <div class="dim-background" id="dim-background"></div>
    <div class="nav-container">
        <!-- navigation -->
        <nav class="nav">
            <a href="../../index.html">
                <section class="nav__logo">
                    <img class="nav__logo-img" src="../../assets/icons/Logo.png?v=222" alt="logo" />
                    <p class="nav__logo-text">Divine Christian Assembly Global</p>
                </section>
            </a>

            <ul class="nav-items slide-out" id="side-menu">
                <li class="nav-items__item"><a href="../../index.html">Home</a></li>
                <li class="nav-items__item about">
                    Resources
                    <ul class="dropdown">
                        <a href="https://blog.divinechristianassembly.com/" target="_blank">
                            <li class="dropdown__items">Church Blog</li>
                        </a>
                        <a href="../sermons.html">
                            <li class="dropdown__items">Sermons</li>
                        </a>
                    </ul>
                </li>
                <li class="nav-items__item"><a href="../events.html">Events</a></li>
                <li class="nav-items__item"><a href="../give.html">Give</a></li>
                <li class="nav-items__item"><a href="../camp-service.html">Camp Service</a></li>
                <li class="nav-items__item"><a href="#footer">Contact</a></li>
                <li class="nav-items__item about">
                    About
                    <ul class="dropdown">
                        <a href="../about/church.html">
                            <li class="dropdown__items">The Church</li>
                        </a>
                        <a href="../about/pastorate.html">
                            <li class="dropdown__items">Our Pastorate</li>
                        </a>
                        <a href="../about/departments.html">
                            <li class="dropdown__items">Departments</li>
                        </a>
                    </ul>
                </li>
            </ul>

            <span class="nav__menu" id="menu-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#565656" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-menu">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </span>
        </nav>
    </div>


    <!-- main content -->
    <div class="main-container">
        <!-- Banner -->
        <div class="banner">
            <h1 class="banner__text">EXTEND AN INVITATION</h1>
        </div>

        <div class="invite-container">
            <section class="invite-intro">
                <h1 class="invite-intro__title header-title">Invite Rev. Dr. Olubusayo Folarin</h1>
                <p>
                    Would you like to extend an invitation to <strong>Rev. Dr. Olubusayo Folarin</strong> to
                    minister at your church, conference, convention, or special programme? We would be glad to
                    hear from you.
                </p>
                <p>
                    Please complete the form below with your contact details, and in your message kindly include:
                </p>
                <ul class="invite-list">
                    <li>The name of your church or organisation</li>
                    <li>The nature of the event and what you are inviting him for</li>
                    <li>The proposed date(s) and venue</li>
                    <li>Any other details that would help us consider your request</li>
                </ul>
                <p>
                    Our office will review your invitation and respond as soon as possible. You can also reach us
                    directly at <a href="mailto:operationsdca@gmail.com">operationsdca@gmail.com</a>.
                </p>
            </section>

            <section class="invite-form-wrap">
                <?php if ($success): ?>
                    <div class="invite-alert invite-alert--success" role="status">
                        <strong>Thank you.</strong> Your invitation has been sent to our office.
                        We will get back to you as soon as possible.
                    </div>
                <?php else: ?>
                    <?php if (!empty($errors)): ?>
                        <div class="invite-alert invite-alert--error" role="alert">
                            <ul>
                                <?php foreach ($errors as $error): ?>
                                    <li><?= e($error) ?></li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    <?php endif; ?>

                    <form class="invite-form" method="post" action="" novalidate>
                        <!-- Honeypot: hidden from users, catches bots -->
                        <div class="invite-hp" aria-hidden="true">
                            <label>Leave this field empty
                                <input type="text" name="website" tabindex="-1" autocomplete="off">
                            </label>
                        </div>

                        <label class="invite-field">
                            <span class="invite-field__label">Name <span class="invite-req">*</span></span>
                            <input type="text" name="name" value="<?= e($values['name']) ?>" required>
                        </label>

                        <label class="invite-field">
                            <span class="invite-field__label">Email address <span class="invite-req">*</span></span>
                            <input type="email" name="email" value="<?= e($values['email']) ?>" required>
                        </label>

                        <label class="invite-field">
                            <span class="invite-field__label">Phone number</span>
                            <input type="tel" name="phone" value="<?= e($values['phone']) ?>">
                        </label>

                        <label class="invite-field invite-field--full">
                            <span class="invite-field__label">Message <span class="invite-req">*</span></span>
                            <textarea name="message" rows="6" placeholder="Tell us about your invitation — the event, date, venue and any details." required><?= e($values['message']) ?></textarea>
                        </label>

                        <button type="submit" class="btn invite-submit">Send invitation</button>
                    </form>
                <?php endif; ?>
            </section>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer" id="footer">
        <div class="footer-items">
            <div class="church-details">
                <section class="church-logo">
                    <img src="../../assets/icons/Logo.png?v=222" alt="church logo" class="church-logo__logo">
                    <h1 class="church-logo__name">DIVINE CHRISTIAN ASSEMBLY GLOBAL</h1>
                </section>
                <h4 class="church-details__title">CONTACT</h4>
                <section class="contact-details-container">
                    <ul class="contact-details">
                        <li class="contact-details__desc">
                            <a href="mailto:dcahqt@yahoo.com">dcahqt@yahoo.com</a>
                        </li>
                        <li class="contact-details__desc">
                            <a href="tel:+2349042942504">+234-904-294-2504</a>
                        </li>
                        <li class="contact-details__desc">
                            <a href="tel:+2349079998247">+234-907-999-8247</a>
                        </li>
                    </ul>
                    <p class="contact-details__desc contact-details__desc-address">
                        <a href="https://goo.gl/maps/z548ho43SVrEsVgC7" target="_blank">
                            33, Community Road, Off LASU-Isheri Road, Obadore, Lagos State
                        </a>
                    </p>
                </section>
            </div>

            <div class="church-main-details">
                <ul class="about">
                    <h4 class="church-main-details__title">ABOUT</h4>
                    <li class="about__title"><a href="../about/departments.html">Departments</a></li>
                    <li class="about__title"><a href="../about/church.html">The Church</a></li>
                    <li class="about__title"><a href="../about/pastorate.html">Our Pastorate</a></li>
                    <li class="about__title"><a href="../about/church.html#our-locations">Our Locations</a></li>
                    <li class="about__title"><a href="/pages/privacy.html">Privacy Policy</a></li>
                    <li class="about__title"><a href="/pages/invitation/">Invite Our Pastor</a></li>
                </ul>
                <ul class="follow-us">
                    <h4 class="church-main-details__title">FOLLOW US</h4>
                    <li class="follow-us__title"><a target='_blank'
                            href="https://twitter.com/divinechristia9">Twitter</a></li>
                    <li class="follow-us__title"><a target='_blank'
                            href="https://www.youtube.com/@divinechristianassembly/featured">YouTube</a></li>
                    <li class="follow-us__title"><a target='_blank'
                            href="https://web.facebook.com/divinechristianassemblyinc/?_rdc=1&_rdr">Facebook</a></li>
                    <li class="follow-us__title"><a target='_blank'
                            href="https://www.instagram.com/divinechristianassembly/?hl=en">Instagram</a></li>
                    <li class="follow-us__title"><a target='_blank'
                            href="https://www.tiktok.com/@divinechristianassembly/?hl=en">TikTok</a></li>
                </ul>
                <ul class="events">
                    <h4 class="church-main-details__title">EVENTS</h4>
                    <li class="events__title"><a href="/pages/events.html#business-hub">Business Hub</a></li>
                    <li class="events__title"><a href="../events.html#childrens-day">Children's Day</a></li>
                    <li class="events__title"><a href="../events.html#youth-weekend">Youth Weekend</a></li>
                    <li class="events__title"><a href="../events.html#Tehillah">Tehillah</a></li>
                    <li class="events__title"><a href="../events.html#12lessons">12 Lessons (Carol)</a></li>
                    <li class="events__title"><a href="../events.html#klc">Kingdom Life Convention</a></li>
                    <li class="events__title"><a href="../events.html#living-in-love">Living in Love and Harmony</a></li>
                    <li class="events__title"><a href="../events.html#prayer-bank">Prayer Bank</a></li>
                </ul>
            </div>

        </div>
        <p class="footer-date">Divine Christian Assembly Global &copy <span id="footer-date">2023</span></p>
    </div>

    <div class="notices-modal">
        <button class="close-notices">
            <img src="/assets/icons/close.svg" alt="">
        </button>
        <a class="notice-group" href='/pages/invitation/'>
            <img src="/assets/icons/Logo.png" alt="invite" class="notice-icon">
            <p>Invite Our Pastor</p>
            <img src="/assets/images/next.png" class='proceed' alt="proceed">
        </a>
        <a class="notice-group" href='https://www.youtube.com/watch?v=IIlXA-7CmrM' target="_blank">
            <img src="/assets/images/music.jpeg" alt="music" class="notice-icon">
            <p>Listen to Fire Prayer</p>
            <img src="/assets/images/next.png" class='proceed' alt="proceed">
        </a>
        <a class="notice-group" href='/pages/bus-service.html'>
            <img src="/assets/images/bus.png" alt="bus" class="notice-icon">
            <p>Join our Bus Service</p>
            <img src="/assets/images/next.png" class='proceed' alt="proceed">
        </a>
    </div>

    <script src="../../utils/interaction.js?v=222"></script>
</body>

</html>
