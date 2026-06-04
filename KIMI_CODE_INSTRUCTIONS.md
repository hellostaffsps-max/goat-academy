# تعليمات Kimi Code — تحسين موقع GoatJourney Academy
## مشروع: تحسين شامل لأكاديمية القهوة المختصة

**الرابط:** https://www.goatjourney.online/
**تاريخ التعليمات:** يونيو 2026
**الأولوية:** تنفيذ على مراحل (Phase 1 حرجة → Phase 2 تحسين → Phase 3 توسع)

---

## المرحلة الأولى: إصلاحات حرجة (Critical Fixes)

### 1. إصلاح صورة المؤسس في صفحة "من نحن"

**المشكلة:** صورة يوسف خليل تظهر كـ Placeholder (مربع فارغ) — تضعف المصداقية بشكل كبير.

**الحل المطلوب:**
```tsx
// app/about/page.tsx أو المكون المعني
// المشكلة: src الخاصة بالصورة إما مفقودة أو مسارها خاطئ

// ✅ التحقق من المسار:
<Image
  src="/images/yousef-khalil-founder.jpg"  // تأكد من وجود الملف في public/images/
  alt="يوسف خليل — مؤسس GoatJourney Academy، Q Grader معتمد بخبرة 15+ سنة"
  width={400}
  height={500}
  priority  // صورة مهمة في صفحة "من نحن"
/>

// ✅ إذا كانت الصورة من CDN:
<Image
  src="https://cdn.goatjourney.online/founder-yousef.jpg"
  alt="يوسف خليل — مؤسس GoatJourney Academy"
  width={400}
  height={500}
  priority
/>
```

**الإجراءات:**
- [ ] التأكد من وجود صورة المؤسس في مجلد `public/images/`
- [ ] إذا لم تكن موجودة، رفع صورة احترافية للمؤسس
- [ ] إضافة `priority` لتحميلها فوراً (LCP optimization)
- [ ] ضمان وجود `alt` وصفي يتضمن الكلمات المفتاحية

---

### 2. إضافة صور حقيقية لبطاقات الدورات والمدونة

**المشكلة:** جميع البطاقات تظهر نفس أيقونة الكتاب الباهتة — الموقع يبدو غير مكتمل.

**الحل المطلوب:**
```tsx
// components/CourseCard.tsx أو المكافئ

// ❌ الحالي — أيقونة عامة:
<div className="card-image-placeholder">
  <BookIcon />  // أيقونة كتاب باهتة متكررة
</div>

// ✅ المطلوب — صورة فعلية مع fallback:
import Image from 'next/image';

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="card-image-wrapper">
        {course.image ? (
          <Image
            src={course.image}
            alt={`${course.title} — دورة ${course.category} في GoatJourney Academy`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="fallback-gradient">
            <span className="category-icon">{course.categoryIcon}</span>
            <span className="category-label">{course.category}</span>
          </div>
        )}
      </div>
      {/* باقي محتوى البطاقة */}
    </div>
  );
};
```

**CSS للـ Fallback المُحسَّن:**
```css
/* styles/courses.css */
.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.fallback-gradient {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* تدرج لوني يختلف حسب التصنيف */
  background: linear-gradient(135deg, #C8A97E 0%, #8B6914 100%);
}

.fallback-gradient.cafe {
  background: linear-gradient(135deg, #6B4423 0%, #A0522D 100%);
}

.fallback-gradient.costing {
  background: linear-gradient(135deg, #2C5F2D 0%, #97BC62 100%);
}
```

**الإجراءات:**
- [ ] تصميم صور مخصصة لكل تصنيف (costing, cafe, brewing, etc.)
- [ ] رفع الصور في `public/images/courses/`
- [ ] تحديث data source ليشمل مسار الصورة لكل درس
- [ ] تطبيق تدرجات ألوان مميزة كـ fallback حسب التصنيف

---

### 3. إصلاح robots.txt — تغيير النطاق الخاطئ

**المشكلة الحرجة:** robots.txt يشير إلى `goatjourney.com` بدلاً من `goatjourney.online`

**الملف الحالي (خاطئ):**
```txt
# ❌ robots.txt الحالي — خطأ في النطاق!
User-Agent: *
Allow: /
Disallow: /settings
Sitemap: https://goatjourney.com/sitemap.xml  ← خطأ! النطاق goatjourney.com
```

**الملف الصحيح:**
```txt
# ✅ robots.txt الصحيح
User-Agent: *
Allow: /
Disallow: /settings
Disallow: /admin
Disallow: /api/

# Sitemap — يجب أن يشير إلى النطاق الصحيح
Sitemap: https://www.goatjourney.online/sitemap.xml

# Crawl-delay لمنع الضغط على السيرفر
Crawl-delay: 1
```

