-- ============================================================
-- Goat Journey Academy - Complete Database Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. ADD image COLUMN TO lessons TABLE
-- ============================================================
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS image TEXT;

-- ============================================================
-- 2. CREATE articles TABLE (Blog)
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'tips',
  category_label TEXT NOT NULL DEFAULT '💡 نصائح سريعة',
  tags TEXT[] DEFAULT '{}',
  read_time TEXT DEFAULT '5 دقائق',
  date DATE DEFAULT CURRENT_DATE,
  author TEXT DEFAULT 'وائل أرزيقات',
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all" ON articles;

-- Create policy for full access
CREATE POLICY "Allow all" ON articles
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 3. CREATE success_stories TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  location TEXT DEFAULT '',
  image TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all" ON success_stories;

-- Create policy for full access
CREATE POLICY "Allow all" ON success_stories
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 4. CREATE learning_paths TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  lessons TEXT[] DEFAULT '{}',
  lesson_count INTEGER DEFAULT 0,
  icon TEXT DEFAULT 'Coffee',
  color TEXT DEFAULT 'from-sky-500 to-blue-600',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all" ON learning_paths;

-- Create policy for full access
CREATE POLICY "Allow all" ON learning_paths
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 5. CREATE STORAGE BUCKET "images"
-- ============================================================
-- Note: Buckets are typically created via Supabase UI or API
-- The following SQL enables the bucket if it exists:

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies for images bucket
DROP POLICY IF EXISTS "Allow public read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete images" ON storage.objects;

CREATE POLICY "Allow public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow authenticated delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');

