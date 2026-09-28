FROM php:8.3-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --chown=www-data:www-data . .

RUN mkdir -p /var/lib/smart-study \
    && chown -R www-data:www-data /var/www/html/database /var/lib/smart-study \
    && chmod 775 /var/www/html/database /var/lib/smart-study

EXPOSE 80

CMD ["sh", "-c", "mkdir -p /var/lib/smart-study && chown -R www-data:www-data /var/lib/smart-study && chmod 775 /var/lib/smart-study && exec apache2-foreground"]