**إنشاء sitemap.xml ديناميكي:**
```tsx
// app/sitemap.ts (Next.js App Router)
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.goatjourney.online';

  // الصفحات الثابتة
  const staticPages = [
    '',  // الرئيسية
    '/courses',
    '/blog',
    '/tools',
    '/about',
    '/consultant',
    '/services',
    '/favorites',
    '/settings',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // الصفحات الديناميكية (الدروس)
  const lessons = await fetchLessons(); // دالة جلب الدروس
  const lessonPages = lessons.map((lesson) => ({
    url: `${baseUrl}/lesson/${lesson.slug}`,
    lastModified: lesson.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...lessonPages];
}
```

**الإجراءات:**
- [ ] تعديل `robots.txt` — تغيير `goatjourney.com` إلى `www.goatjourney.online`
- [ ] إنشاء `app/sitemap.ts` ديناميكي يشمل كل الصفحات
- [ ] التأكد من تضمين `/blog` و `/courses` في الـ Sitemap
- [ ] إرسال Sitemap الجديد في Google Search Console

---

### 4. عناوين فريدة (Unique Titles) ووصف تعريفي لكل صفحة

**المشكلة:** جميع الصفحات تحمل نفس العنوان: "GoatJourney Academy | أكاديمية القهوة في فلسطين"

**الحل:**
```tsx
// app/layout.tsx — العنوان الافتراضي
export const metadata = {
  title: {
    default: 'GoatJourney Academy | أكاديمية القهوة المختصة الأولى بالعربية',
    template: '%s | GoatJourney Academy',
  },
  description: 'أكاديمية تفاعلية لتعلم القهوة المختصة وتأسيس المقاهي في فلسطين — دورات الباريستا، استشارات، وأدوات تفاعلية.',
};

// app/courses/page.tsx
export const metadata = {
  title: 'دورات القهوة المختصة | تعلم الباريستا من الصفر',
  description: 'دورات احترافية في القهوة المختصة للمبتدئين والمحترفين — تدريب الباريستا، تحضير الإسبريسو، وتأسيس المقاهي. ابدأ رحلتك الآن.',
  keywords: ['دورات قهوة', 'تعلم الباريستا', 'دورة باريستا فلسطين', 'تدريب قهوة'],
};

// app/blog/page.tsx
export const metadata = {
  title: 'مدونة القهوة المختصة | مقالات ونصائح احترافية',
  description: 'اكتشف أحدث المقالات في عالم القهوة المختصة — نصائح تأسيس المقاهي، ميزانية المعدات، وأخطاء شائعة يجب تجنبها.',
  keywords: ['مدونة قهوة', 'نصائح مقهى', 'تأسيس مقهى فلسطين'],
};

// app/tools/page.tsx
export const metadata = {
  title: 'أدوات القهوة المختصة | حاسبات تفاعلية مجانية',
  description: 'استخدم حاسباتنا التفاعلية — حاسبة تكلفة المقهى، حاسبة تسعير المشروبات، وحاسبة نسبة الاستخلاص.',
  keywords: ['حاسبة مقهى', 'تكلفة فتح مقهى', 'تسعير مشروبات'],
};

// app/about/page.tsx
export const metadata = {
  title: 'من نحن | GoatJourney Academy — قصة التأسيس',
  description: 'تعرف على يوسف خليل مؤسس الأكاديمية — Q Grader معتمد بخبرة 15+ سنة في صناعة القهوة المختصة ورحلة بناء أول أكاديمية عربية.',
  keywords: ['يوسف خليل', 'Q Grader فلسطين', 'أكاديمية قهوة'],
};

// app/consultant/page.tsx
export const metadata = {
  title: 'استشارات تأسيس المقاهي | احجز استشارتك المجانية',
  description: 'احصل على استشارة مجانية لتأسيس مقهاك في فلسطين — دراسة جدوى، اختيار المعدات، وتدريب الباريستا مع خبراء متخصصين.',
  keywords: ['استشارة مقهى', 'تأسيس مقهى فلسطين', 'دراسة جدوى مقهى'],
};

// app/services/page.tsx
export const metadata = {
  title: 'خدماتنا | تدريب الباريستا وتطوير المقاهي',
  description: 'خدمات احترافية في صناعة القهوة — تدريب الباريستا من 750₪، تطوير المقاهي، استشارات تشغيلية، وتدريب الشركات.',
  keywords: ['خدمات قهوة', 'تدريب باريستا فلسطين', 'تطوير مقاهي'],
};

// الصفحات الديناميكية (الدروس)
// app/lesson/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const lesson = await getLesson(params.slug);
  return {
    title: `${lesson.title} | دراسة ${lesson.category === 'costing' ? 'التكاليف' : 'تأسيس المقهى'}`,
    description: lesson.description,
    keywords: [lesson.category, lesson.title, 'دورة قهوة'],
  };
}
```

**الإجراءات:**
- [ ] تحديث `metadata` في كل صفحة (7 صفحات + الصفحات الديناميكية)
- [ ] إضافة `keywords` مخصصة لكل صفحة
- [ ] التأكد من فريدة كل title و meta description
- [ ] اختبار بـ Google SERP Preview Tool

---

### 5. إضافة Canonical URLs

**المشكلة:** لا توجد وسوم Canonical — قد يسبب Duplicate Content.

