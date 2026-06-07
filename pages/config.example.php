<?php
/**
 * Copy this file to config.php (same folder) on the server and paste your
 * Resend API key below. config.php is gitignored, so the key is never
 * committed or served to the browser. This single key powers every PHP
 * form on the site (data deletion request + invitation request).
 *
 *   cp config.example.php config.php
 *
 * Get a key at https://resend.com (API Keys), and make sure the sending
 * domain (divinechristianassembly.com) is verified in your Resend account
 * so mail from noreply@divinechristianassembly.com is accepted.
 */

define('RESEND_API_KEY', 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
