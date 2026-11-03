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

if [ "$UPLOADS_DIR" != "$SEED_UPLOADS_DIR" ] \
    && [ -z "$(find "$UPLOADS_DIR" -mindepth 1 -maxdepth 1 -print -quit)" ]; then
    cp -a "$SEED_UPLOADS_DIR/." "$UPLOADS_DIR/"
fi

chown -R www-data:www-data "$UPLOADS_DIR"
sed -i -E "s/^Listen [0-9]+$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i -E "s/<VirtualHost \\*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

exec apache2-foreground
