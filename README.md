# Shaw Enterprise

## Project layout

```text
htdocs/              Upload the contents of this folder into the host's htdocs
  app/                PHP API controllers, router, support, and views
  assets/             Public CSS and JavaScript
  config/             PHP configuration and local environment file
  database/           SQL schema and initial data
  storage/uploads/    Product images and uploaded catalog files
  index.php           Front controller
  .htaccess           URL routing and private-folder access rules
```

## Requirements

- PHP 8.0+ with PDO MySQL and Fileinfo
- MySQL/MariaDB provided by InfinityFree

## Configuration

Copy `htdocs/config/.env.example` to `htdocs/config/.env`, then set the MySQL
hostname, database name, username, password, and admin credentials using the
values from InfinityFree's control panel. InfinityFree's MySQL host is not
`localhost`. Do not upload or commit a local `config/.env`.

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `htdocs/config/.env`. The password is
stored in plaintext in this file, so keep `.env` private and never upload or
commit it. Admin sessions are checked by PHP; write operations,
order/inquiry administration, and uploads require an authenticated admin.

## Admin CMS

Sign in at `/admin` to manage products, categories, clients, testimonials, blog
posts, and store settings. The dashboard includes inactive catalog items and
unpublished posts so they can be edited or republished. Admins can also review
legacy order records and inquiries and update their statuses. The storefront
is a product catalog and enquiry site: customers request quotations directly;
it has no cart, checkout, online payment, or public order-submission flow.
Each product has a **Show price & MRP on product cards and details** control.
It is off by default; when disabled, price fields are omitted from public
product API responses.

## Run locally

From the project root:

```bash
php -S localhost:8000 -t htdocs htdocs/router.php
```

Open `http://localhost:8000`. `htdocs/.htaccess` handles front-controller
routing on Apache.

## Run with Docker

Build and run the PHP app from the repository root:

```bash
docker build -t shaw-enterprise .
docker run --rm -p 8000:10000 \
  --env-file htdocs/config/.env \
  -e APP_URL=http://localhost:8000 \
  -v shaw-enterprise-uploads:/var/data \
  shaw-enterprise
```

The `.env` file supplies the MySQL and admin settings and is excluded from the
image. Docker uses a named volume for uploaded images and the catalog PDF.

## Deploy to Render

The root `render.yaml` defines a free Docker web service with a health check.
In Render, create a Blueprint from the GitHub repository and provide the
requested database and admin environment variables. Use a MySQL server that
permits connections from Render; Render does not provide a managed MySQL
service. The existing InfinityFree MySQL server may not allow connections from
outside InfinityFree, so verify remote access before using it. Do not copy
production credentials into Git or the Docker image.

For TiDB Cloud Starter or another MySQL provider requiring verified TLS, the
Blueprint sets `DB_SSL_CA` to the container's system CA bundle. The database
connection verifies the server certificate when this setting is present.

The free service has an ephemeral filesystem and may sleep when idle. Bundled
images are copied into its uploads directory at startup, but new admin uploads
may be lost after a restart or redeploy. Use a paid instance with a persistent
disk or external object storage before relying on durable uploads. The
deployment uses a separate Render URL by default; change DNS or the custom
domain only after verifying the Render deployment and database contents.

## Deploy to InfinityFree

1. In InfinityFree, create/activate the hosting account for
   `shawenterprise.site.je`, then open that site's FTP account or File Manager.
2. Open the **domain's** `htdocs` directory. Upload the **contents** of the
   local `htdocs/` folder there so `index.php`, `.htaccess`, and `assets/` are
   directly inside the remote `htdocs`; do not create an extra nested
   `htdocs/htdocs` folder. Include `app/`, `config/`, `database/`, and
   `storage/` alongside them. Do not upload `.git/` or your local
   `config/.env`.
   If using a ZIP, extract it on your computer first and confirm
   `index.php` is at the extracted folder's top level and `config/.env` is not
   included. Upload the extracted files through FTP, not the ZIP archive.
3. Use FTP (for example FileZilla) to upload the folders and files. Avoid
   uploading one large archive; InfinityFree has a 10 MB per-file upload
   limit.
4. In the InfinityFree control panel, create a MySQL database. Note its exact
   database hostname, database name, username, and password.
5. In remote `htdocs/config/`, copy `.env.example` to `.env`. Put the database
   details from the panel in it, set `APP_URL=https://shawenterprise.site.je`
   after HTTPS is enabled, and set your admin email and password hash. The
   host field must use InfinityFree's database hostname, not `localhost`.
6. Open the database in InfinityFree phpMyAdmin and import
   `database/shaw_enterprise_database.sql`.
   For an existing installation, run the applicable SQL files in
   `database/migrations/` once before deploying application changes.
7. Enable the available SSL certificate, then test the domain homepage,
   `/api/health`, `/admin/login`, and image loading.

All PHP application folders are inside the remote web root because InfinityFree
stores website files in `htdocs`. The root `.htaccess` denies direct requests
to `app/`, `config/`, `database/`, and `storage/`; requests for uploaded files
are served through the PHP router.
