#!/usr/bin/env bash
# Script tự động cấu hình Nginx + SSL HTTPS cho shotlang.io.vn trên VPS
set -e

DOMAIN="shotlang.io.vn"
WWW_DOMAIN="www.shotlang.io.vn"
PORT="5100"

echo "=================================================="
echo "🚀 Đang tự động cấu hình Nginx + SSL cho $DOMAIN"
echo "=================================================="

# Check root / sudo
if [ "$EUID" -ne 0 ]; then
  echo "❌ Vui lòng chạy lệnh với quyền sudo: sudo bash setup_domain.sh"
  exit 1
fi

# 1. Cài đặt Nginx & Certbot
echo "📦 [1/5] Cài đặt Nginx và Certbot..."
apt update -y
apt install -y nginx certbot python3-certbot-nginx

# 2. Tạo Nginx site configuration
echo "🌐 [2/5] Tạo cấu hình Reverse Proxy Nginx..."
cat << 'EOF' > /etc/nginx/sites-available/shotlang
server {
    listen 80;
    server_name shotlang.io.vn www.shotlang.io.vn;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 3. Kích hoạt Nginx site
echo "⚙️ [3/5] Kích hoạt Nginx site & reload service..."
ln -sf /etc/nginx/sites-available/shotlang /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 4. Cài đặt SSL HTTPS miễn phí (Certbot)
echo "🔒 [4/5] Đăng ký chứng chỉ SSL HTTPS (Let's Encrypt)..."
EMAIL="${1:-admin@$DOMAIN}"
certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect || \
certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect || true

# 5. Cập nhật ALLOWED_ORIGINS trong .env nếu có
if [ -f ".env" ]; then
    if ! grep -q "shotlang.io.vn" .env; then
        echo "" >> .env
        echo "ALLOWED_ORIGINS=https://shotlang.io.vn,https://www.shotlang.io.vn,http://localhost:5100,http://222.255.214.218:5100" >> .env
    fi
fi

# 6. Khởi động lại Docker containers
echo "🐳 [5/5] Khởi động Docker container..."
if command -v docker &> /dev/null; then
    docker compose up -d --build || true
fi

echo "=================================================="
echo "✅ HOÀN TẤT CẤU HÌNH DOMAIN & SSL!"
echo "👉 Bạn có thể truy cập website ngay tại: https://$DOMAIN"
echo "=================================================="
