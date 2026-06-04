# قائمة Assets المطلوبة — GoatJourney Academy

## 📸 صور مطلوبة للموقع

### 1. صورة المؤسس
| البند | التفاصيل |
|---|---|
| **الملف** | `public/images/founder.jpg` |
| **الأبعاد** | 800 × 1000 px (Portrait 4:5) |
| **الصيغة** | JPG أو WebP |
| **الحجم المستهدف** | < 150 KB |
| **الوصف** | صورة احترافية ليوسف خليل، مؤسس الأكاديمية |
| **الاستخدام** | `/about` + `FounderSection` في الصفحة الرئيسية |
| **alt text** | `يوسف خليل — مؤسس GoatJourney Academy، Q Grader معتمد بخبرة 15+ سنة في صناعة القهوة المختصة` |

---

### 2. صور مصغرة للدورات (Course Thumbnails)
| البند | التفاصيل |
|---|---|
| **الملف** | `public/images/courses/{category}.jpg` |
| **الأبعاد** | 600 × 340 px (16:9) |
| **الصيغة** | WebP (مع JPG fallback) |
| **الحجم المستهدف** | < 80 KB لكل صورة |

**التصنيفات المطلوبة:**

| التصنيف | الملف | الألوان المقترحة |
|---|---|---|
| مشروبات القهوة | `courses/drinks.jpg` | بني دافئ + كريمي |
| طرق التحضير | `courses/homebrew.jpg` | أخضر زيتوني + بني |
| معدات المقهى | `courses/equipment.jpg` | رمادي معدني + ذهبي |
| البن والتحميص | `courses/beans.jpg` | بني غامق + برتقالي محمص |
| مصطلحات القهوة | `courses/terms.jpg` | أزرق داكن + أبيض |
| إنشاء مقهى | `courses/cafe.jpg` | بيج + أخضر داكن |
| دراسة التكاليف | `courses/costing.jpg` | أخضر مالي + أبيض |

---

### 3. خلفية Hero Section
| البند | التفاصيل |
|---|---|
| **الملف** | `public/images/hero-bg.jpg` |
| **الأبعاد** | 1920 × 1080 px (16:9) |
| **الصيغة** | JPG أو WebP |
| **الحجم المستهدف** | < 300 KB |
| **الوصف** | خلفية أكاديمية القهوة — يمكن أن تكون صورة لمقهى أو معدات قهوة بشكل فني |
| **الاستخدام** | `HeroSection` في الصفحة الرئيسية |
| **ملاحظة** | يجب أن تكون داكنة نسبياً لتسمح بقراءة النص الأبيض عليها |

---

### 4. صور Open Graph (OG)
| البند | التفاصيل |
|---|---|
| **الملف** | `public/og-default.jpg` |
| **الأبعاد** | 1200 × 630 px |
| **الصيغة** | JPG |
| **الحجم المستهدف** | < 200 KB |

**الملفات المطلوبة:**

| الملف | الاستخدام |
|---|---|
| `public/og-default.jpg` | OG افتراضية لجميع الصفحات |
| `public/og-courses.jpg` | صفحة الدورات |
| `public/og-blog.jpg` | صفحة المدونة |
| `public/og-tools.jpg` | صفحة الأدوات |
| `public/og-about.jpg` | صفحة من نحن |
| `public/og-consultant.jpg` | صفحة الاستشارة |
| `public/og-services.jpg` | صفحة الخدمات |
| `public/og-drinks.jpg` | OG للدروس — فئة المشروبات |
| `public/og-homebrew.jpg` | OG للدروس — فئة التحضير |
| `public/og-equipment.jpg` | OG للدروس — فئة المعدات |
| `public/og-beans.jpg` | OG للدروس — فئة البن |
| `public/og-terms.jpg` | OG للدروس — فئة المصطلحات |
| `public/og-cafe.jpg` | OG للدروس — فئة إنشاء المقهى |
| `public/og-costing.jpg` | OG للدروس — فئة التكاليف |

**محتوى كل OG image:**
- شعار GoatJourney Academy (أعلى اليمين)
- عنوان الصفحة (وسط الصورة، خط كبير)
- وصف مختصر (تحت العنوان)
- `goatjourney.online` (أسفل اليسار)
- لون خلفية متناسق مع هوية الموقع

---

### 5. صور Testimonial Avatars
| البند | التفاصيل |
|---|---|
| **الملف** | `public/images/testimonials/{name}.jpg` |
| **الأبعاد** | 120 × 120 px (1:1) |
| **الصيغة** | JPG أو WebP |
| **الحجم المستهدف** | < 30 KB لكل صورة |

**الأشخاص:**
- `testimonials/ahmad.jpg` — أحمد س. (مقهى البن العربي)
- `testimonials/sara.jpg` — سارة خ. (لافا كافيه)
- `testimonials/mohammad.jpg` — محمد ع. (روست)

**ملاحظة:** يمكن استخدام avatars placeholder حالياً (أحرف أولية ملونة) إلى حين توفر الصور الحقيقية.

---

### 6. أيقونات Social Media SVG
| البند | التفاصيل |
|---|---|
| **الملف** | `public/icons/{platform}.svg` |
| **الأبعاد** | 24 × 24 px |

**المنصات:**
- `icons/whatsapp.svg`
- `icons/facebook.svg`
- `icons/twitter.svg`
- `icons/linkedin.svg`
- `icons/telegram.svg`
- `icons/instagram.svg`
- `icons/youtube.svg`
- `icons/tiktok.svg`

**ملاحظة:** حالياً نستخدم أيقونات SVG inline في الكود. يمكن الاستمرار بذلك أو الانتقال لملفات منفصلة لاحقاً.

---

## 🎨 ملفات تصميم مقترحة

### Canva/Figma Templates
إنشاء template واحد لـ OG images ثم تغيير النص فقط:
1. خلفية بلون دافئ (بني/بيج)
2. شعار GoatJourney Academy
3. عنوان الصفحة (متغير)
4. وصف فرعي (متغير)
5. Domain name

### أدوات مفيدة
- **Canva** — سهل وسريع للـ OG images
- **Figma** — احترافي أكثر، template-based
- **Squoosh** (squoosh.app) — ضغط الصور إلى WebP
- **TinyPNG** — ضغط PNG/JPG

---

## ✅ Checklist

- [ ] `public/images/founder.jpg`
- [ ] `public/images/courses/drinks.jpg`
- [ ] `public/images/courses/homebrew.jpg`
- [ ] `public/images/courses/equipment.jpg`
- [ ] `public/images/courses/beans.jpg`
- [ ] `public/images/courses/terms.jpg`
- [ ] `public/images/courses/cafe.jpg`
- [ ] `public/images/courses/costing.jpg`
- [ ] `public/images/hero-bg.jpg`
- [ ] `public/og-default.jpg`
- [ ] `public/og-courses.jpg`
- [ ] `public/og-blog.jpg`
- [ ] `public/og-tools.jpg`
- [ ] `public/og-about.jpg`
- [ ] `public/og-consultant.jpg`
- [ ] `public/og-services.jpg`
- [ ] `public/og-{category}.jpg` (7 صور)
- [ ] `public/images/testimonials/*.jpg` (3 صور)
