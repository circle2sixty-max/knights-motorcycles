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
if (($file['size'] ?? 0) > 100 * 1024 * 1024) {
  json_response(['error' => 'File is too large. Maximum size is 100 MB.'], 400);
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = $finfo ? finfo_file($finfo, $file['tmp_name']) : '';
if ($finfo) {
  finfo_close($finfo);
}

$mimeToExt = [
  'image/jpeg' => 'jpg',
  'image/png' => 'png',
  'image/webp' => 'webp',
  'image/gif' => 'gif',
  'video/mp4' => 'mp4',
  'video/webm' => 'webm',
  'video/quicktime' => 'mov',
  'video/x-m4v' => 'm4v',
];

if (!isset($mimeToExt[$mime])) {
  json_response(['error' => 'Only JPG, PNG, WebP, GIF, MP4, WebM, MOV and M4V files are supported'], 400);
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
  'type' => str_starts_with($mime, 'video/') ? 'video' : 'image',
  'url' => public_upload_url($filename),
]);
