# دليل النشر — Deployment Guide

## 1. رفع الكود على GitHub

### إنشاء Personal Access Token (PAT)
1. ادخل على [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. اضغط **Generate new token (classic)**
3. اختر صلاحية `repo` (full control of private repositories)
4. انسخ التوكن

### دفع الكود
```bash
cd app
git remote add origin https://github.com/hellostaffsps-max/goat-academy.git
git branch -M main
```

عند تنفيذ `git push`، استخدم:
- **Username:** `hellostaffsps-max`
- **Password:** التوكن اللي نسخته (مش كلمة سر GitHub)

```bash
git push -u origin main
```

---

## 2. نشر على Vercel

### الطريقة السريعة (من GitHub)
1. ادخل على [vercel.com](https://vercel.com) وسجل دخول بحسابك
2. اضغط **Add New Project**
3. اختار مستودع `goat-academy` من GitHub
4. في إعدادات البيئة (Environment Variables)، أضف:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://brasoittyeiubayuupxw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

> **ملاحظة:** انسخ القيم بالضبط من ملف `.env.local` الموجود على جهازك.

5. اضغط **Deploy**

### إذا واجهت مشاكل في البناء
- تأكد من أن `package.json` يحتوي على `npm run build` في scripts
- Vercel يدعم Next.js 16 بشكل أصلي، لا تحتاج إعدادات إضافية

---

## 3. ربط الدومين المخصص

### في Vercel
1. اذهب لإعدادات المشروع → **Domains**
2. أضف: `goatjourney.online`
3. Vercel سيعطيك سجلات DNS مطلوبة

### في مسجل الدومين (Domain Registrar)
أضف واحد من الخيارين التاليين:

**الخيار أ: CNAME Record**
| Type | Name | Value |
|------|------|-------|
| CNAME | `@` | `cname.vercel-dns.com` |

**الخيار ب: A Record**
| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |

> انتظر 5–30 دقيقة حتى ينتشر DNS.

---

## 4. إصلاحات ضرورية قبل/بعد النشر

### ⚠️ إصلاح RLS في Supabase
في لوحة تحكم Supabase → **SQL Editor** → **New query** → انسخ محتوى `fix-profiles-rls.sql` → اضغط **Run**

### ⚠️ تحديث Middleware (اختياري)
Next.js 16 يحذر من ملف `middleware.ts`. إذا أردت إزالة التحذير:
1. غيّر اسم `src/middleware.ts` → `src/middleware.js`
2. أو استخدم [Proxy API Routes](https://nextjs.org/docs/messages/middleware-to-proxy)

### ⚠️ استعادة فحص Admin بالـ Role
بعد إصلاح RLS، عدّل `src/app/admin/layout.tsx`:
استبدل `session.user.email === "admin@goatjourney.com"` بفحص الـ `role` من جدول `profiles`.

---

## 5. التحقق من النشر

1. افتح `https://goatjourney.online` (أو الدومين المخصص)
2. تأكد من ظهور الموقع بشكل صحيح
3. جرب تسجيل الدخول: `/auth/login`
   - البريد: `admin@goatjourney.com`
   - كلمة المرور: `admin123`
4. تأكد من دخول لوحة التحكم: `/admin`