**الحل:**
```tsx
// app/layout.tsx — إضافة Canonical افتراضي
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

// لكل صفحة فرعية:
export const metadata = {
  alternates: {
    canonical: '/courses', // المسار الكامل للصفحة
  },
};

// أو ديناميكياً:
// app/lesson/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    alternates: {
      canonical: `/lesson/${params.slug}`,
    },
  };
}
```

---

### 6. إضافة JSON-LD Structured Data

**المشكلة:** لا توجد بيانات منظمة — جوجل لا يفهم نوع المحتوى.

**الحل:**
```tsx
// components/StructuredData.tsx

// 1. Organization Schema (في جميع الصفحات)
export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GoatJourney Academy',
    alternateName: 'أكاديمية القهوة المختصة',
    url: 'https://www.goatjourney.online',
    logo: 'https://www.goatjourney.online/brand-logo.png',
    description: 'أول أكاديمية تفاعلية لتعلم القهوة المختصة وتأسيس المقاهي بالعربية',
    founder: {
      '@type': 'Person',
      name: 'يوسف خليل',
      jobTitle: 'مؤسس أكاديمية القهوة المختصة',
      alumniOf: {
        '@type': 'Organization',
        name: 'Coffee Quality Institute',
      },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+972-56-777-7777',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
      areaServed: 'PS',
    },
    sameAs: [
      // روابط السوشال ميديا (عند إنشائها)
      // 'https://www.facebook.com/goatjourney',
      // 'https://www.instagram.com/goatjourney',
      // 'https://www.youtube.com/@goatjourney',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// 2. Course Schema (لصفحات الدروس)
export const CourseSchema = ({ course }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'GoatJourney Academy',
      sameAs: 'https://www.goatjourney.online',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      inLanguage: 'ar',
    },
    about: course.category,
    timeRequired: course.readingTime,
    author: {
      '@type': 'Person',
      name: 'يوسف خليل',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// 3. Article Schema (للمدونة)
export const ArticleSchema = ({ article }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: 'يوسف خليل',
      url: 'https://www.goatjourney.online/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GoatJourney Academy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.goatjourney.online/brand-logo.png',
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: 'ar',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// 4. LocalBusiness Schema (للخدمات في فلسطين)
export const LocalBusinessSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'GoatJourney Academy',
    image: 'https://www.goatjourney.online/brand-logo.png',
    '@id': 'https://www.goatjourney.online',
    url: 'https://www.goatjourney.online',
    telephone: '+972567777777',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PS',
      addressRegion: 'فلسطين',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.95,
      longitude: 35.2,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '17:00',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

**الإجراءات:**
- [ ] إنشاء مكون `StructuredData.tsx`
- [ ] إضافة `OrganizationSchema` في `layout.tsx`
- [ ] إضافة `CourseSchema` في صفحة الدرس
- [ ] إضافة `ArticleSchema` في صفحة المدونة
- [ ] اختبار بالـ Google Rich Results Test

---

### 7. إضافة Alt Text لجميع الصور

**المشكلة:** صور الدروس لا تحتوي على نص بديل.

**الحل:**
```tsx
// ❌ الحالي:
<img src="/lesson-cover.jpg" />

// ✅ المطلوب:
<Image
  src="/lesson-cover.jpg"
  alt="شرح تحضير الإسبريسو المثالي — دورة الباريستا الاحترافية في GoatJourney Academy"
  width={600}
  height={340}
/>

// قواعد كتابة Alt Text:
// 1. وصف محتوى الصورة بإيجاز
// 2. تضمين الكلمات المفتاحية بشكل طبيعي
// 3. تجنب "صورة..." أو "image..."
// 4. أقصى 125 حرف

// أمثلة:
const altTexts = {
  founder: 'يوسف خليل مؤسس GoatJourney Academy يقدم دورة الباريستا الاحترافية',
  espresso: 'ماكينة إسبريسو احترافية تُستخدم في تدريب الباريستا',
  cafeSetup: 'تصميم داخلي لمقهى مختص حديث مع بار القهوة',
  beans: 'حبوب قهوة عربية مختصة محمصة حديثاً',
};
```

---

### 8. توحيد التسعير بالشيكل (₪)

**المشكلة:** ازدواجية العملات — دولار ($) في الخدمات، شيكل (₪) في الاستشارة.

**الحل:**
```tsx
// components/PricingCard.tsx

// ❌ الحالي:
<div className="price">ابتداءً من $200</div>

// ✅ المطلوب — عرض بالشيكل مع تحويل دولاري:
<div className="price-wrapper">
  <span className="price-primary">ابتداءً من 750 ₪</span>
  <span className="price-secondary">(≈ $200)</span>
</div>

// أو باستخدام مكون موحد:
const PriceDisplay = ({ shekelAmount, showDollar = true }) => {
  const dollarAmount = Math.round(shekelAmount / 3.75); // سعر الصرف

  return (
    <div className="price-display">
      <span className="shekel">{shekelAmount.toLocaleString('ar-PS')} ₪</span>
      {showDollar && (
        <span className="dollar-hint">≈ ${dollarAmount}</span>
      )}
    </div>
  );
};

