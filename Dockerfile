FROM php:8.3-apache

WORKDIR /var/www/html

RUN a2enmod rewrite headers \
    && docker-php-ext-install pdo_mysql \
    && printf 'file_uploads=On\nupload_max_filesize=26M\npost_max_size=27M\nmax_execution_time=120\n' \
        > /usr/local/etc/php/conf.d/uploads.ini

COPY htdocs/ ./
COPY docker/render-entrypoint.sh /usr/local/bin/render-entrypoint

RUN chmod +x /usr/local/bin/render-entrypoint \
    && mkdir -p /var/data/uploads \
    && chown -R www-data:www-data /var/www/html/storage /var/data

ENV UPLOADS_DIR=/var/data/uploads

EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/render-entrypoint"]
