<?php
declare(strict_types=1);

return [
  // Generate with:
  // php -r 'echo password_hash("your-strong-password", PASSWORD_DEFAULT), PHP_EOL;'
  'admin_password_hash' => 'replace_with_password_hash',

  // These defaults work when the API folder is uploaded beside the Vite build files.
  // Change them only if Fasthosts requires writable folders outside the web root.
  'data_dir' => __DIR__ . '/../cms-data',
  'upload_dir' => __DIR__ . '/../uploads',
];
