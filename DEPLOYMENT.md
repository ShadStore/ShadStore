# خطة النشر والربط الكامل - ShadStore

## نظرة عامة

```
┌─────────────────────────────────────────────────────────────────────┐
│                    بنية النشر المؤقتة (Temporary)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │  shad-store  │    │  shad-admin  │    │  shad-api    │         │
│  │  (Vercel)    │    │  (Vercel)    │    │  (Render)    │         │
│  │              │    │              │    │              │         │
│  │  store-     │    │  admin-     │    │  Express.js  │         │
│  │  zeta.vercel│    │  api-server │    │  + Esbuild   │         │
│  │  .app       │    │  .vercel.app │    │  .onrender   │         │
│  └──────┬───────┘    └──────┬───────┘    │  .com       │         │
│         │                   │            └──────┬───────┘         │
│         │                   │                   │                  │
│         └───────────────────┼───────────────────┘                  │
│                             │                                      │
│                    ┌────────▼────────┐                            │
│                    │  Supabase DB     │                            │
│                    │  (PostgreSQL)    │                            │
│                    └─────────────────┘                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. متغيرات البيئة -/env for API Server

### الملف: `artifacts/api-server/.env`

```env
# ============================================
# Authentication & Defaults
# ============================================
ALLOW_DEFAULT_TELEGRAM_ID=true
ALLOW_UNVERIFIED_TELEGRAM_ID=false
TELEGRAM_AUTH_MAX_AGE_SECONDS=86400

# ============================================
# Database
# ============================================
DATABASE_URL=postgresql://postgres:tior6YHOhUUQllKE@db.vgnqvrxldicqibzhdzyz.supabase.co:5432/postgres

# ============================================
# Server
# ============================================
PORT=3000
NODE_ENV=production
SESSION_SECRET=32QTfKJjvNxwhPkqai0VmW1zaOmoMslGul
LOG_LEVEL=info

# ============================================
# CORS - Allowed Origins
# ============================================
CLIENT_URL=https://shadstore-zeta.vercel.app,https://shad-admin-api-server.vercel.app

# ============================================
# Public API URL (للـ Webhooks والروابط الخارجية)
# ============================================
PUBLIC_API_BASE_URL=https://shadstore.onrender.com
API_PUBLIC_URL=https://shadstore.onrender.com

# ============================================
# Telegram - Store Bot
# ============================================
TELEGRAM_STORE_BOT_TOKEN=          # ← أضفه بعد النشر من BotFather
TELEGRAM_STORE_WEBHOOK_SECRET=ibDf2xByOIaXP5i1R08v5fBqJ5zqRatPefG
TELEGRAM_MINI_APP_URL=https://shadstore-zeta.vercel.app
TELEGRAM_SUPPORT_URL=https://t.me/AbuAlAlaX

# ============================================
# Telegram - Admin Bot
# ============================================
TELEGRAM_ADMIN_BOT_TOKEN=          # ← أضفه بعد النشر من BotFather
TELEGRAM_ADMIN_WEBHOOK_SECRET=shadstore_admin_webhook_2026_very_secret_123
TELEGRAM_ADMIN_WEBHOOK_STRICT=false
TELEGRAM_ADMIN_IDS=8559379666,6555900873
TELEGRAM_ADMIN_CHAT_ID=           # ← أضفه بعد النشر (chat ID أو قناة الإشعارات)

# ============================================
# Payment Provider (SAM)
# ============================================
SAM_API_BASE_URL=https://sam-api.pro/api
SAM_PAY_BASE_URL=https://sam-api.pro
SAM_API_KEY=                      # ← أضفه بعد النشر
SAM_SHAMCASH_IDENTIFIER=          # ← أضفه بعد النشر
SAM_WEBHOOK_SECRET=               # ← أضفه بعد النشر
```

### ملاحظات هامة على المتغيرات:

| المتغير | الحالة | ملاحظة |
|---------|--------|--------|
| `TELEGRAM_STORE_BOT_TOKEN` | ✗ يحتاج إدخال | من BotFather - بوت المتجر |
| `TELEGRAM_ADMIN_BOT_TOKEN` | ✗ يحتاج إدخال | من BotFather - بوت الإدارة |
| `TELEGRAM_ADMIN_CHAT_ID` | ✗ يحتاج إدخال | chat ID للإشعارات |
| `SAM_API_KEY` | ✗ يحتاج إدخال | من مزود الدفع |
| `SAM_SHAMCASH_IDENTIFIER` | ✗ يحتاج إدخال | من مزود الدفع |
| `SAM_WEBHOOK_SECRET` | ✗ يحتاج إدخال | من مزود الدفع |

---

## 2. النشر على Render

### الخطوة 1: إنشاء Service جديد

1. اذهب إلى [dashboard.render.com](https://dashboard.render.com)
2. انقر **New +** → **Web Service**
3. اربط حساب GitHub واختر المستودع `ShadStore/ShadStore`
4. أدخل الإعدادات التالية:

| الإعداد | القيمة |
|---------|--------|
| **Name** | `shadstore-api` |
| **Region** | `Frankfurt` أو `Ohio` (الأقرب للمستخدمين) |
| **Branch** | `main` |
| **Root Directory** | `artifacts/api-server` |
| **Runtime** | `Node.js` |
| **Build Command** | `pnpm install && pnpm run build` |
| **Start Command** | `node dist/index.mjs` |
| **Plan** | `Starter` ($7/شهر) |

### الخطوة 2: إضافة متغيرات البيئة

في قسم **Environment** أضف جميع المتغيرات من القسم أعلاه.

**مهم:** تأكد من أن `DATABASE_URL` يبدأ بـ `postgresql://` وليس `postgres://`.