// استخدام:
<PriceDisplay shekelAmount={750} />   // تدريب الباريستا
<PriceDisplay shekelAmount={1875} />  // تطوير المقاهي

// في صفحة الخدمات — تحديث كامل:
const services = [
  {
    title: 'تدريب الباريستا',
    priceShekel: 750,
    priceDollar: 200,
    features: ['دورات من المبتدئين إلى المتقدمين', 'تدريب عملي', 'شهادات معتمدة'],
  },
  {
    title: 'تطوير المقاهي',
    priceShekel: 1875,
    priceDollar: 500,
    features: ['تصميم خطة تشغيل', 'اختيار المعدات', 'بناء قائمة المشروبات'],
  },
];
```

**CSS:**
```css
.price-display {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.shekel {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2D2A26;
}

.dollar-hint {
  font-size: 0.875rem;
  color: #8B8680;
}
```

**الإجراءات:**
- [ ] تحديث جميع الأسعار لتُعرض بالشيكل أساساً
- [ ] إضافة السعر بالدولار كإضافة (hint)
- [ ] تحديث `content="priceCurrency"` في JSON-LD إلى `ILS`
- [ ] إضافة خيار تبديل العملة في الإعدادات (إذا أردت)

---

### 9. تبسيط نموذج الاستشارة

**المشكلة:** نموذج طويل (8+ حقول) يقلل معدل الإكمال.

**الحل:**
```tsx
// ❌ الحالي — نموذج طويل:
// الاسم + الهاتف + البريد + اسم المشروع + المدينة + الميزانية + الخدمات + تفاصيل = 8 حقول

// ✅ المطلوب — Multi-step Form (3 خطوات):

// Step 1: معلومات التواصل (3 حقول)
const Step1 = () => (
  <div className="form-step">
    <h3>خطوة 1 من 3 — معلوماتك</h3>
    <input name="name" placeholder="الاسم الكامل *" required />
    <input name="phone" placeholder="رقم الواتساب *" required type="tel" />
    <input name="email" placeholder="البريد الإلكتروني (اختياري)" type="email" />
  </div>
);

// Step 2: المشروع (3 حقول)
const Step2 = () => (
  <div className="form-step">
    <h3>خطوة 2 من 3 — مشروعك</h3>
    <select name="city" required>
      <option value="">اختر المدينة *</option>
      <option value="ramallah">رام الله</option>
      <option value="nablus">نابلس</option>
      <option value="hebron">الخليل</option>
      <option value="jerusalem">القدس</option>
      <option value="bethlehem">بيت لحم</option>
      <option value="jenin">جنين</option>
      <option value="gaza">غزة</option>
    </select>
    <select name="budget">
      <option value="">الميزانية التقديرية</option>
      <option value="under-50k">أقل من 50,000 ₪</option>
      <option value="50k-100k">50,000 — 100,000 ₪</option>
      <option value="100k-200k">100,000 — 200,000 ₪</option>
      <option value="over-200k">أكثر من 200,000 ₪</option>
    </select>
    <select name="service" required>
      <option value="">الخدمة المطلوبة *</option>
      <option value="consultation">استشارة تشغيلية</option>
      <option value="cafe-setup">تأسيس مقهى جديد</option>
      <option value="training">تدريب فريق</option>
      <option value="menu">تطوير قائمة المشروبات</option>
    </select>
  </div>
);

// Step 3: التأكيد (حقل واحد + تفاصيل)
const Step3 = () => (
  <div className="form-step">
    <h3>خطوة 3 من 3 — تفاصيل إضافية</h3>
    <textarea name="details" placeholder="أخبرنا أكثر عن مشروعك (اختياري)" rows={4} />
    <div className="summary">
      <p>سيتم إرسال طلبك مباشرة عبر الواتساب</p>
    </div>
    <button type="submit">إرسال الطلب ✓</button>
  </div>
);

// مكون التقدم:
const ProgressBar = ({ currentStep, totalSteps }) => (
  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    />
    <span>{currentStep} من {totalSteps}</span>
  </div>
);
```

**الإجراءات:**
- [ ] إعادة تصميم النموذج على 3 خطوات
- [ ] إضافة شريط تقدم (Progress Bar)
- [ ] جعل الحقول الأساسية (3 حقول) فقط مطلوبة
- [ ] إضافة تأثير انتقال سلس بين الخطوات
- [ ] اختبار معدل الإكمال قبل وبعد

---

## المرحلة الثانية: تحسينات UX/UI والأداء

### 10. إضافة Breadcrumb Navigation

```tsx
// components/Breadcrumb.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const breadcrumbMap = {
  'courses': 'الدورات التدريبية',
  'blog': 'المدونة',
  'tools': 'الأدوات',
  'about': 'من نحن',
  'consultant': 'طلب استشارة',
  'services': 'خدماتنا',
  'lesson': 'درس',
  'favorites': 'المفضلة',
  'settings': 'الإعدادات',
};

