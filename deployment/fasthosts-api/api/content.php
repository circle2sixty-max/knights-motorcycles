<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $path = cms_content_path();
  if (!file_exists($path)) {
    json_response(['configured' => false, 'message' => 'No CMS content has been published yet.']);
  }

  $raw = file_get_contents($path);
  $decoded = json_decode($raw ?: '', true);
  if (!is_array($decoded)) {
    json_response(['error' => 'CMS content file is invalid'], 500);
  }

  json_response($decoded);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_admin();
  $payload = read_json_body();
  $payload['version'] = $payload['version'] ?? 1;
  $payload['updatedAt'] = gmdate('c');

  if (empty($payload['bikes']) || !is_array($payload['bikes'])) {
    json_response(['error' => 'Content must include a bikes array'], 400);
  }

  write_json_file(cms_content_path(), $payload);
  json_response(['ok' => true, 'updatedAt' => $payload['updatedAt']]);
}

json_response(['error' => 'Method not allowed'], 405);