### الخطوة 3: تعيين Health Check

**Health Check Path:** `/api/health`

### الخطوة 4: النشر

انقر **Create Web Service** وانتظر حتى يكتمل البناء.

---

## 3. النشر على Vercel

### أ. متجر العميل (shad-store)

1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. اختر المستودع `ShadStore/ShadStore`
3. إعدادات الاستيراد:

| الإعداد | القيمة |
|---------|--------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `artifacts/shad-store` |
| **Build Command** | `pnpm install && pnpm run build` |
| **Output Directory** | `dist` |

4. في **Environment Variables** أضف:
```
VITE_API_URL=https://shadstore.onrender.com/api
```

5. انقر **Deploy**

### ب. لوحة الإدارة (shad-admin)

نفس الخطوات مع:

| الإعداد | القيمة |
|---------|--------|
| **Root Directory** | `artifacts/shadmin` |
| **Framework Preset** | `Vite` |

---

## 4. إعداد قاعدة البيانات (Supabase)

### الخطوة 1: تهيئة قاعدة البيانات

```bash
# محلياً أو عبر Supabase Dashboard
cd lib/db

# تشغيل جميع الترحيلات
pnpm run push
```

### الخطوة 2: الجداول المطلوبة

يجب أن تتوفر الجداول التالية بعد الترحيل:

| # | اسم الجدول | الوصف |
|---|-----------|-------|
| 1 | `users` | المستخدمين |
| 2 | `admins` | المشرفين |
| 3 | `products` | المنتجات |
| 4 | `categories` | الفئات |
| 5 | `orders` | الطلبات |
| 6 | `deposits` | الإيداعات |
| 7 | `settings` | إعدادات المتجر |
| 8 | `banners` | البانرات |
| 9 | `news` | الأخبار |
| 10 | `coupons` | كوبونات الخصم |
| 11 | `vip_memberships` | عضويات VIP |
| 12 | `auto_codes` | الأكواد التلقائية |
| 13 | `payment_methods` | طرق الدفع |
| 14 | `providers` | مزودي الخدمة |
| 15 | `social_links` | روابط التواصل |
| 16 | `activity_log` | سجل النشاط |
| 17 | `order_messages` | رسائل الطلبات |
| 18 | `api_keys` | مفاتيح API |
| 19 | `notifications` | الإشعارات |
| 20 | `shamcash_used_transaction_refs` | مراجع معاملات ShamCash |

### الخطوة 3: إنشاء أول مدير

```sql
-- تشغيل هذا عبر Supabase Dashboard > SQL Editor
INSERT INTO admins (username, password, full_name, email, role, active)
VALUES ('admin', '$2a$10$rH8zZJX9kL2mN4pQ6sT8vWxYzAbCdEfGhIjKlMnOpQrStUvWxYzA', 'المدير العام', 'admin@shadstore.com', 'super_admin', true);
```

**كلمة المرور المشفرة لـ `admin123`:**
```
$2a$10$rH8zZJX9kL2mN4pQ6sT8vWxYzAbCdEfGhIjKlMnOpQrStUvWxYzA
```

---

## 5. إعداد Telegram - Webhooks

### أ. إنشاء البوتات

