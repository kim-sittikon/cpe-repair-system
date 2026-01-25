#!/bin/bash
# Database Backup Script for CPE Repair System
# Run this script daily via cron: 0 2 * * * /path/to/backup-db.sh

# Configuration
BACKUP_DIR="/home/kim/cpe_repair_system/storage/backups"
DB_CONTAINER="cpe_repair_system-mysql-1"
DB_NAME="cpe_repair_system"
DB_USER="sail"
DB_PASSWORD="password"
KEEP_DAYS=7

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql.gz"

# Create backup
echo "Starting database backup..."
docker exec $DB_CONTAINER mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME 2>/dev/null | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created: $BACKUP_FILE"
    echo "   Size: $(du -h $BACKUP_FILE | cut -f1)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Delete old backups (older than KEEP_DAYS)
echo "Cleaning up old backups (keeping last $KEEP_DAYS days)..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$KEEP_DAYS -delete

echo "✅ Backup completed successfully!"
