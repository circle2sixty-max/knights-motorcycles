<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

session_set_cookie_params([
  'httponly' => true,
  'secure' => $isHttps,
  'samesite' => 'Lax',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$configPath = __DIR__ . '/config.php';
$config = file_exists($configPath) ? require $configPath : [];

function json_response(array $payload, int $status = 200): void
{
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function require_admin(): void
{
  if (empty($_SESSION['knights_admin'])) {
    json_response(['error' => 'Not authenticated'], 401);
  }
}

function cms_data_dir(): string
{
  global $config;
  return $config['data_dir'] ?? (__DIR__ . '/../cms-data');
}

function cms_content_path(): string
{
  return cms_data_dir() . '/content.json';
}

function cms_upload_dir(): string
{
  global $config;
  return $config['upload_dir'] ?? (__DIR__ . '/../uploads');
}

function ensure_directory(string $path): void
{
  if (!is_dir($path) && !mkdir($path, 0755, true) && !is_dir($path)) {
    json_response(['error' => 'Unable to create storage directory'], 500);
  }
}

function read_json_body(): array
{
  $raw = file_get_contents('php://input');
  $decoded = json_decode($raw ?: '', true);
  if (!is_array($decoded)) {
    json_response(['error' => 'Invalid JSON body'], 400);
  }
  return $decoded;
}

function write_json_file(string $path, array $payload): void
{
  ensure_directory(dirname($path));
  $tmpPath = $path . '.tmp';
  $json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  if ($json === false || file_put_contents($tmpPath, $json, LOCK_EX) === false || !rename($tmpPath, $path)) {
    json_response(['error' => 'Unable to write CMS content file'], 500);
  }
}

function public_upload_url(string $filename): string
{
  return '/uploads/' . ltrim($filename, '/');
}
