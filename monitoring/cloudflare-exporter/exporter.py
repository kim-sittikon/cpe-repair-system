#!/usr/bin/env python3
"""
Cloudflare Metrics Exporter for Prometheus
Fetches HTTP requests and threats metrics from Cloudflare GraphQL API
"""

import os
import sys
import time
import json
import http.server
import urllib.request
from datetime import datetime, timedelta, timezone

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

# Configuration from environment
CF_API_TOKEN = os.environ.get('CF_API_TOKEN', '')
CF_ZONE_ID = os.environ.get('ZONE_ID', '')
LISTEN_PORT = int(os.environ.get('LISTEN_PORT', '9199'))

print(f"[INIT] Zone ID: {CF_ZONE_ID[:8]}..." if CF_ZONE_ID else "[INIT] Zone ID: NOT SET")
print(f"[INIT] Token: {CF_API_TOKEN[:8]}..." if CF_API_TOKEN else "[INIT] Token: NOT SET")

# Metrics cache
metrics_cache = {
    'total_requests': 0,
    'total_threats': 0,
    'cached_requests': 0,
    'last_update': 0
}

def fetch_cloudflare_metrics():
    """Fetch metrics from Cloudflare GraphQL API"""
    global metrics_cache
    
    now = time.time()
    # Only fetch every 60 seconds (but allow first fetch when last_update is 0)
    if metrics_cache['last_update'] > 0 and (now - metrics_cache['last_update']) < 60:
        return metrics_cache
    
    print(f"[FETCH] Fetching Cloudflare metrics...")
    
    # Query last 24 hours of data
    since = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime('%Y-%m-%dT%H:%M:%SZ')
    
    query = '''
    {
        viewer {
            zones(filter: {zoneTag: "%s"}) {
                httpRequests1hGroups(limit: 1, filter: {datetime_gt: "%s"}) {
                    sum {
                        requests
                        threats
                        cachedRequests
                    }
                }
            }
        }
    }
    ''' % (CF_ZONE_ID, since)
    
    try:
        req = urllib.request.Request(
            'https://api.cloudflare.com/client/v4/graphql',
            data=json.dumps({'query': query}).encode('utf-8'),
            headers={
                'Authorization': f'Bearer {CF_API_TOKEN}',
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        print(f"[FETCH] Response received")
            
        if 'data' in data and data['data'] and data['data']['viewer']['zones']:
            groups = data['data']['viewer']['zones'][0].get('httpRequests1hGroups', [])
            if groups:
                m = groups[0]['sum']
                metrics_cache = {
                    'total_requests': m.get('requests', 0),
                    'total_threats': m.get('threats', 0),
                    'cached_requests': m.get('cachedRequests', 0),
                    'last_update': time.time()
                }
                print(f"[FETCH] Success: requests={metrics_cache['total_requests']}, threats={metrics_cache['total_threats']}")
            else:
                print(f"[FETCH] No data in response")
        else:
            print(f"[FETCH] Invalid response: {str(data)[:100]}")
    except Exception as e:
        print(f"[FETCH] Error: {e}")
    
    return metrics_cache

def generate_metrics():
    """Generate Prometheus-format metrics"""
    metrics = fetch_cloudflare_metrics()
    
    lines = [
        '# HELP cloudflare_zone_requests_total Total HTTP requests in the last hour',
        '# TYPE cloudflare_zone_requests_total gauge',
        f'cloudflare_zone_requests_total{{zone_id="{CF_ZONE_ID}"}} {metrics["total_requests"]}',
        '# HELP cloudflare_zone_threats_total Total threats blocked in the last hour',
        '# TYPE cloudflare_zone_threats_total gauge',
        f'cloudflare_zone_threats_total{{zone_id="{CF_ZONE_ID}"}} {metrics["total_threats"]}',
        '# HELP cloudflare_zone_cached_requests_total Total cached requests in the last hour',
        '# TYPE cloudflare_zone_cached_requests_total gauge',
        f'cloudflare_zone_cached_requests_total{{zone_id="{CF_ZONE_ID}"}} {metrics["cached_requests"]}',
        '# HELP cloudflare_exporter_last_scrape_timestamp Unix timestamp of last successful scrape',
        '# TYPE cloudflare_exporter_last_scrape_timestamp gauge',
        f'cloudflare_exporter_last_scrape_timestamp {metrics["last_update"]}',
    ]
    return '\n'.join(lines) + '\n'

class MetricsHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/metrics':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(generate_metrics().encode('utf-8'))
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        print(f"[HTTP] {args[0]}")

if __name__ == '__main__':
    print(f"[INIT] Starting Cloudflare Exporter on port {LISTEN_PORT}")
    server = http.server.HTTPServer(('', LISTEN_PORT), MetricsHandler)
    print(f"[INIT] Serving metrics at http://0.0.0.0:{LISTEN_PORT}/metrics")
    server.serve_forever()
