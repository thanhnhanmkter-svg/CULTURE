# OPPO Workshop Culture — Setup Guide

## Cấu trúc thư mục

```
workshop-culture/
├── src/
│   ├── app/
│   │   ├── layout.js          ← Root layout (font Sora, metadata)
│   │   ├── globals.css        ← Tailwind + custom animations
│   │   ├── page.js            ← Client: DNA Lock → Quiz
│   │   ├── host/
│   │   │   └── page.js        ← Host: Realtime chart + Heart wall
│   │   └── admin/
│   │       └── page.js        ← Admin: CRUD case studies
│   ├── lib/
│   │   └── firebase.js        ← Firebase helpers (Realtime DB)
│   └── hooks/
│       └── useUserId.js       ← Persistent userId per device
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── database.rules.json        ← Firebase security rules
```

## 1. Setup Firebase Realtime Database

1. Vào [console.firebase.google.com](https://console.firebase.google.com)
2. Chọn project **workshop-culture**
3. **Realtime Database** → Create database → chọn region `asia-southeast1`
4. Vào tab **Rules** → paste nội dung `database.rules.json`
5. **Quan trọng**: Copy `databaseURL` từ trang Realtime Database (dạng `https://workshop-culture-default-rtdb.asia-southeast1.firebasedatabase.app`) và cập nhật vào `src/lib/firebase.js`

## 2. Cài đặt & chạy

```bash
npm install
npm run dev
```

## 3. Routes

| URL | Dành cho | Mô tả |
|-----|----------|-------|
| `/` | Nhân viên (mobile) | DNA Lock → Quiz → Thả tim |
| `/host` | Máy chiếu | Realtime chart + Heart wall + Controls |
| `/admin` | BTC | CRUD case studies |

## 4. Luồng sử dụng trong buổi Workshop

1. **BTC** vào `/admin` → Thêm các case study trước buổi học
2. **Kết nối máy chiếu** vào `/host`
3. **Nhân viên** mở điện thoại → quét QR → vào `/` → Unlock DNA → sẵn sàng
4. **Host** bấm "▶ Chiếu" hoặc "Case tiếp theo" → màn hình nhân viên tự động cập nhật
5. **Nhân viên** bấm A hoặc B → biểu đồ trên host nhảy số realtime
6. **Host** bấm "Hiện kết quả" → đáp án đúng được highlight xanh

## 5. Deploy lên Vercel

```bash
npm run build
# Push lên GitHub rồi import vào vercel.com
```

Framework: **Next.js** | Build: `npm run build` | Output: `.next`
