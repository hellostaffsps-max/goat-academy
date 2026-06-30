const { createClient } = require("@supabase/supabase-js");

const URL = "https://brasoittyeiubayuupxw.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyYXNvaXR0eWVpdWJheXV1cHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0ODkwNDUsImV4cCI6MjA5NjA2NTA0NX0.uezUcf6E5Lu2Ayc52e5fQICtStzmeNlmB3hKRop71QQ";

const supabase = createClient(URL, ANON_KEY);

async function seed() {
  console.log("🌱 Seeding Supabase...\n");

  // 1. Seed lessons
  console.log("1️⃣  Seeding lessons...");
  const { lessons } = await import("../src/data/coffeeData.ts");
  const lessonRows = lessons.map((l) => ({
    slug: l.id,
    title: l.title,
    category: l.category,
    subcategory: l.subcategory || "عام",
    description: l.description,
    rating: l.rating || 4.5,
    tags: l.tags || [],
    read_time: l.readTime || "3m",
    difficulty: l.difficulty || "",
    content: l.content,
    image: null,
    path: null,
  }));

  // Insert in batches of 50 to avoid payload limits
  for (let i = 0; i < lessonRows.length; i += 50) {
    const batch = lessonRows.slice(i, i + 50);
    const { error } = await supabase.from("lessons").upsert(batch, { onConflict: "slug" });
    if (error) {
      console.error(`   ❌ Batch ${i}-${i + batch.length}:`, error.message);
    } else {
      console.log(`   ✅ Batch ${i}-${i + batch.length} inserted`);
    }
  }

  // 2. Seed learning paths
  console.log("\n2️⃣  Seeding learning paths...");
  const { learningPaths } = await import("../src/data/coffeeData.ts");
  const pathRows = learningPaths.map((p) => ({
    slug: p.id,
    title: p.title,
    description: p.description,
    lessons: p.lessons || [],
    lesson_count: p.lessonCount || p.lessons?.length || 0,
    icon: p.icon || "BookOpen",
    color: p.color || "from-sky-500 to-blue-600",
    featured: false,
  }));

  const { error: pathError } = await supabase.from("learning_paths").upsert(pathRows, { onConflict: "slug" });
  if (pathError) {
    console.error("   ❌ Paths error:", pathError.message);
  } else {
    console.log(`   ✅ ${pathRows.length} paths inserted`);
  }

  // 3. Seed articles
  console.log("\n3️⃣  Seeding articles...");
  const { articles } = await import("../src/data/blogData.ts");
  const articleRows = articles.map((a) => ({
    slug: a.id,
    title: a.title,
    description: a.description,
    content: a.content,
    category: a.category,
    category_label: a.category_label || a.category,
    tags: a.tags || [],
    read_time: a.read_time || "5 دقائق",
    date: a.date || new Date().toISOString().split("T")[0],
    author: a.author || "وائل أرزيقات",
    image: null,
  }));

  const { error: articleError } = await supabase.from("articles").upsert(articleRows, { onConflict: "slug" });
  if (articleError) {
    console.error("   ❌ Articles error:", articleError.message);
  } else {
    console.log(`   ✅ ${articleRows.length} articles inserted`);
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch(console.error);
