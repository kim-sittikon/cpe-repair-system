#!/bin/bash
# =====================================================
# 🐳 CPE Repair System - Local Development Startup
# =====================================================
# ใช้สำหรับรัน local ผ่าน Docker เท่านั้น!
# ⚠️  อย่ารันบน Cloud Server!
#
# วิธีใช้:
#   ./start-local.sh          เปิด Docker + ติดตั้ง + Build
#   ./start-local.sh --stop   ปิด Docker
#   ./start-local.sh --fresh  รีเซ็ตทุกอย่าง (ลบ DB แล้วสร้างใหม่)
#   ./start-local.sh --status ดูสถานะ services
# =====================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# =====================================================
# Safety Check: ห้ามรันบน production server!
# =====================================================
if [ -f /etc/supervisor/conf.d/cpe-worker.conf ]; then
    echo -e "${RED}❌ ตรวจพบว่าเป็น Production Server!${NC}"
    echo -e "${RED}   ไฟล์นี้ใช้สำหรับ local development เท่านั้น${NC}"
    echo -e "${RED}   หยุดดำเนินการ...${NC}"
    exit 1
fi

if systemctl is-active --quiet nginx 2>/dev/null && systemctl is-active --quiet php8.2-fpm 2>/dev/null; then
    echo -e "${RED}❌ ตรวจพบ Nginx + PHP-FPM รันอยู่ (Production Server?)${NC}"
    echo -e "${RED}   ไฟล์นี้ใช้สำหรับ local development เท่านั้น${NC}"
    echo -e "${YELLOW}   ถ้าแน่ใจว่าเป็น local ให้รัน: FORCE_LOCAL=1 ./start-local.sh${NC}"
    if [ "$FORCE_LOCAL" != "1" ]; then
        exit 1
    fi
fi

# =====================================================
# Handle arguments
# =====================================================
case "${1:-start}" in
    --stop|stop)
        echo -e "${BLUE}🛑 หยุด Docker containers...${NC}"
        docker compose down
        echo -e "${GREEN}✅ หยุดเรียบร้อย${NC}"
        exit 0
        ;;
    --fresh|fresh)
        echo -e "${YELLOW}⚠️  จะลบ DB และ volumes ทั้งหมดแล้วสร้างใหม่${NC}"
        read -p "ยืนยัน? (y/N): " confirm
        if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
            echo "ยกเลิก"
            exit 0
        fi
        echo -e "${BLUE}🗑️  ลบ volumes...${NC}"
        docker compose down -v
        echo -e "${GREEN}✅ ลบเรียบร้อย จะเริ่มสร้างใหม่...${NC}"
        ;;
    --status|status)
        echo -e "${BLUE}📊 สถานะ Docker containers:${NC}"
        docker compose ps
        echo ""
        echo -e "${BLUE}📊 Queue status:${NC}"
        docker compose exec laravel.test php artisan queue:failed 2>/dev/null || echo "N/A"
        exit 0
        ;;
    start|"")
        # ดำเนินการต่อด้านล่าง
        ;;
    *)
        echo "Usage: ./start-local.sh [--stop|--fresh|--status]"
        exit 1
        ;;
esac

# =====================================================
# Step 1: ตั้งค่า .env
# =====================================================
echo -e "${BLUE}📋 Step 1: ตั้งค่า .env...${NC}"
if [ ! -f .env.docker ]; then
    echo -e "${RED}❌ ไม่พบ .env.docker${NC}"
    exit 1
fi

# สำรอง .env เดิม (ถ้ามี)
if [ -f .env ] && ! grep -q "LARAVEL_SAIL" .env 2>/dev/null; then
    if ! grep -q "DB_HOST=mysql" .env 2>/dev/null; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        echo -e "${YELLOW}   สำรอง .env เดิมไว้แล้ว${NC}"
    fi
fi

cp .env.docker .env
echo -e "${GREEN}   ✅ ใช้ .env.docker แล้ว${NC}"

# =====================================================
# Step 2: เปิด Docker
# =====================================================
echo -e "${BLUE}🐳 Step 2: เปิด Docker containers...${NC}"
docker compose up -d --build
echo -e "${GREEN}   ✅ Docker containers เปิดแล้ว${NC}"

# รอ MySQL พร้อม
echo -e "${BLUE}⏳ รอ MySQL พร้อม...${NC}"
for i in $(seq 1 30); do
    if docker compose exec mysql mysqladmin ping -p'password' --silent 2>/dev/null; then
        echo -e "${GREEN}   ✅ MySQL พร้อมแล้ว${NC}"
        break
    fi
    if [ "$i" = "30" ]; then
        echo -e "${RED}   ❌ MySQL ไม่ตอบสนอง${NC}"
        exit 1
    fi
    sleep 2
done

# =====================================================
# Step 3: ติดตั้ง dependencies
# =====================================================
echo -e "${BLUE}📦 Step 3: ติดตั้ง dependencies...${NC}"
docker compose exec laravel.test composer install --no-interaction --prefer-dist
echo -e "${GREEN}   ✅ composer install เสร็จ${NC}"

docker compose exec laravel.test npm install
echo -e "${GREEN}   ✅ npm install เสร็จ${NC}"

# =====================================================
# Step 4: Laravel setup
# =====================================================
echo -e "${BLUE}⚙️  Step 4: ตั้งค่า Laravel...${NC}"

# Generate key ถ้ายังไม่มี
docker compose exec laravel.test php artisan key:generate --force
echo -e "${GREEN}   ✅ App key generated${NC}"

# Run migrations
docker compose exec laravel.test php artisan migrate --force
echo -e "${GREEN}   ✅ Migrations เสร็จ${NC}"

# Create storage link
docker compose exec laravel.test php artisan storage:link 2>/dev/null || true
echo -e "${GREEN}   ✅ Storage link created${NC}"

# =====================================================
# Step 5: Build frontend
# =====================================================
echo -e "${BLUE}🏗️  Step 5: Build frontend...${NC}"
docker compose exec laravel.test npm run build
echo -e "${GREEN}   ✅ Frontend build เสร็จ${NC}"

# =====================================================
# Done!
# =====================================================
echo ""
echo -e "${GREEN}=============================================${NC}"
echo -e "${GREEN}🎉 พร้อมใช้งานแล้ว!${NC}"
echo -e "${GREEN}=============================================${NC}"
echo ""
echo -e "   🌐 เว็บ:     ${BLUE}http://localhost${NC}"
echo -e "   📧 Mailpit:  ${BLUE}http://localhost:8025${NC}"
echo -e "   🗄️ MySQL:    localhost:3306 (user: sail / pass: password)"
echo -e "   ⚡ Redis:    localhost:6379"
echo ""
echo -e "   หยุด:  ${YELLOW}./start-local.sh --stop${NC}"
echo -e "   สถานะ: ${YELLOW}./start-local.sh --status${NC}"
echo -e "   รีเซ็ต: ${YELLOW}./start-local.sh --fresh${NC}"
echo ""
