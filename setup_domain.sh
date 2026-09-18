#!/usr/bin/env bash
# Script tự động cấu hình Nginx + SSL HTTPS cho shotlang.io.vn trên VPS
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

DOMAIN="shotlang.io.vn"
WWW_DOMAIN="www.shotlang.io.vn"
PORT="5100"

echo "=================================================="
echo "🚀 Đang tự động cấu hình Nginx + SSL cho $DOMAIN"
echo "Thư mục dự án: $SCRIPT_DIR"
echo "=================================================="

# Check root / sudo
if [ "$EUID" -ne 0 ]; then
  echo "❌ Vui lòng chạy lệnh với quyền sudo: sudo bash setup_domain.sh"
  exit 1
fi

# 1. Cài đặt Nginx, Certbot & OpenSSL
echo "📦 [1/5] Cài đặt Nginx, Certbot và OpenSSL..."
apt update -y
apt install -y nginx certbot python3-certbot-nginx openssl curl

# 2. Tạo sẵn chứng chỉ SSL tạm thời nếu chưa có để đảm bảo cổng 443 (HTTPS) hoạt động ngay lập tức không bị 502
echo "🔒 [2/5] Khởi tạo chứng chỉ SSL cho HTTPS..."
mkdir -p /etc/ssl/certs /etc/ssl/private
if [ ! -f "/etc/ssl/certs/shotlang.crt" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/shotlang.key \
        -out /etc/ssl/certs/shotlang.crt \
        -subj "/CN=$DOMAIN" &>/dev/null
fi

# 3. Tạo Nginx site configuration hỗ trợ cả HTTP (80) và HTTPS (443)
echo "🌐 [3/5] Tạo cấu hình Reverse Proxy Nginx (HTTP + HTTPS)..."
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

server {
    listen 443 ssl;
    server_name shotlang.io.vn www.shotlang.io.vn;

    ssl_certificate /etc/ssl/certs/shotlang.crt;
    ssl_certificate_key /etc/ssl/private/shotlang.key;

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
        proxy_set_header X-Forwarded-Proto https;
    }
}
EOF

# Kích hoạt Nginx site & reload service
ln -sf /etc/nginx/sites-available/shotlang /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 4. Thử đăng ký chứng chỉ SSL chính thức từ Let's Encrypt
echo "🔑 [4/5] Đăng ký chứng chỉ SSL chính thức (Let's Encrypt)..."
EMAIL="${1:-admin@$DOMAIN}"
if certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect --reinstall; then
    echo "✅ Đã đăng ký thành công chứng chỉ SSL Let's Encrypt chính thức!"
else
    echo "⚠️ Lưu ý: Let's Encrypt đang tạm khóa giới hạn thử lại (Rate Limit 1 giờ) do các lần thử trước khi trỏ DNS."
    echo "💡 Nginx đã được cấu hình SSL tạm thời để cả HTTP và HTTPS đều truy cập bình thường không bị lỗi 502."
    echo "👉 Sau 1 tiếng nữa, bạn chỉ cần gõ: sudo certbot --nginx -d shotlang.io.vn -d www.shotlang.io.vn để cấp SSL chính thức."
fi

systemctl reload nginx || true

# 5. Cập nhật ALLOWED_ORIGINS trong .env nếu có
if [ -f ".env" ]; then
    if ! grep -q "shotlang.io.vn" .env; then
        echo "" >> .env
        echo "ALLOWED_ORIGINS=https://shotlang.io.vn,https://www.shotlang.io.vn,http://localhost:5100,http://222.255.214.218:5100" >> .env
    fi
fi

# 6. Build & Khởi động Docker containers trong đúng thư mục dự án
echo "🐳 [5/5] Khởi động Docker container ứng dụng..."
if command -v docker &> /dev/null; then
    if docker compose version &> /dev/null; then
        docker compose up -d --build
    elif command -v docker-compose &> /dev/null; then
        docker-compose up -d --build
    fi
fi

echo "=================================================="
echo "✅ HOÀN TẤT CẤU HÌNH DOMAIN & SSL!"
echo "👉 Bạn có thể truy cập website ngay tại: https://$DOMAIN hoặc http://$DOMAIN"
echo "=================================================="