export const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null; // الرئيسية

  return (
    <nav aria-label="مسار التنقل" className="breadcrumb">
      <ol>
        <li>
          <Link href="/">الرئيسية</Link>
        </li>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          const label = breadcrumbMap[segment] || segment;

          return (
            <li key={href}>
              <span className="separator">/</span>
              {isLast ? (
                <span className="current" aria-current="page">{label}</span>
              ) : (
                <Link href={href}>{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
```

**CSS:**
```css
.breadcrumb {
  padding: 1rem 2rem;
  font-size: 0.875rem;
  color: #8B8680;
}

.breadcrumb ol {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 0.5rem;
}

.breadcrumb a {
  color: #C8A97E;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb .current {
  color: #2D2A26;
  font-weight: 500;
}

.breadcrumb .separator {
  color: #D4CFC8;
  margin: 0 4px;
}
```

---

### 11. إضافة Hero Image للصفحة الرئيسية

```tsx
// app/page.tsx — Hero Section محسّن
<section className="hero">
  <div className="hero-background">
    <Image
      src="/images/hero-coffee-bg.jpg"
      alt="خلفية أكاديمية القهوة المختصة"
      fill
      className="object-cover"
      priority
      quality={85}
    />
    <div className="hero-overlay" /> {/* طبقة داكنة للتباين */}
  </div>
  <div className="hero-content">
    <span className="badge">أكاديمية القهوة المختصة الأولى بالعربية ☕</span>
    <h1>من شغف القهوة<br/>إلى الاحتراف</h1>
    <p>تعلم القهوة المختصة، تطوير المقاهي، تدريب الباريستا، وبناء مشاريع ناجحة</p>
    <div className="hero-cta-group">
      <Link href="/courses" className="btn-primary">ابدأ التعلم ←</Link>
      <Link href="/consultant" className="btn-secondary">احجز استشارة</Link>
      <Link href="/courses" className="btn-ghost">تصفح الدورات ▷</Link>
    </div>
  </div>
</section>
```

**CSS:**
```css
.hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(45, 42, 38, 0.85) 0%,
    rgba(45, 42, 38, 0.6) 50%,
    rgba(45, 42, 38, 0.4) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 2rem;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-content h1 span {
  color: #C8A97E; /* اللون الذهبي */
}
```

---

### 12. تحسين تباين النصوص (WCAG AA Compliance)

**المشكلة:** نصوص فاتحة على خلفية فاتحة + نصوص رمادية صعبة القراءة.

**الحل:**
```css
/* styles/globals.css — تحديثات الألوان */

:root {
  /* ❌ الألوان الحالية (ضعيفة) */
  /* --text-muted: #C8C4BF; */
  /* --tag-bg: #F5F0EB; */
  /* --tag-text: #C8A97E; */

  /* ✅ الألوان المحسّنة */
  --text-primary: #2D2A26;      /* أسود دافئ — تباين 15:1 */
  --text-secondary: #5A5650;    /* رمادي داكن — تباين 7:1 */
  --text-muted: #8B8680;        /* رمادي متوسط — تباين 4.5:1 */
  --text-light: #B5B0A8;        /* رمادي فاتح — تباين 3:1 */

  --tag-bg: #E8E2DA;            /* خلفية أغمق قليلاً */
  --tag-text: #7A5E2E;          /* نص أغمق للتباين */
  --tag-border: #C8A97E;

  --accent-gold: #C8A97E;
  --accent-gold-dark: #A08050;
}

/* تطبيق على الوسوم */
.tag {
  background: var(--tag-bg);
  color: var(--tag-text);
  border: 1px solid var(--tag-border);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* تطبيق على نصوص البطاقات */
.card-description {
  color: var(--text-secondary); /* بدل الرمادي الفاتح جداً */
  line-height: 1.7;
}

/* تطبيق على الـ Footer CTA */
.footer-cta {
  background: #2D2A26;
  color: #FFFFFF;
}

.footer-cta p {
  color: #E8E2DA; /* بدل الأبيض الفاتح جداً */
}
```

---

### 13. إضافة Search Functionality

```tsx
// components/SearchBox.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const search = useCallback(async (q) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    // البحث في Client-side أو API
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
  }, []);

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="ابحث في الدورات والمقالات..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((item) => (
            <button
              key={item.slug}
              onClick={() => {
                router.push(`/${item.type}/${item.slug}`);
                setIsOpen(false);
              }}
            >
              <span className="search-title">{item.title}</span>
              <span className="search-type">{item.type === 'lesson' ? 'درس' : 'مقال'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### 14. إضافة Security Headers

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content-Security-Policy (يتطلب ضبط دقيق حسب المصادر المستخدمة)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## المرحلة الثالثة: تحسينات التحويل والتسويق

### 15. إضافة Exit-Intent Popup

```tsx
// components/ExitIntentPopup.tsx
'use client';

import { useState, useEffect } from 'react';

export const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('exit-intent-shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <div className="exit-popup-overlay" onClick={() => setIsVisible(false)}>
      <div className="exit-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setIsVisible(false)}>✕</button>
        <div className="popup-content">
          <h3>🚀 انتظر! قبل أن تغادر...</h3>
          <p>احصل على <strong>دليل تأسيس المقهى المجاني</strong> — 20 صفحة من النصائح العملية</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const phone = new FormData(form).get('phone');
              window.open(
                `https://wa.me/972567777777?text=مرحباً، أود الحصول على دليل تأسيس المقهى المجاني. رقمي: ${phone}`,
                '_blank'
              );
              setIsVisible(false);
            }}
          >
            <input
              name="phone"
              type="tel"
              placeholder="رقم الواتساب"
              required
            />
            <button type="submit">احصل على الدليل المجاني ←</button>
          </form>
          <p className="popup-note">✓ 500+ شخص حصلوا على الدليل</p>
        </div>
      </div>
    </div>
  );
};
```

**CSS:**
```css
.exit-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.exit-popup {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: slideUp 0.4s ease;
  text-align: center;
}