1. افتح Telegram وتواصل مع [@BotFather](https://t.me/BotFather)
2. أنشئ بوت المتجر:
   ```
   /newbot
   اسم البوت: ShadStore Bot
   معرف البوت: @ShadStoreBot
   ```
3. أنشئ بوت الإدارة:
   ```
   /newbot
   اسم البوت: ShadStore Admin
   معرف البوت: @ShadStoreAdminBot
   ```
4. احصل على Bot Tokens من BotFather لكل بوت

### ب. الحصول على Chat ID للإشعارات

1. تواصل مع [@chatid_echo_bot](https://t.me/chatid_echo_bot)
2. أرسل أي رسالة
3. سيرد بالـ Chat ID الخاص بك

### ج. تعيين Webhooks

بعد نشر الخادم على Render، استخدم الأوامر التالية:

```bash
# Webhook بوت المتجر
curl -X POST "https://api.telegram.org/bot<TELEGRAM_STORE_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://shadstore.onrender.com/api/telegram/store/webhook",
    "secret_token": "ibDf2xByOIaXP5i1R08v5fBqJ5zqRatPefG"
  }'

# Webhook بوت الإدارة
curl -X POST "https://api.telegram.org/bot<TELEGRAM_ADMIN_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://shadstore.onrender.com/api/telegram/admin/callback",
    "secret_token": "shadstore_admin_webhook_2026_very_secret_123"
  }'

# التحقق من حالة Webhooks
curl -X GET "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

### د. إعداد Mini App

1. في BotFather، أرسل `/mybots` ثم اختر بوت المتجر
2. اختر **Bot Settings** → **Menu Button** → **Configure Menu Button**
3. عين النص: `🛍️ فتح المتجر`
4. عين الرابط: `https://shadstore-zeta.vercel.app`

---

## 6. قائمة المراجعة النهائية قبل التشغيل

### ✅ قاعدة البيانات
- [ ] تم تشغيل جميع الترحيلات (`pnpm run push`)
- [ ] تم إنشاء جدول `admins` مع حساب المدير الأول
- [ ] تم التحقق من وجود جميع الجداول في Supabase Dashboard
- [ ] تم إدخال الإعدادات الأساسية في جدول `settings`

### ✅ الخادم الخلفي (Render)
- [ ] تم النشر بنجاح على Render
- [ ] `/api/health` يرجع استجابة صحيحة
- [ ] متغيرات البيئة مضبوطة بشكل كامل
- [ ] CORS يسمح بنطاقات Vercel

### ✅ الواجهات الأمامية (Vercel)
- [ ] تم نشر `shad-store` على `shadstore-zeta.vercel.app`
- [ ] تم نشر `shad-admin` على `shad-admin-api-server.vercel.app`
- [ ] المتجر يعرض المنتجات بشكل صحيح
- [ ] لوحة الإدارة تصل للخادم

### ✅ Telegram
- [ ] بوت المتجر يستجيب لـ `/start`
- [ ] بوت الإدارة يستجيب للأوامر
- [ ] Webhooks تعمل بشكل صحيح
- [ ] Mini App يفتح من داخل Telegram
- [ ] الإشعارات تصل للمشرفين

### ✅ الأمان
- [ ] تم تغيير `SESSION_SECRET` لقيمة قوية
- [ ] `TELEGRAM_ADMIN_WEBHOOK_STRICT=true` في الإنتاج
- [ ] جميع المسارات الإدارية محمية
- [ ] HTTPS مفعل على جميع النطاقات

---

## 7. خطة المستقبل (بعد الاستقرار)

### المرحلة 2 - VPS

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VPS Server (Future)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │                    Nginx (Reverse Proxy)                  │     │
│  │                    - SSL/HTTPS                            │     │
│  │                    - Load Balancing                       │     │
│  └──────────┬─────────────────────┬──────────────────────────┘     │
│             │                     │                                  │
│  ┌──────────▼──────┐    ┌─────────▼──────────┐                    │
│  │   Laravel API   │    │   Admin Panel (Vite)│                    │
│  │   (Port 8000)   │    │   (Nginx static)    │                    │
│  └─────────────────┘    └────────────────────┘                    │
│                                                                     │
│  ┌────────────────┬────────────────────────────────────────────┐   │
│  │ Queue Worker   │  BullMQ + Redis                            │   │
│  │ (Background)   │  - Order processing                        │   │
│  │                │  - Notifications                           │   │
│  │                │  - Payment verification                     │   │
│  └────────────────┴────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────┬────────────────┬────────────────────────────┐   │
│  │ Telegram Bot 1 │ Telegram Bot 2 │ Cron Jobs                  │   │
│  │ (Store)        │ (Admin)        │ - Order status checks      │   │
│  │ - grammy.js    │ - grammy.js    │ - Deposit expiry           │   │
│  │ - webhook      │ - webhook       │ - Daily reports            │   │
│  └────────────────┴────────────────┴────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Local (pg_dump from Supabase)                   │   │
│  │  + Daily backups to S3/MinIO                                │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### التعديلات المطلوبة عند الانتقال لـ VPS:
1. تحديث `DATABASE_URL` ليشير إلى PostgreSQL المحلي
2. نقل الملفات الثابتة (صور المنتجات) إلى MinIO/S3
3. إضافة Docker Compose للتشغيل المتزامن
4. إعداد PM2 للـ Queue Workers
5. نقل Webhooks لاستخدام `grammy.js` بدلاً من `node-telegram-bot-api`
