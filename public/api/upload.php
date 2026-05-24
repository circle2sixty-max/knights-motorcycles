<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(['error' => 'Method not allowed'], 405);
}

if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
  json_response(['error' => 'No file uploaded'], 400);
}

$file = $_FILES['file'];
if (($file['size'] ?? 0) > 8 * 1024 * 1024) {
  json_response(['error' => 'Image is too large. Maximum size is 8 MB.'], 400);
}

$imageInfo = getimagesize($file['tmp_name']);
if ($imageInfo === false) {
  json_response(['error' => 'Uploaded file is not a valid image'], 400);
}

$mimeToExt = [
  'image/jpeg' => 'jpg',
  'image/png' => 'png',
  'image/webp' => 'webp',
  'image/gif' => 'gif',
];

$mime = $imageInfo['mime'] ?? '';
if (!isset($mimeToExt[$mime])) {
  json_response(['error' => 'Only JPG, PNG, WebP and GIF images are supported'], 400);
}

$monthDir = gmdate('Y/m');
$targetDir = cms_upload_dir() . '/' . $monthDir;
ensure_directory($targetDir);

$baseName = pathinfo($file['name'] ?? 'image', PATHINFO_FILENAME);
$baseName = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $baseName));
$baseName = trim($baseName ?: 'image', '-');
$filename = $monthDir . '/' . $baseName . '-' . bin2hex(random_bytes(4)) . '.' . $mimeToExt[$mime];
$targetPath = cms_upload_dir() . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
  json_response(['error' => 'Unable to store uploaded image'], 500);
}

json_response([
  'ok' => true,
  'url' => public_upload_url($filename),
]);