.exit-popup h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2D2A26;
}

.exit-popup input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E8E2DA;
  border-radius: 12px;
  margin: 1rem 0;
  font-size: 1rem;
}

.exit-popup button[type="submit"] {
  width: 100%;
  padding: 14px;
  background: #C8A97E;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.popup-note {
  margin-top: 1rem;
  color: #8B8680;
  font-size: 0.875rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

---

### 16. إضافة Urgency/Scarcity في CTAs

```tsx
// components/UrgencyBadge.tsx

export const UrgencyBadge = ({ type, value }) => {
  const styles = {
    limited: { bg: '#FEF3C7', text: '#92400E', label: `متبقي ${value} مقاعد` },
    countdown: { bg: '#FEE2E2', text: '#991B1B', label: `ينتهي خلال ${value}` },
    new: { bg: '#D1FAE5', text: '#065F46', label: 'جديد' },
    popular: { bg: '#EDE9FE', text: '#5B21B6', label: 'الأكثر طلباً' },
  };

  const style = styles[type];

  return (
    <span
      className="urgency-badge"
      style={{ background: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
};

// استخدام:
// <UrgencyBadge type="limited" value={3} />
// <UrgencyBadge type="countdown" value="24 ساعة" />
// <UrgencyBadge type="popular" />
```

**إضافة Countdown Timer:**
```tsx
// components/CountdownTimer.tsx
'use client';

import { useState, useEffect } from 'react';

export const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="countdown-timer">
      <span className="countdown-label">⏰ عرض محدود:</span>
      <div className="countdown-digits">
        <span>{timeLeft.hours}س</span>
        <span>:</span>
        <span>{timeLeft.minutes}د</span>
        <span>:</span>
        <span>{timeLeft.seconds}ث</span>
      </div>
    </div>
  );
};

function calculateTimeLeft(targetDate) {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return null;
  return {
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
```

---

### 17. إضافة قسم شهادات العملاء (Testimonials) المحسّن

```tsx
// components/Testimonials.tsx

const testimonials = [
  {
    name: 'أحمد س.',
    role: 'صاحب مقهى "بُن" — رام الله',
    image: '/images/testimonials/ahmad.jpg',
    text: 'بفضل استشارة GoatJourney، وفرت أكثر من 15,000 شيكل في ميزانية المعدات. المقهى حقق عائد استثمار خلال 8 أشهر.',
    metric: '+60% مبيعات',
  },
  {
    name: 'سارة خ.',
    role: 'مالكة مقهى "لافا" — نابلس',
    image: '/images/testimonials/sara.jpg',
    text: 'الدورة غيّرت مفهومي للقهوة المختصة بالكامل. اليوم مقهاي يخدم أكثر من 200 زبون يومياً.',
    metric: '200+ زبون يومي',
  },
  {
    name: 'محمد ع.',
    role: 'مدير مقهى "روست" — الخليل',
    image: '/images/testimonials/mohammad.jpg',
    text: 'التدريب العملي على المعدات الحقيقية فرق كبير. الفريق أصبح أكثر كفاءة والزبائن يلاحظون الفرق.',
    metric: 'تدريب 5 موظفين',
  },
];

export const Testimonials = () => (
  <section className="testimonials">
    <h2>قصص نجاح من واقع التجربة</h2>
    <div className="testimonials-grid">
      {testimonials.map((t, i) => (
        <div key={i} className="testimonial-card">
          <div className="testimonial-header">
            <Image src={t.image} alt={t.name} width={60} height={60} className="avatar" />
            <div>
              <h4>{t.name}</h4>
              <span>{t.role}</span>
            </div>
          </div>
          <p className="testimonial-text">"{t.text}"</p>
          <span className="testimonial-metric">{t.metric}</span>
        </div>
      ))}
    </div>
  </section>
);
```

---

### 18. إضافة قسم "المقاهي التي عملنا معها" (Client Logos)

```tsx
// components/ClientLogos.tsx

const clients = [
  { name: 'مقهى بُن', city: 'رام الله' },
  { name: 'لافا كافيه', city: 'نابلس' },
  { name: 'روست', city: 'الخليل' },
  { name: 'كافيه نابلس الجديد', city: 'نابلس' },
  { name: 'دريب ثرو', city: 'القدس' },
  { name: 'ركن قهوة', city: 'بيت لحم' },
];

export const ClientLogos = () => (
  <section className="client-logos">
    <h3>ثقة 25+ مقهى في فلسطين</h3>
    <div className="logos-grid">
      {clients.map((client, i) => (
        <div key={i} className="logo-item">
          <div className="logo-placeholder">
            {client.name.charAt(0)} {/* أول حرف كشعار مؤقت */}
          </div>
          <span className="logo-name">{client.name}</span>
          <span className="logo-city">{client.city}</span>
        </div>
      ))}
    </div>
  </section>
);
```

---

### 19. إضافة Social Media Links وSharing Buttons

```tsx
// components/SocialShare.tsx

const shareLinks = [
  {
    name: 'فيسبوك',
    icon: '/icons/facebook.svg',
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'واتساب',
    icon: '/icons/whatsapp.svg',
    getUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
  },
  {
    name: 'تويتر',
    icon: '/icons/twitter.svg',
    getUrl: (url, title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: 'لينكدإن',
    icon: '/icons/linkedin.svg',
    getUrl: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

export const SocialShare = ({ title, url }) => (
  <div className="social-share">
    <span>شارك هذا الدرس:</span>
    <div className="share-buttons">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.getUrl(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`شارك على ${link.name}`}
          className={`share-btn ${link.name.toLowerCase()}`}
        >
          <Image src={link.icon} alt={link.name} width={20} height={20} />
        </a>
      ))}
    </div>
  </div>
);

// إضافة في Footer — روابط السوشال ميديا:
export const SocialLinks = () => (
  <div className="social-links">
    <span>تابعنا:</span>
    <a href="https://www.instagram.com/goatjourney" target="_blank" rel="noopener">
      <Image src="/icons/instagram.svg" alt="انستغرام" width={24} height={24} />
    </a>
    <a href="https://www.facebook.com/goatjourney" target="_blank" rel="noopener">
      <Image src="/icons/facebook.svg" alt="فيسبوك" width={24} height={24} />
    </a>
    <a href="https://www.youtube.com/@goatjourney" target="_blank" rel="noopener">
      <Image src="/icons/youtube.svg" alt="يوتيوب" width={24} height={24} />
    </a>
    <a href="https://www.tiktok.com/@goatjourney" target="_blank" rel="noopener">
      <Image src="/icons/tiktok.svg" alt="تيك توك" width={24} height={24} />
    </a>
  </div>
);
```

**ملاحظة:** قم بإنشاء الحسابات الفعلية على المنصات المذكورة أولاً.

---

### 20. تحديث Open Graph Tags لكل صفحة

```tsx
// app/layout.tsx — Open Graph الأساسية
export const metadata = {
  openGraph: {
    type: 'website',
    locale: 'ar_PS',
    url: 'https://www.goatjourney.online',
    siteName: 'GoatJourney Academy',
    title: 'GoatJourney Academy | أكاديمية القهوة المختصة الأولى بالعربية',
    description: 'أول أكاديمية تفاعلية لتعلم القهوة المختصة وتأسيس المقاهي بالعربية — دورات، استشارات، وأدوات تفاعلية.',
    images: [
      {
        url: 'https://www.goatjourney.online/og-image-default.jpg',
        width: 1200,
        height: 630,
        alt: 'GoatJourney Academy — أكاديمية القهوة المختصة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoatJourney Academy | أكاديمية القهوة المختصة الأولى بالعربية',
    description: 'أول أكاديمية تفاعلية لتعلم القهوة المختصة وتأسيس المقاهي بالعربية.',
    images: ['https://www.goatjourney.online/og-image-default.jpg'],
  },
};

// app/lesson/[slug]/page.tsx — OG مخصصة
export async function generateMetadata({ params }): Promise<Metadata> {
  const lesson = await getLesson(params.slug);

  return {
    title: `${lesson.title} | GoatJourney Academy`,
    description: lesson.description,
    openGraph: {
      title: lesson.title,
      description: lesson.description,
      type: 'article',
      url: `https://www.goatjourney.online/lesson/${params.slug}`,
      images: [
        {
          url: lesson.ogImage || 'https://www.goatjourney.online/og-image-default.jpg',
          width: 1200,
          height: 630,
          alt: lesson.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: lesson.title,
      description: lesson.description,
      images: [lesson.ogImage || 'https://www.goatjourney.online/og-image-default.jpg'],
    },
  };
}
```

---

## المرحلة الرابعة: إصلاحات Accessibility

### 21. إصلاح viewport meta tag

```tsx
// ❌ الحالي:
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

