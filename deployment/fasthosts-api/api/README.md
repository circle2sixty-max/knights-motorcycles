# Knights CMS API

This PHP API is designed for shared hosting such as Fasthosts PHP hosting.

Deployment setup:

1. Copy `config.example.php` to `config.php`.
2. Generate a password hash:

   ```bash
   php -r 'echo password_hash("your-strong-password", PASSWORD_DEFAULT), PHP_EOL;'
   ```

3. Paste the hash into `config.php`.
4. Ensure these folders are writable by PHP:

   ```text
   /cms-data
   /uploads
   ```

5. Open:

   ```text
   https://knights-motorcycles.co.uk/#/admin
   ```

The public website reads `/api/content.php` when CMS content exists. Before the first publish, it falls back to the bundled React content.

`upload.php` accepts product photos and product videos:

```text
JPG, PNG, WebP, GIF, MP4, WebM, MOV, M4V
```
