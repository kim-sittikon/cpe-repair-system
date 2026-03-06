#!/bin/bash
# ==============================================
# Script แก้ไข PHP Configuration
# สร้างเมื่อ: 2 ก.พ. 2569
# ==============================================

set -e  # หยุดทันทีถ้ามี error

echo "🔧 เริ่มแก้ไข PHP Configuration..."
echo ""

# Backup ไฟล์ก่อนแก้
echo "📦 สำรองไฟล์ config เดิม..."
sudo cp /etc/php/8.2/fpm/php.ini /etc/php/8.2/fpm/php.ini.backup.$(date +%Y%m%d_%H%M%S)
sudo cp /etc/php/8.2/fpm/conf.d/10-opcache.ini /etc/php/8.2/fpm/conf.d/10-opcache.ini.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup เรียบร้อย"
echo ""

# แก้ไข php.ini
echo "📝 แก้ไข php.ini..."

# 1. upload_max_filesize: 2M -> 64M
sudo sed -i 's/^upload_max_filesize = 2M/upload_max_filesize = 64M/' /etc/php/8.2/fpm/php.ini
echo "   ✅ upload_max_filesize = 64M"

# 2. post_max_size: 8M -> 64M
sudo sed -i 's/^post_max_size = 8M/post_max_size = 64M/' /etc/php/8.2/fpm/php.ini
echo "   ✅ post_max_size = 64M"

# 3. memory_limit: 128M -> 256M
sudo sed -i 's/^memory_limit = 128M/memory_limit = 256M/' /etc/php/8.2/fpm/php.ini
echo "   ✅ memory_limit = 256M"

# 4. max_execution_time: 30 -> 60
sudo sed -i 's/^max_execution_time = 30/max_execution_time = 60/' /etc/php/8.2/fpm/php.ini
echo "   ✅ max_execution_time = 60"

echo ""

# แก้ไข OPcache JIT
echo "📝 แก้ไข OPcache JIT..."
sudo tee /etc/php/8.2/fpm/conf.d/10-opcache.ini > /dev/null << 'EOF'
; configuration for php opcache module
; priority=10
zend_extension=opcache.so

; OPcache settings
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0
opcache.save_comments=1

; JIT settings (PHP 8.0+)
opcache.jit=tracing
opcache.jit_buffer_size=100M
EOF
echo "   ✅ OPcache JIT = tracing"
echo "   ✅ JIT buffer = 100M"
echo ""

# ตรวจสอบ config ก่อน restart
echo "🔍 ตรวจสอบ PHP-FPM config..."
sudo php-fpm8.2 -t
echo ""

# Restart PHP-FPM
echo "🔄 Restart PHP-FPM..."
sudo systemctl restart php8.2-fpm
echo "✅ PHP-FPM restarted"
echo ""

# แสดงค่าใหม่
echo "📊 ค่าที่แก้ไขแล้ว:"
echo "-----------------------------------"
php -i | grep -E "^(upload_max_filesize|post_max_size|memory_limit|max_execution_time)" 2>/dev/null || \
grep -E "^(upload_max_filesize|post_max_size|memory_limit|max_execution_time)" /etc/php/8.2/fpm/php.ini
echo ""
echo "OPcache JIT:"
php -i | grep "opcache.jit " 2>/dev/null || grep "opcache.jit" /etc/php/8.2/fpm/conf.d/10-opcache.ini
echo "-----------------------------------"
echo ""
echo "✅ เสร็จสิ้น! PHP Configuration ได้รับการอัปเดตแล้ว"
echo ""
echo "⚠️  หมายเหตุ: ถ้าต้องการ rollback กลับ ใช้คำสั่ง:"
echo "   sudo cp /etc/php/8.2/fpm/php.ini.backup.* /etc/php/8.2/fpm/php.ini"
echo "   sudo systemctl restart php8.2-fpm"