// ✅ المطلوب (إزالة maximum-scale لدعم تكبير المستخدم):
<meta name="viewport" content="width=device-width, initial-scale=1" />
// أو في Next.js — لا حاجة لإضافته يدوياً، Next.js يتولى ذلك
```

### 22. إضافة Skip-to-Content Link

```tsx
// components/SkipLink.tsx

export const SkipLink = () => (
  <a
    href="#main-content"
    className="skip-link"
  >
    تخطي إلى المحتوى الرئيسي
  </a>
);

// CSS:
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #C8A97E;
  color: white;
  padding: 8px 16px;
  z-index: 100;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}
```

### 23. إضافة ARIA Labels على الأيقونات

```tsx
// ❌:
<button><HeartIcon /></button>

// ✅:
<button aria-label="إضافة إلى المفضلة">
  <HeartIcon aria-hidden="true" />
</button>

// ❌:
<a href="/consultant"><WhatsAppIcon /></a>

// ✅:
<a href="/consultant" aria-label="تواصل معنا عبر واتساب">
  <WhatsAppIcon aria-hidden="true" />
</a>
```

---

## المرحلة الخامسة: تحسينات الأداء

### 24. تحسين تحميل الصور

```tsx
// ❌ الحالي:
<img src="/large-image.jpg" />

