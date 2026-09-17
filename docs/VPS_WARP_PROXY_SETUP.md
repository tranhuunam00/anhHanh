# Hướng dẫn: Cấu hình Cloudflare WARP làm SOCKS5 Proxy cho Docker (VPS Production)

> **Mục đích**: YouTube chặn IP datacenter → cần route request qua Cloudflare WARP proxy.  
> **VPS**: Ubuntu 24.04 (Noble), IP `222.255.214.218`, user `root`.

---

## Tóm tắt kiến trúc

```
Docker container (dailydictation_web)
    │
    │ socks5://host.docker.internal:40001
    ▼
socat bridge (host VPS, 0.0.0.0:40001)
    │
    │ TCP forward → 127.0.0.1:40000
    ▼
Cloudflare WARP svc (127.0.0.1:40000) [loopback only]
    │
    ▼
YouTube / Internet (qua Cloudflare network)
```

**Vì sao cần socat?**  
`warp-svc` chỉ bind SOCKS5 proxy vào `127.0.0.1:40000` (loopback nội bộ của VPS).  
Docker container chạy bridge network → kết nối vào host qua `172.17.0.1`, không phải `127.0.0.1` → bị từ chối (`[Errno 111] Connection refused`).  
`socat` đóng vai trò cầu nối: lắng nghe trên `0.0.0.0:40001` rồi forward sang `127.0.0.1:40000`.

---

## Cài đặt lần đầu (từ đầu)

### Bước 1: Cài Cloudflare WARP

```bash
# Thêm repo Cloudflare
curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/cloudflare-client.list
apt update && apt install -y cloudflare-warp
```

### Bước 2: Đăng ký và cấu hình WARP

```bash
# Đăng ký (chỉ cần 1 lần)
warp-cli registration new

# Chuyển sang chế độ proxy (không phải VPN toàn bộ hệ thống)
warp-cli mode proxy

# Đặt cổng SOCKS5 (mặc định 40000)
warp-cli proxy port 40000

# Kết nối
warp-cli connect

# Kiểm tra trạng thái
warp-cli status
# → phải in: Status update: Connected
```

### Bước 3: Cài socat + tạo systemd service

```bash
apt install -y socat

cat << 'EOF' > /etc/systemd/system/warp-docker.service
[Unit]
Description=Bridge Cloudflare WARP SOCKS5 Proxy to Docker Bridge Network
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/socat TCP-LISTEN:40001,fork,reuseaddr TCP:127.0.0.1:40000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now warp-docker

# Kiểm tra service đang chạy
systemctl status warp-docker
```

### Bước 4: Cấu hình `.env` trong project

```bash
# Trong ~/anhHanh/.env thêm hoặc sửa dòng:
YOUTUBE_PROXY=socks5://host.docker.internal:40001
```

`docker-compose.yml` đã có:
```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```
→ `host.docker.internal` sẽ resolve thành `172.17.0.1` (docker0 bridge gateway).

### Bước 5: Restart container

```bash
cd ~/anhHanh
docker compose up -d
```

---

## Kiểm tra / Verify

### Kiểm tra socat đang listen

```bash
ss -tlnp | grep 40001
# phải thấy: LISTEN  0  5  0.0.0.0:40001
```

### Kiểm tra WARP đang connect

```bash
warp-cli status
# → Status update: Connected
# → Network: healthy
```

### Kiểm tra từ bên trong Docker container

```bash
docker exec -it dailydictation_web python -c "
import requests
r = requests.get(
    'https://cloudflare.com/cdn-cgi/trace',
    proxies={'http': 'socks5://host.docker.internal:40001', 'https': 'socks5://host.docker.internal:40001'}
)
print(r.text)
"
# Phải thấy: warp=on
```

### Kiểm tra backend load được phụ đề YouTube

```bash
docker exec -it dailydictation_web python -c "
from app.infrastructure.youtube_adapter import YouTubeTranscriptAdapter
a = YouTubeTranscriptAdapter()
snippets, lang = a._fetch_source_transcript('qe9QSCF-d88')
print('OK! Số câu phụ đề:', len(snippets), '| Ngôn ngữ:', lang)
"
```

---

## Xử lý sự cố

### WARP bị ngắt kết nối sau reboot

```bash
# WARP tự start nhưng cần reconnect thủ công đôi khi
warp-cli connect
systemctl restart warp-docker
```

Để WARP tự connect sau reboot, tạo service:
```bash
cat << 'EOF' > /etc/systemd/system/warp-autoconnect.service
[Unit]
Description=Auto-connect Cloudflare WARP on boot
After=network-online.target cloudflare-warp.service
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/bin/warp-cli connect
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable warp-autoconnect
```

### socat dừng / không nhận kết nối

```bash
systemctl restart warp-docker
systemctl status warp-docker
journalctl -u warp-docker -n 20
```

### `[Errno 111] Connection refused`

Nguyên nhân: WARP chỉ bind `127.0.0.1:40000`, socat chưa chạy hoặc bị dừng.
```bash
# Kiểm tra socat
systemctl status warp-docker

# Kiểm tra port
ss -tlnp | grep 40001

# Nếu socat không listen:
systemctl start warp-docker
```

### `IpBlocked: YouTube is blocking requests from your IP`

WARP chưa connect hoặc bị disconnect:
```bash
warp-cli status
warp-cli connect
docker compose restart web
```

---

## Biến môi trường liên quan (`.env`)

```env
# Proxy SOCKS5 qua Cloudflare WARP (bắt buộc trên VPS production)
YOUTUBE_PROXY=socks5://host.docker.internal:40001

# Cookie file YouTube (tùy chọn, tăng khả năng bypass)
YOUTUBE_COOKIE_FILE=/app/data/cookies.txt
```

---

## Ports & Services tóm tắt

| Service | Host Port | Mô tả |
|---|---|---|
| WARP SOCKS5 | `127.0.0.1:40000` | Cloudflare WARP proxy (loopback only) |
| socat bridge | `0.0.0.0:40001` | Forward từ Docker sang WARP |
| Web app | `0.0.0.0:5100` | DailyDictation Studio |
| PostgreSQL | `127.0.0.1:5444` | Database |
