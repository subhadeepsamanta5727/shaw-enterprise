#!/bin/sh
set -eu

PORT="${PORT:-10000}"
case "$PORT" in
    ''|*[!0-9]*)
        echo "PORT must be a numeric TCP port." >&2
        exit 1
        ;;
esac

UPLOADS_DIR="${UPLOADS_DIR:-/var/www/html/storage/uploads}"
SEED_UPLOADS_DIR=/var/www/html/storage/uploads
mkdir -p "$UPLOADS_DIR"

if [ "$UPLOADS_DIR" != "$SEED_UPLOADS_DIR" ]; then
    # Synchronize seed uploads (including converted .webp files) into target UPLOADS_DIR
    cp -rn "$SEED_UPLOADS_DIR/." "$UPLOADS_DIR/" 2>/dev/null || cp -r "$SEED_UPLOADS_DIR/." "$UPLOADS_DIR/" || true
fi

chown -R www-data:www-data "$UPLOADS_DIR"
sed -i -E "s/^Listen [0-9]+$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i -E "s/<VirtualHost \\*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Synchronize database references to WebP idempotently
if [ -f /var/www/html/scripts/migrate_webp.php ]; then
    php /var/www/html/scripts/migrate_webp.php || true
fi

exec apache2-foreground
