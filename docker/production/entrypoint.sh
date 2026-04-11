#!/bin/bash
# =====================================================
# 🚀 Entrypoint Script — CPE Repair System (Docker)
# =====================================================
# รันอัตโนมัติตอน container start
# =====================================================

set -e

echo "================================================"
echo "🚀 CPE Repair System — Starting Up..."
echo "================================================"

# ─── 1. ตรวจสอบและสร้าง Storage Directories ───
echo "📁 [1/7] สร้าง Storage directories..."
mkdir -p storage/logs \
         storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/app/public \
         bootstrap/cache

# ─── 2. ตั้งค่า Permissions ───
echo "🔑 [2/7] ตั้งค่า permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# ─── 3. Generate APP_KEY (ถ้ายังไม่มี) ───
echo "🔐 [3/7] ตรวจสอบ APP_KEY..."
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "   → APP_KEY ไม่มี กำลัง generate ใหม่..."
    php artisan key:generate --force --no-interaction
    echo "   ✅ APP_KEY generated!"
else
    echo "   ✅ APP_KEY มีอยู่แล้ว"
fi

# ─── 4. สร้าง Storage Link ───
echo "🔗 [4/7] สร้าง Storage Link..."
php artisan storage:link --force 2>/dev/null || true
echo "   ✅ Storage link created"

# ─── 5. Wait for MySQL to be ready ───
echo "⏳ [5/7] รอ MySQL พร้อม..."
MAX_RETRIES=30
RETRY_COUNT=0
while ! mysqladmin ping -h"${DB_HOST:-mysql}" -u"${DB_USERNAME:-root}" -p"${DB_PASSWORD}" --silent 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "   ❌ MySQL ไม่ตอบสนองหลังจากลอง ${MAX_RETRIES} ครั้ง"
        echo "   → ดำเนินการต่อไป (migration อาจจะ fail)"
        break
    fi
    echo "   → รอ MySQL... (${RETRY_COUNT}/${MAX_RETRIES})"
    sleep 2
done
echo "   ✅ MySQL พร้อม!"

# ─── 6. Run Migrations ───
echo "📦 [6/7] รัน Database Migrations..."
php artisan migrate --force --no-interaction
echo "   ✅ Migrations เสร็จ!"

# ─── 7. Cache Config, Routes, Views ───
echo "⚡ [7/7] Cache config, routes, views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "   ✅ Cache เสร็จ!"

echo ""
echo "================================================"
echo "✅ CPE Repair System พร้อมใช้งาน!"
echo "================================================"
echo "🌐 เปิดเว็บที่: http://localhost"
echo "👤 Admin: admin@rmutt.ac.th / password"
echo "   (ถ้ารัน db:seed แล้ว)"
echo "================================================"
echo ""

# ─── Start Supervisor (PHP-FPM + Nginx + Queue) ───
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
