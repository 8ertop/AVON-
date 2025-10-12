# 🤖 Facebook Chatbot - AION Bot

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![License](https://img.shields.io/badge/License-ISC-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

**Bot Facebook tự động với hơn 60+ lệnh mạnh mẽ**

[Tính năng](#-tính-năng) • [Cài đặt](#-cài-đặt) • [Cấu hình](#️-cấu-hình) • [Sử dụng](#-sử-dụng) • [Commands](#-danh-sách-lệnh)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#️-cấu-hình)
- [Sử dụng](#-sử-dụng)
- [Danh sách lệnh](#-danh-sách-lệnh)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Keys](#-api-keys)
- [Troubleshooting](#-troubleshooting)
- [Đóng góp](#-đóng-góp)
- [Credits](#-credits)
- [License](#-license)

---

## 🌟 Giới thiệu

**AION Bot** là một chatbot Facebook đa năng được phát triển bằng Node.js, tích hợp nhiều tính năng thông minh và giải trí. Bot hỗ trợ tự động hóa các tác vụ trên Facebook Messenger với hơn 60+ lệnh được tối ưu hóa.

### ✨ Điểm nổi bật

- 🚀 **Hiệu suất cao**: Xử lý đa luồng, tự động restart khi gặp lỗi
- 🎮 **Đa chức năng**: Hơn 60+ lệnh từ giải trí đến công cụ hữu ích
- 🤖 **AI Integration**: Tích hợp Google Gemini AI
- 💰 **Hệ thống kinh tế**: Economy system với currency, daily rewards, quests
- 🎵 **Media Support**: Download TikTok, YouTube, Spotify, và nhiều hơn nữa
- 🛡️ **Anti-spam**: Hệ thống chống spam và quản lý nhóm
- 📊 **Dashboard**: Web dashboard để quản lý bot
- 🔄 **Auto-reload**: Tự động reload commands khi cập nhật

---

## 🎯 Tính năng

### 🤖 AI & Trí tuệ nhân tạo
- **AI Chat**: Trò chuyện với Google Gemini AI
- **Age Detection**: Nhận diện tuổi và giới tính từ ảnh
- **Image Recognition**: Phân tích và nhận diện hình ảnh

### 🎮 Giải trí & Game
- **Quiz**: Trò chơi đố vui với nhiều chủ đề
- **Bầu Cua Tôm Cá**: Game cá cược truyền thống Việt Nam
- **Rank System**: Hệ thống xếp hạng người dùng
- **Top Users**: Bảng xếp hạng giàu nhất/hoạt động nhiều nhất

### 💰 Hệ thống kinh tế
- **Balance**: Kiểm tra số dư
- **Daily**: Nhận thưởng hàng ngày
- **Pay**: Chuyển tiền cho người khác
- **Crypto**: Theo dõi giá cryptocurrency
- **Stock**: Thông tin chứng khoán

### 🎵 Media & Download
- **TikTok**: Download video TikTok không watermark
- **Spotify**: Thông tin bài hát trên Spotify
- **Music**: Tìm kiếm và phát nhạc
- **Sing**: Chuyển text thành giọng nói
- **Video**: Download video từ nhiều nguồn
- **Imgur**: Upload ảnh lên Imgur

### 🛠️ Công cụ hữu ích
- **Weather**: Thông tin thời tiết
- **QR Code**: Tạo và đọc mã QR
- **Shorten**: Rút gọn link
- **SSL Check**: Kiểm tra SSL certificate
- **Speed Test**: Test tốc độ mạng
- **IP Info**: Thông tin địa chỉ IP
- **Convert**: Chuyển đổi đơn vị
- **Translate**: Dịch ngôn ngữ (tích hợp trong các lệnh)

### 👥 Quản lý nhóm
- **Anti-out**: Chống kick khỏi nhóm
- **Anti-name**: Chống đổi tên nhóm
- **Anti-color**: Chống đổi màu chat
- **Anti-avatar**: Chống đổi ảnh nhóm
- **Box Info**: Thông tin nhóm
- **Member**: Thông tin thành viên
- **Thread**: Quản lý thread

### 🔧 Admin & Moderation
- **Admin**: Quản lý admin bot
- **Ban/Unban**: Cấm người dùng hoặc nhóm
- **Add User**: Thêm user vào database
- **Shell**: Chạy lệnh shell (admin only)
- **Restart**: Khởi động lại bot
- **Load/Module**: Quản lý modules

### 📊 Thông tin & Tra cứu
- **Info**: Thông tin người dùng Facebook
- **UID/TID**: Lấy User ID / Thread ID
- **Anime**: Thông tin anime
- **Movie**: Thông tin phim
- **Wiki**: Tra cứu Wikipedia
- **Fact**: Sự thật ngẫu nhiên

---

## 💻 Yêu cầu hệ thống

### Phần mềm cần thiết

- **Node.js**: v18.0.0 trở lên
- **NPM**: v8.0.0 trở lên (hoặc Yarn)
- **Git**: Để clone repository
- **PM2**: (Khuyến nghị) Để chạy bot 24/7

### Hệ điều hành hỗ trợ

- ✅ Windows 10/11
- ✅ Linux (Ubuntu 20.04+, Debian, CentOS)
- ✅ MacOS
- ✅ VPS/Cloud Servers

### Tài nguyên khuyến nghị

- **RAM**: Tối thiểu 512MB, khuyến nghị 1GB+
- **Storage**: 500MB trống
- **Internet**: Kết nối ổn định

---

## 📥 Cài đặt

### Bước 1: Clone Repository

```bash
# Clone repository
git clone https://github.com/yourusername/Fix-FCA-Pack-Share.git

# Di chuyển vào thư mục
cd Fix-FCA-Pack-Share
```

### Bước 2: Cài đặt Dependencies

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install
```

> ⚠️ **Lưu ý**: Quá trình cài đặt có thể mất 5-10 phút do có nhiều dependencies

### Bước 3: Cấu hình AppState

1. **Lấy AppState từ Facebook:**
   - Sử dụng extension [c3c-fbstate](https://github.com/c3cbot/c3c-fbstate)
 
2. **Tạo file appstate.json:**

```bash
# Copy file mẫu
cp appstate.json.example appstate.json
```

3. **Paste appstate vào file `appstate.json`**

### Bước 4: Cấu hình Bot

Chỉnh sửa file `admin.json`:

```json
{
  "prefix": ".",
  "adminUIDs": ["YOUR_FACEBOOK_UID"],
  "moderatorUIDs": ["MOD_UID_1", "MOD_UID_2"],
  "botName": "AION",
  "ownerName": "Your Name",
  "facebookLink": "YOUR_FACEBOOK_ID",
  "resend": false,
  "notilogs": true,
  "appstate": "./appstate.json",
  "restart": true,
  "restartTime": 50,
  "FCA": "hut-chat-api",
  "loginpanel": {
    "user": "admin",
    "password": "yourpassword",
    "passcode": "0000"
  }
}
```

### Bước 5: Chạy Bot

```bash
# Chạy trực tiếp
npm start

# Hoặc chạy với PM2 (khuyến nghị)
pm2 start index.js --name "aion-bot"
pm2 save
pm2 startup
```

---

## ⚙️ Cấu hình

### File cấu hình chính: `admin.json`

| Tham số | Mô tả | Kiểu dữ liệu | Mặc định |
|---------|-------|--------------|----------|
| `prefix` | Prefix để gọi lệnh | String | "." |
| `adminUIDs` | Danh sách UID admin | Array | [] |
| `moderatorUIDs` | Danh sách UID moderator | Array | [] |
| `botName` | Tên bot | String | "AION" |
| `ownerName` | Tên chủ sở hữu | String | "" |
| `facebookLink` | Link Facebook chủ sở hữu | String | "" |
| `resend` | Tự động gửi lại tin nhắn lỗi | Boolean | false |
| `notilogs` | Bật/tắt notification logs | Boolean | true |
| `restart` | Tự động restart | Boolean | true |
| `restartTime` | Thời gian restart (phút) | Number | 50 |
| `FCA` | API sử dụng | String | "hut-chat-api" |

### Cấu hình FCA API

File: `logins/hut-chat-api/config.json`

```json
{
  "APPSTATE_PATH": "./appstate.json",
  "PROXY": false,
  "PROXY_URL": ""
}
```

### Cấu hình Proxy

Thêm proxy vào file `utils/prox.txt`:

```
http://proxy1.com:8080
http://proxy2.com:8080
socks5://proxy3.com:1080
```

---

## 🚀 Sử dụng

### Chạy Bot

```bash
# Development
npm start

# Production với PM2
pm2 start index.js --name aion-bot

# Xem logs
pm2 logs aion-bot

# Restart bot
pm2 restart aion-bot

# Stop bot
pm2 stop aion-bot
```

### Sử dụng Commands

Gửi tin nhắn trong Messenger với format:

```
[prefix][command] [arguments]
```

**Ví dụ:**

```
.help              # Xem danh sách lệnh
.ai Hello bot     # Chat với AI
.tiktok [url]     # Download TikTok video
.weather Hanoi    # Xem thời tiết Hà Nội
.balance          # Kiểm tra số dư
.daily            # Nhận thưởng hàng ngày
```

### Dashboard

Truy cập dashboard tại:

```
http://localhost:3000
```

Login với thông tin trong `admin.json` > `loginpanel`

---

## 📝 Danh sách lệnh

### 🎯 Lệnh cơ bản

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `help` | Xem tất cả lệnh | `.help` |
| `info` | Thông tin user | `.info @mention` |
| `uid` | Lấy User ID | `.uid` |
| `tid` | Lấy Thread ID | `.tid` |
| `uptime` | Thời gian hoạt động | `.uptime` |
| `bot` | Thông tin bot | `.bot` |

### 🤖 AI & Công cụ thông minh

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `ai` | Chat với AI | `.ai Xin chào` |
| `age` | Nhận diện tuổi từ ảnh | `.age [reply ảnh]` |
| `gai` | Google Gemini AI | `.gai Tạo câu chuyện` |

### 💰 Kinh tế & Game

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `balance` | Xem số dư | `.balance` |
| `daily` | Nhận thưởng ngày | `.daily` |
| `pay` | Chuyển tiền | `.pay @user 1000` |
| `bctc` | Bầu cua tôm cá | `.bctc [bau/cua/tom/ca] 1000` |
| `quiz` | Đố vui | `.quiz` |
| `rank` | Xem rank | `.rank` |
| `top` | Bảng xếp hạng | `.top` |

### 🎵 Media & Download

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `tiktok` | Download TikTok | `.tiktok [url]` |
| `spotify` | Thông tin Spotify | `.spotify [url]` |
| `music` | Tìm nhạc | `.music Shape of You` |
| `sing` | Text to speech | `.sing Hello world` |
| `video` | Download video | `.video [url]` |

### 🌐 Thông tin & Tra cứu

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `weather` | Thời tiết | `.weather Hanoi` |
| `crypto` | Giá crypto | `.crypto BTC` |
| `stock` | Thông tin chứng khoán | `.stock AAPL` |
| `anime` | Thông tin anime | `.anime Naruto` |
| `movie` | Thông tin phim | `.movie Avatar` |
| `wiki` | Wikipedia | `.wiki Vietnam` |

### 🛠️ Công cụ

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `qr` | Tạo QR code | `.qr https://google.com` |
| `shorten` | Rút gọn link | `.shorten https://example.com` |
| `ssl` | Kiểm tra SSL | `.ssl google.com` |
| `speedtest` | Test tốc độ | `.speedtest` |
| `ip` | Thông tin IP | `.ip 1.1.1.1` |

### 👥 Quản lý nhóm (Admin)

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `antiout` | Chống out | `.antiout on` |
| `antiname` | Chống đổi tên | `.antiname on` |
| `anticolor` | Chống đổi màu | `.anticolor on` |
| `boxinfo` | Info nhóm | `.boxinfo` |
| `thread` | Quản lý thread | `.thread` |

### 🔧 Admin Bot

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `admin` | Quản lý admin | `.admin add @user` |
| `shell` | Chạy shell | `.shell ls -la` |
| `restart` | Restart bot | `.restart` |
| `load` | Load module | `.load [module]` |
| `module` | Quản lý module | `.module list` |

---

## 📁 Cấu trúc dự án

```
Fix-FCA-Pack-Share/
├── 📂 commands/              # Thư mục chứa các lệnh
│   ├── ai.js
│   ├── balance.js
│   ├── tiktok.js
│   └── ...
├── 📂 events/                # Thư mục chứa events
│   ├── greet.js             # Chào mừng thành viên mới
│   ├── leave.js             # Tạm biệt thành viên
│   └── ...
├── 📂 database/              # Database JSON
│   ├── users.json           # Dữ liệu người dùng
│   ├── threads.json         # Dữ liệu nhóm
│   ├── currencies.json      # Dữ liệu tiền tệ
│   └── ...
├── 📂 logins/                # Thư mục FCA APIs
│   └── hut-chat-api/        # Main FCA API
├── 📂 utils/                 # Utilities
│   ├── listen.js            # Xử lý tin nhắn
│   ├── commandHandle.js     # Xử lý commands
│   └── ...
├── 📂 fonts/                 # Fonts cho canvas
├── 📄 index.js               # Entry point
├── 📄 main.js                # Main bot logic
├── 📄 dashboard.js           # Web dashboard
├── 📄 admin.json             # Cấu hình admin
├── 📄 appstate.json          # Facebook appstate
├── 📄 package.json           # NPM dependencies
└── 📄 README.md              # Documentation
```

---

## 🔑 API Keys

Một số tính năng yêu cầu API keys. Thêm vào file tương ứng:

### Google Gemini AI

File: `commands/json/gemini.json`

```json
{
  "apiKey": "YOUR_GEMINI_API_KEY"
}
```

Lấy API key tại: [Google AI Studio](https://makersuite.google.com/app/apikey)

### Các API khác

Bot sử dụng nhiều free APIs không cần key:
- TikTok Downloader
- Weather API
- Crypto API
- Wikipedia API

---

## 🔧 Troubleshooting

### Lỗi đăng nhập

**Vấn đề**: Bot không thể đăng nhập Facebook

**Giải pháp**:
1. Kiểm tra appstate còn hiệu lực
2. Lấy appstate mới
3. Sử dụng tài khoản Facebook ít bảo mật hơn (không 2FA)
4. Thử proxy nếu IP bị block

```bash
# Test appstate
node -e "console.log(require('./appstate.json'))"
```

### Lỗi Module Not Found

**Vấn đề**: Thiếu dependencies

**Giải pháp**:

```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Hoặc install module cụ thể
npm install [module-name]
```

### Bot bị crash

**Vấn đề**: Bot tự động thoát

**Giải pháp**:
1. Xem logs để tìm lỗi:

```bash
pm2 logs aion-bot --lines 100
```

2. Kiểm tra RAM và CPU
3. Tăng memory limit:

```bash
pm2 start index.js --name aion-bot --max-memory-restart 500M
```

### Database corrupt

**Vấn đề**: File JSON bị lỗi

**Giải pháp**:

```bash
# Backup database
cp database/users.json database/users.json.backup

# Reset về mặc định
echo "{}" > database/users.json
```

### Proxy không hoạt động

**Vấn đề**: Không kết nối được qua proxy

**Giải pháp**:
1. Test proxy:

```bash
curl --proxy http://your-proxy:port https://google.com
```

2. Thử proxy khác
3. Disable proxy trong config

---

## 🤝 Đóng góp

Chúng tôi luôn chào đón mọi đóng góp! 

### Cách đóng góp

1. **Fork repository**
2. **Tạo branch mới**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Tạo Pull Request**

### Coding Guidelines

- Sử dụng ES6+ syntax
- Comment code rõ ràng
- Follow existing code style
- Test kỹ trước khi PR

### Báo lỗi

Tạo issue với thông tin:
- Mô tả lỗi
- Steps to reproduce
- Expected vs Actual behavior
- Screenshots (nếu có)
- Environment (OS, Node version)

---

## 👨‍💻 Credits

### Developers

- **CC Projects** - Core Developer
- **Kaguya** - Co-Developer
- **Kenji Akira** - Lead Developer & Maintainer

### Dedicated To

- **Arjhil Ducayanan**
- **JR Busaco**
- **Jonell Magallanes**
- **Jay Mar**
- **Kenji Akira**

### Special Thanks

- **Chatbot Community** - For support and contributions
- **@xaviabot/fca-unofficial** - For FCA library
- **Facebook-Chat-API Contributors**

---

## 📄 License

This project is licensed under the **ISC License**.

```
Copyright (c) 2025 CC Projects, Kaguya, Kenji Akira

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

<div align="center">

### ⭐ Nếu project hữu ích, hãy cho chúng tôi một star!

**Made with ❤️ by CC Projects & Team**

[⬆ Về đầu trang](#-facebook-chatbot---aion-bot)

</div>

