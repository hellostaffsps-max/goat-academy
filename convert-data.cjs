const fs = require('fs');
const raw = fs.readFileSync('../lingua_data.json', 'utf8');
const data = JSON.parse(JSON.parse(raw));

function escapeStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\$/g, '\\$');
}

function buildContent(item) {
  if (!item.points || !item.points.length) return '';
  let md = '';
  item.points.forEach(p => {
    md += `## ${escapeStr(p[0])}\n${escapeStr(p[1])}\n\n`;
  });
  if (item.steps && item.steps.length) {
    md += '## خطوات التحضير\n\n';
    item.steps.forEach((s, i) => {
      md += `### ${i+1}. ${escapeStr(s[0])}\n${escapeStr(s[1])}\n`;
      if (s[2]) md += `⏱ ${escapeStr(s[2])}\n`;
      md += '\n';
    });
  }
  return md.trim();
}

let out = `export interface Lesson {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  rating: number;
  tags: string[];
  readTime?: string;
  difficulty?: string;
  content: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  count: number;
}

export interface LearningPath {
  id: string;
  title: string;
  lessonCount: number;
  description: string;
  lessons: string[];
}
`;

out += '\nexport const categories: Category[] = ' + JSON.stringify(data.sections.map(s => ({
  id: s.slug,
  title: s.nameAr,
  description: s.descAr,
  count: parseInt(s.count) || 0
})), null, 2) + ';\n';

out += '\nexport const lessons: Lesson[] = [\n';

data.items.forEach((item, idx) => {
  const content = buildContent(item);
  const lesson = {
    id: item.slug,
    title: item.titleAr,
    category: item.section,
    subcategory: data.sections.find(s => s.slug === item.section)?.nameAr || item.section,
    description: item.descAr,
    rating: parseFloat(item.rating) || 4.5,
    tags: [item.levelAr].filter(Boolean),
    readTime: item.time ? item.time.replace('⏱ ', '') : undefined,
    difficulty: item.levelAr,
    content: content
  };
  
  out += '  {\n';
  out += `    id: "${lesson.id}",\n`;
  out += `    title: "${escapeStr(lesson.title)}",\n`;
  out += `    category: "${lesson.category}",\n`;
  out += `    subcategory: "${escapeStr(lesson.subcategory)}",\n`;
  out += `    description: "${escapeStr(lesson.description)}",\n`;
  out += `    rating: ${lesson.rating},\n`;
  out += `    tags: ${JSON.stringify(lesson.tags)},\n`;
  if (lesson.readTime) out += `    readTime: "${lesson.readTime}",\n`;
  if (lesson.difficulty) out += `    difficulty: "${escapeStr(lesson.difficulty)}",\n`;
  out += `    content: \`${escapeStr(content)}\`,\n`;
  out += '  }';
  if (idx < data.items.length - 1) out += ',';
  out += '\n';
});

out += '];\n';

const paths = [
  { id: 'amateur', title: 'مسار هاوي القهوة', desc: 'تعلم المشروبات، طرق التحضير المنزلية، وفهم النكهات بدون تعقيد.' },
  { id: 'barista', title: 'مسار الباريستا', desc: 'ركز على الاستخلاص، الطحن، التبخير، المصطلحات، وثبات الوصفة.' },
  { id: 'owner', title: 'مسار صاحب المقهى', desc: 'ابدأ من المعدات والمنيو والتشغيل وتجربة العميل ودراسة التكاليف الخاصة.' }
];

out += '\nexport const learningPaths: LearningPath[] = [\n';
paths.forEach((p, idx) => {
  const lessons = data.items.filter(i => i.paths && i.paths.includes(p.id)).map(i => i.slug);
  out += '  {\n';
  out += `    id: "${p.id}",\n`;
  out += `    title: "${p.title}",\n`;
  out += `    lessonCount: ${lessons.length},\n`;
  out += `    description: "${p.desc}",\n`;
  out += `    lessons: ${JSON.stringify(lessons)}\n`;
  out += '  }';
  if (idx < paths.length - 1) out += ',';
  out += '\n';
});
out += '];\n';

out += '\nexport const getLessonsByCategory = (categoryId: string) => lessons.filter((l) => l.category === categoryId);\n';
out += 'export const getLessonById = (id: string) => lessons.find((l) => l.id === id);\n';

const featured = data.items.filter(i => i.featured).map(i => i.slug);
out += `export const getRecommendedLessons = () => [\n`;
featured.forEach((id, idx) => {
  out += `  lessons.find((l) => l.id === "${id}")`;
  if (idx < featured.length - 1) out += ',';
  out += '\n';
});
out += '].filter(Boolean) as Lesson[];\n';

fs.writeFileSync('src/data/coffeeData.ts', out, 'utf8');
console.log('Done! Wrote', out.length, 'bytes');
