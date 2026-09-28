FROM php:8.3-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --chown=www-data:www-data . .

RUN chown -R www-data:www-data /var/www/html/database \
    && chmod 775 /var/www/html/database

EXPOSE 80

CMD ["apache2-foreground"]