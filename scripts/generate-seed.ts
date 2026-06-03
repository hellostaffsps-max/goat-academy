import { lessons } from "../src/data/coffeeData";

function escapeSql(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

console.log("-- Supabase Seed Data for GoatJourney Academy");
console.log("-- Generated automatically from coffeeData.ts");
console.log("");
console.log("-- Insert lessons");
console.log("INSERT INTO lessons (slug, title, category, subcategory, description, rating, tags, read_time, difficulty, content) VALUES");

const rows = lessons.map((lesson, index) => {
  const tags = lesson.tags.map((t) => `"${t}"`).join(",");
  const isLast = index === lessons.length - 1;
  return `  ('${escapeSql(lesson.id)}', '${escapeSql(lesson.title)}', '${escapeSql(lesson.category)}', '${escapeSql(lesson.subcategory)}', '${escapeSql(lesson.description)}', ${lesson.rating}, ARRAY[${tags}], '${escapeSql(lesson.readTime || "")}', '${escapeSql(lesson.difficulty || "")}', '${escapeSql(lesson.content)}')${isLast ? ";" : ","}`;
});

console.log(rows.join("\n"));
