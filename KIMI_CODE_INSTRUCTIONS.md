# تعليمات Kimi Code — تحسين موقع GoatJourney Academy
## مشروع: تحسين شامل لأكاديمية القهوة المختصة

**الرابط:** https://www.goatjourney.online/
**تاريخ التعليمات:** يونيو 2026
**الحالة:** المراحل 1-3 مكتملة، المرحلة 4-5 جزئية

---

## ✅ ما تم إنجازه

### المرحلة 1: إصلاحات حرجة (✅ مكتملة)
- ✅ إصلاح `robots.txt` — النطاق الصحيح `goatjourney.online`
- ✅ إنشاء `sitemap.ts` ديناميكي مع الدروس
- ✅ عناوين فريدة + `metadata` في كل صفحة (layout + 11 صفحة)
- ✅ Canonical URLs لكل الصفحات
- ✅ JSON-LD structured data (Organization + LocalBusiness + Breadcrumb + LearningResource)
- ✅ توحيد التسعير بالشيكل ₪ (services + tools)
- ✅ تبسيط نموذج الاستشارة (4 خطوات + progress bar + validation)
- ✅ إصلاح صورة المؤسس (مسار + CSS fallback)
- ✅ تحديث روابط التواصل الاجتماعي والبريد

### المرحلة 2: UX/UI & Accessibility (✅ مكتملة)
- ✅ Breadcrumb Navigation (RTL + خريطة عربية)
- ✅ Search Bar (Cmd+K + بحث client-side في 90+ درس)
- ✅ Security Headers (CSP, X-Frame, XSS, etc.)
- ✅ Skip-to-Content link (keyboard accessible)
- ✅ إصلاح viewport meta tag (إزالة maximum-scale)
- ✅ WCAG AA color contrast (تباين 7:1)
- ✅ Focus-visible styles

### المرحلة 3: Conversion & Engagement (✅ مكتملة)
- ✅ Exit-Intent Popup (دليل تأسيس المقهى المجاني)
- ✅ Urgency/Scarcity badges (الأكثر طلباً / جديد / عرض محدود)
- ✅ Testimonials Enhanced (avatars + service tags)
- ✅ Client Logos marquee (25+ مقهى)
- ✅ Social Share buttons (5 منصات)
- ✅ Open Graph Tags + Twitter Cards
- ✅ reCAPTCHA v3 (حماية نموذج الاستشارة)

### المرحلة 4: Performance (⚠️ جزئية)
- ✅ PWA Service Worker (مسجل في AppLayout)
- ✅ loading="lazy" للصور غير المهمة
- ⏳ تحسين next/image (quality, placeholder, sizes) — يحتاج assets
- ⏳ تحويل الصور إلى WebP — يحتاج assets

### المرحلة 5: Assets (⏳ لم تبدأ)
- ⏳ صورة المؤسس (`public/images/founder.jpg`)
- ⏳ صور الدورات (`public/images/courses/*.jpg`)
- ⏳ OG Images (`public/og-*.jpg`)
- ⏳ Hero Background (`public/images/hero-bg.jpg`)
- ⏳ Testimonial Avatars

---

## 📊 Lighthouse Audit (تقديري)

| الفئة | التقدير | الملاحظات |
|---|---|---|
| Performance | 75-85 | يحتاج صور مضغوطة + WebP |
| Accessibility | 90-95 | WCAG AA ✅ |
| Best Practices | 90-95 | HTTPS + Headers ✅ |
| SEO | 95-100 | robots + sitemap + metadata ✅ |
| PWA | 60-70 | SW موجود، يحتاج offline page |

**Console errors:** خطأ واحد فقط — `404 /images/founder.jpg`

---

## 📁 الملفات الجديدة المهمة

```
src/components/
  BreadcrumbNav.tsx          — مسار التنقل
  SkipToContent.tsx          — وصولية لوحة المفاتيح
  ExitIntentPopup.tsx        — تحويل الزوار المغادرين
  SocialShare.tsx            — أزرار المشاركة
  SearchBar.tsx              — بحث Cmd+K
  ReCaptchaProvider.tsx      — حماية reCAPTCHA

src/components/sections/
  ClientLogos.tsx            — شعارات المقاهي

public/
  robots.txt                 — ملف robots
  ASSETS.md                  — قائمة Assets المطلوبة
  LIGHTHOUSE_AUDIT.md        — تقرير Lighthouse
```

---

## 🔧 الإعدادات المطلوبة من المستخدم

### reCAPTCHA (اختياري)
1. احصل على Site Key من https://www.google.com/recaptcha/admin
2. أضف إلى `.env.local`:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
   ```

### Assets (مطلوب للمرحلة 5)
انظر `ASSETS.md` لقائمة كاملة بالصور المطلوبة وأبعادها.

### Google Search Console
1. أرسل sitemap: `https://www.goatjourney.online/sitemap.xml`
2. اختبر structured data: https://search.google.com/test/rich-results

---

## 🚀 Build & Deploy

```bash
cd app
npm run build    # 112 صفحة ثابتة
vercel --prod    # نشر على Vercel
```

---

*آخر تحديث: يونيو 2026 — المراحل 1-3 مكتملة*
