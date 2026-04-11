# =====================================================
# 🐳 CPE Repair System — Production Dockerfile
# =====================================================
# Standalone (ไม่พึ่ง Laravel Sail)
# PHP 8.2-FPM + Nginx + Supervisor ใน container เดียว
# =====================================================

# ─── Stage 1: Build Frontend ───
FROM node:20-alpine AS frontend-builder

WORKDIR /build

# Copy package files first (cache layer)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source files needed for build
COPY resources/ resources/
COPY vite.config.js postcss.config.js tailwind.config.js jsconfig.json ./
COPY public/ public/

# Build frontend (Vite + React + Tailwind + PWA)
RUN npm run build


# ─── Stage 2: Production Image ───
FROM php:8.2-fpm-bookworm AS production

LABEL maintainer="CPE Repair System"
LABEL description="Production image for CPE Repair System"

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# ─── Install System Dependencies ───
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    zip \
    unzip \
    git \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        xml \
        intl \
        zip \
        gd \
        bcmath \
        opcache \
        pcntl \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# ─── Install Composer ───
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ─── Set Working Directory ───
WORKDIR /var/www/html

# ─── Copy Composer Files First (cache layer) ───
COPY composer.json composer.lock ./

# ─── Install PHP Dependencies (no dev) ───
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --optimize-autoloader \
    --prefer-dist \
    && composer clear-cache

# ─── Copy Application Source ───
COPY . .

# ─── Run Post-Install Scripts ───
RUN composer dump-autoload --optimize --no-dev

# ─── Copy Built Frontend from Stage 1 ───
COPY --from=frontend-builder /build/public/build/ public/build/

# ─── Copy Production Configs ───
COPY docker/production/nginx.conf /etc/nginx/sites-available/default
COPY docker/production/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/production/php.ini /usr/local/etc/php/conf.d/99-production.ini
COPY docker/production/entrypoint.sh /entrypoint.sh

# ─── Set Permissions ───
RUN chmod +x /entrypoint.sh \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache \
    && mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data storage bootstrap/cache

# ─── Remove default nginx config & link ours ───
RUN rm -f /etc/nginx/sites-enabled/default \
    && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# ─── Expose Port ───
EXPOSE 80

# ─── Entrypoint ───
ENTRYPOINT ["/entrypoint.sh"]