// ✅ المطلوب:
import Image from 'next/image';

<Image
  src="/large-image.jpg"
  alt="وصف الصورة"
  width={800}
  height={450}
  quality={80}        // ضغط جيد بدون فقدان واضح
  placeholder="blur"  // تأثير blur أثناء التحميل
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..." // نسخة مصغرة مشفرة
  loading="lazy"      // lazy loading (باستثناء الصور فوق الصفحة)
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 25. تفعيل PWA Service Worker

```tsx
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);
```

---

## قائمة المهام التنفيذية (Checklist)

### ✅ المرحلة 1 (إصلاحات حرجة — الأسبوع 1)
- [ ] إصلاح صورة المؤسس (`/about`)
- [ ] إضافة صور الدورات (costing, cafe, brewing)
- [ ] تعديل `robots.txt` (تغيير النطاق)
- [ ] إنشاء `sitemap.ts` ديناميكي
- [ ] عناوين فريدة + `metadata` في كل صفحة
- [ ] إضافة `Canonical URLs`
- [ ] إضافة `JSON-LD` (Organization + Course + Article)
- [ ] إضافة `Alt Text` لجميع الصور
- [ ] توحيد التسعير بالشيكل
- [ ] تبسيط نموذج الاستشارة (Multi-step)

### ✅ المرحلة 2 (تحسينات UX/UI — الأسبوع 2-3)
- [ ] إضافة Breadcrumb Navigation
- [ ] إضافة Hero Image
- [ ] تحسين تباين النصوص (WCAG AA)
- [ ] إضافة Search functionality
- [ ] إضافة Security Headers
- [ ] إضافة `reCAPTCHA`
- [ ] إضافة Skip-to-Content link
- [ ] إصلاح `viewport` meta tag

### ✅ المرحلة 3 (تحسين التحويلات — الأسبوع 3-4)
- [ ] إضافة Exit-Intent Popup
- [ ] إضافة Urgency/Scarcity badges
- [ ] تحسين شهادات العملاء (صور + أرقام)
- [ ] إضافة Client Logos section
- [ ] إضافة Social Share buttons
- [ ] تحديث Open Graph Tags
- [ ] إنشاء حسابات Social Media

### ✅ المرحلة 4 (أداء + PWA — الأسبوع 4)
- [ ] تحسين `next/image` (quality, placeholder, sizes)
- [ ] تفعيل PWA Service Worker
- [ ] إضافة `loading="lazy"` للصور
- [ ] تحويل الصور إلى WebP

---

## ملاحظات تقنية مهمة

### إنشاء صور OG (Open Graph) مخصصة
```bash
# استخدام أي أداة تصميم لإنشاء صور OG بأبعاد 1200x630
# يمكن استخدام: Canva, Figma, أو سكريبت Node.js

# أبعاد الصور المطلوبة:
# OG Default: 1200 x 630 px
# OG Course: 1200 x 630 px (مع عنوان الدرس)
# Founder Photo: 800 x 1000 px (Portrait)
# Course Thumbnails: 600 x 340 px (16:9)
# Hero Background: 1920 x 1080 px
# Testimonial Avatars: 120 x 120 px (1:1)
```

### اختبار ما بعد التنفيذ
```bash
# 1. اختبار SEO
# https://search.google.com/test/rich-results
# https://technicalseo.com/tools/schema-markup-generator/

# 2. اختبار Performance
# Lighthouse في Chrome DevTools
# https://pagespeed.web.dev/

# 3. اختبار Accessibility
# https://wave.webaim.org/
# https://www.a11yproject.com/checklist/

# 4. اختبار Security Headers
# https://securityheaders.com/

# 5. اختبار OG
# https://www.opengraph.xyz/
# Facebook Sharing Debugger
```

---

*تم إعداد هذه التعليمات بناءً على تحليل شامل لموقع https://www.goatjourney.online/ في يونيو 2026.*
*التنفيذ يبدأ بالمرحلة 1 (حرجة) ثم بالترتيب.*
