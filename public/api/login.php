<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(['error' => 'Method not allowed'], 405);
}

global $config;
$hash = $config['admin_password_hash'] ?? '';
if (!$hash || str_contains($hash, 'replace_with_password_hash')) {
  json_response(['error' => 'CMS password is not configured on the server.'], 500);
}

$payload = read_json_body();
$password = (string)($payload['password'] ?? '');

if (!password_verify($password, $hash)) {
  json_response(['error' => 'Invalid password'], 401);
}

session_regenerate_id(true);
$_SESSION['knights_admin'] = true;

json_response(['ok' => true]);
