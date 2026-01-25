# 📊 CPE Repair System - Monitoring Stack

## Phase 2A: Security Impact Overview

Stack นี้ใช้สำหรับ monitoring ระบบ CPE Repair System

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    GRAFANA                          │
│              http://localhost:3001                  │
│         (Dashboard: Security Impact Overview)       │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
┌─────────────────────────────────────────────────────┐
│                   PROMETHEUS                        │
│              http://localhost:9090                  │
│              (Metrics Storage)                      │
└─────────────────────────────────────────────────────┘
          ▲                           ▲
          │                           │
┌─────────────────┐        ┌─────────────────┐
│  Node Exporter  │        │    cAdvisor     │
│   (Host: CPU,   │        │  (Container     │
│    RAM, Disk)   │        │   Metrics)      │
└─────────────────┘        └─────────────────┘
```

### 🚀 Quick Start

```bash
# Start monitoring stack
cd /home/kim/cpe_repair_system/monitoring
docker compose up -d

# Stop monitoring stack
docker compose down

# View logs
docker compose logs -f
```

### 🔗 URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Grafana** | http://localhost:3001 | from `.env` (GRAFANA_ADMIN_PASSWORD) |
| **Prometheus** | http://localhost:9090 | - |
| **Node Exporter** | http://localhost:9100 | - |
| **cAdvisor** | http://localhost:8080 | - |

### 📊 Dashboard: Security Impact Overview

เปิด Grafana → Dashboard → "CPE Repair - Security Impact Overview"

**วิธีอ่าน:**
- 🖥️ CPU นิ่ง = ✅ ระบบปกติ
- 🖥️ CPU ขยับ = 👀 ควรดู
- 🖥️ CPU พุ่ง = 🚨 ต้อง action

### 📁 File Structure

```
monitoring/
├── docker-compose.yml          # Main compose file
├── .env                        # Credentials (GRAFANA_ADMIN_PASSWORD)
├── prometheus/
│   └── prometheus.yml          # Prometheus config
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/        # Auto-provision datasources
│   │   └── dashboards/         # Auto-provision dashboards
│   └── dashboards/
│       └── security-impact-overview.json
└── README.md                   # This file
```

### 🔧 Configuration

**Prometheus Data Retention:** 15 days
**Scrape Interval:** 15 seconds
**Dashboard Refresh:** 10 seconds

### 💾 Resource Usage

| Service | RAM | CPU |
|---------|-----|-----|
| Prometheus | 512 MB | 0.5 core |
| Grafana | 256 MB | 0.25 core |
| Node Exporter | 64 MB | 0.1 core |
| cAdvisor | 128 MB | 0.25 core |
| Cloudflare Exporter | 64 MB | 0.1 core |
| **Total** | **~1 GB** | **~1.2 core** |

### 🔄 Phase Roadmap

- [x] **Phase 2A** - Foundation (Prometheus + Grafana + Node Exporter + cAdvisor)
- [x] **Phase 2B** - Cloudflare Metrics Integration ✅
- [ ] **Phase 3** - Logs (Loki) + Smart Alerting