-- ============================================================
-- 6. SEED DATA - Articles (Blog Posts)
-- ============================================================
INSERT INTO articles (slug, title, description, content, category, category_label, tags, read_time, date, author)
VALUES 
  (
    'barista-salary-guide-2026',
    'كم يتقاضى الباريستا في فلسطين 2026؟',
    'دليل شامل لرواتب الباريستا في المقاهي الفلسطينية من المبتدئ إلى المحترف.',
    '## رواتب الباريستا في فلسطين

يتراوح راتب الباريستا المبتدئ بين 2500 إلى 3500 شيكل شهرياً حسب المدينة وحجم المقهى.

## المستويات
- **مبتدئ:** 2500-3500 ₪
- **متوسط:** 4000-5500 ₪
- **محترف / Head Barista:** 6000-8500 ₪

## عوامل ترفع الراتب
- شهادات SCA
- خبرة 3+ سنوات
- مهارات في التدريب
- إدارة المخزون والتكاليف',
    'news',
    '📰 أخبار القهوة',
    ARRAY['رواتب', 'باريستا', 'فلسطين'],
    '5 دقائق',
    '2026-05-15',
    'وائل أرزيقات'
  ),
  (
    'success-story-ramallah-cafe',
    'من كشك صغير إلى علامة تجارية: قصة مقهى رام الله',
    'كيف حول صاحب مقهى في رام الله كشكاً صغيراً باستثمار 15 ألف شيكل إلى علامة تجارية معروفة.',
    '## البداية
بدأت القصة بكشك قهوة صغير في زاوية شارع، بمعدات مستعملة واستثمار 15,000 شيكل.

## التحديات
- عدم وجود رأس مال كافٍ للتسويق
- المنافسة الشديدة في المنطقة
- صعوبة إيجاد كادر مدرب

## عوامل النجاح
1. **التركيز على الجودة:** لم ي妥协 على جودة البن حتى في البداية
2. **بناء علاقات:** تعرف على كل عميل بالاسم
3. **التوسع التدريجي:** فتح فرع ثاني بعد استقرار الأول
4. **التدريب المستمر:** رفع مهارات الفريق باستمرار',
    'success',
    '🏆 قصص النجاح',
    ARRAY['نجاح', 'تأسيس', 'رام الله'],
    '8 دقائق',
    '2026-04-20',
    'وائل أرزيقات'
  ),
  (
    'weekly-tip-grind-consistency',
    'نصيحة الأسبوع: لماذا يتغير طعم القهوة كل يوم؟',
    'السر يكمن في ثبات الطحن. إليك 3 نصائح لضمان استقرار الطعم يومياً في مقهاك.',
    '## المشكلة
كثير من المقاهي يعانون من تذبذب طعم القهوة يومياً حتى مع نفس البن.

## الأسباب الرئيسية
1. **تغير درجة الطحن** بسبب الحرارة والرطوبة
2. **عدم معايرة الطحن** عند تغيير البن
3. **الإهمال في التنظيف** اليومي للمطحنة

## الحلول
- معايرة الطحن كل صباح
- تسجيل إعدادات الطحن لكل نوع بن
- تنظيف المطحنة أسبوعياً على الأقل',
    'tips',
    '💡 نصائح سريعة',
    ARRAY['طحن', 'استقرار', 'جودة'],
    '3 دقائق',
    '2026-06-01',
    'وائل أرزيقات'
  ),
  (
    'cafe-cost-case-study',
    'دراسة حالة: تكلفة فتح مقهى متوسط في نابلس',
    'تحليل تفصيلي لكل بند من بنود التكلفة لفتح مقهى 80 متر مربع في نابلس.',
    '## نظرة عامة
مقهى 80 متر مربع في منطقة تجارية متوسطة في نابلس.

## التكاليف
| البند | التكلفة (₪) |
|-------|------------|
| ماكينة إسبريسو | 35,000 |
| مطحنة | 12,000 |
| أثاث وديكور | 25,000 |
| إيجار + تأمين | 20,000 |
| معدات فرعية | 15,000 |
| رأس مال عامل | 20,000 |

## الإجمالي: 127,000 شيكل تقريباً',
    'case-study',
    '📊 دراسات حالة',
    ARRAY['تكاليف', 'نابلس', 'دراسة'],
    '10 دقائق',
    '2026-03-10',
    'وائل أرزيقات'
  ),
  (
    'ethiopia-coffee-origin',
    'رحلة إلى موطن القهوة: إثيوبيا ييرغاشيف',
    'رحلة استكشافية إلى منطقة ييرغاشيف في إثيوبيا، موطن أجود أنواع البن العربي.',
    '## المنطقة
ييرغاشيف هي واحدة من أشهر مناطق إنتاج البن في إثيوبيا.

## الخصائص
- ارتفاع: 1700-2200 متر
- معالجة: غسيل وجافة
- نكهات: زهور، حمضيات، شاي

## التجربة
زيارة المزارع والتعرف على طريقة المعالجة التقليدية.',
    'exploration',
    '🌍 رحلات استكشاف',
    ARRAY['إثيوبيا', 'بن', 'سنقل أوريجن'],
    '7 دقائق',
    '2026-02-15',
    'وائل أرزيقات'
  ),
  (
    'instagram-marketing-cafe',
    '5 خطوات لتسويق مقهاك على إنستغرام بشكل احترافي',
    'كيف تبني حضوراً رقمياً لمقهاك على إنستغرام دون ميزانية ضخمة.',
    '## الخطوات
1. **صور منتظمة:** انشر يومياً على الأقل
2. **ستوريز يومية:** وراء الكواليس واليوميات
3. **تفاعل مع المتابعين:** رد على كل تعليق
4. **استخدم الهاشتاغات المحلية:** #قهوة_فلسطينية
5. **تعاون مع مؤثرين محليين:** ابدأ بالصغار',
    'tips',
    '💡 نصائح سريعة',
    ARRAY['تسويق', 'إنستغرام', 'رقمي'],
    '6 دقائق',
    '2026-05-01',
    'وائل أرزيقات'
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 7. SEED DATA - Success Stories
-- ============================================================
INSERT INTO success_stories (slug, title, description, content, location, featured)
VALUES 
  (
    'arabica-cafe-ramallah',
    'مقهى البن العربي',
    'بعد استشارة Goat Journey Academy، زادت مبيعاتنا بنسبة 60% خلال 3 أشهر فقط.',
    '## قصة النجاح
بدأنا بمقهى صغير في رام الله وواجهنا تحديات في جودة القهوة وتدريب الفريق.

## ما قدمته الأكاديمية
- خطة تشغيل شاملة
- تدريب فريق مدته أسبوعين
- تطوير قائمة مشروبات متوازنة

## النتائج
- زيادة المبيعات 60%
- تحسين تقييم الزبائن
- تقليل هدر البن بنسبة 40%',
    'رام الله، فلسطين',
    true
  ),
  (
    'roastery-amman',
    'روستري التخصص',
    'التدريب المكثف في الأكاديمية ساعد فريقنا في رفع جودة التحميص.',
    '## التحدي
روستري في عمان يعاني من تذبذب جودة التحميص بين الدفعات.

## الحل
- دورة تحميص متقدمة
- معايرة المعدات
- نظام مراقبة الجودة

## النتائج
- درجات Q Grader ممتازة
- ثبات في الجودة
- زيادة الطلبات بنسبة 45%',
    'عمان، الأردن',
    true
  ),
  (
    'nablus-cafe',
    'كافيه نابلس الجديد',
    'بدأنا من الصفر بفضل خطة العمل المفصلة. اليوم لدينا مقهى ناجح بأكثر من 200 زبون يومياً.',
    '## البداية
فكرة فتح مقهى في نابلس بدون خبرة سابقة.

## خطة العمل
- دراسة سوق شاملة
- اختيار المعدات المناسبة
- تصميم منيو متوازن

## النتائج
- 200+ زبون يومياً
- ربحية من الشهر الثالث
- تقييم 4.8 على Google',
    'نابلس، فلسطين',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 8. SEED DATA - Learning Paths
-- ============================================================
INSERT INTO learning_paths (slug, title, description, lessons, lesson_count, icon, color, featured)
VALUES 
  (
    'amateur',
    'مسار هاوي القهوة',
    'تعلم المشروبات، طرق التحضير المنزلية، وفهم النكهات بدون تعقيد.',
    ARRAY[
      'espresso','americano','cappuccino','latte','cortado','macchiato','mocha',
      'cold-brew','iced-latte','affogato','filter-coffee','v60','chemex',
      'french-press','aeropress','moka-pot','turkish-coffee','arabica','robusta',
      'single-origin','espresso-blend','coffee-processing','roast-levels','grind-size'
    ],
    25,
    'Coffee',
    'from-sky-500 to-blue-600',
    true
  ),
  (
    'barista',
    'مسار الباريستا المحترف',
    'ركز على الاستخلاص، الطحن، التبخير، المصطلحات، وثبات الوصفة.',
    ARRAY[
      'espresso','ristretto','lungo','cappuccino','latte','flat-white',
      'cortado','macchiato','spanish-latte','filter-coffee','v60','chemex',
      'aeropress','batch-brew','siphon','coffee-grinder','espresso-machine',
      'tamper','distribution-tool','milk-pitcher','water-filtration',
      'tds','channeling','microfoam','dial-in','cupping'
    ],
    27,
    'Award',
    'from-amber-500 to-orange-600',
    true
  ),
  (
    'owner',
    'مسار صاحب المقهى',
    'ابدأ من المعدات والمنيو والتشغيل وتجربة العميل ودراسة التكاليف الخاصة.',
    ARRAY[
      'espresso','americano','cappuccino','latte','mocha','cold-brew',
      'coffee-grinder','espresso-machine','pos-system','water-boiler',
      'bar-workflow','cafe-branding','location-choice','customer-experience',
      'staff-training','supplier-selection','before-opening-cafe',
      'building-coffee-menu','small-kiosk','drive-thru'
    ],
    21,
    'BookOpen',
    'from-emerald-500 to-teal-600',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 9. UPDATE TRIGGER for updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS update_success_stories_updated_at ON success_stories;
DROP TRIGGER IF EXISTS update_learning_paths_updated_at ON learning_paths;

-- Create triggers
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_success_stories_updated_at
  BEFORE UPDATE ON success_stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DONE!
-- ============================================================
