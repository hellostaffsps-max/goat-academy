import { lessons } from '../src/data/coffeeData.js';

const SUPABASE_URL = 'https://brasoittyeiubayuupxw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyYXNvaXR0eWVpdWJheXV1cHh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ4OTA0NSwiZXhwIjoyMDk2MDY1MDQ1fQ.hF5l1-eYlA1_jl8J6UcS-46-VHhtuImIBv3PWs-scFc';

async function insertLessons() {
  const payload = lessons.map(l => ({
    slug: l.id,
    title: l.title,
    category: l.category,
    subcategory: l.subcategory,
    description: l.description,
    rating: l.rating,
    tags: l.tags,
    read_time: l.readTime || '',
    difficulty: l.difficulty || '',
    content: l.content,
  }));

  const batchSize = 20;
  for (let i = 0; i < payload.length; i += batchSize) {
    const batch = payload.slice(i, i + batchSize);
    console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(payload.length / batchSize)} (${batch.length} lessons)...`);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Failed:', res.status, text);
      process.exit(1);
    }
    console.log('OK');
  }
  console.log(`Inserted ${payload.length} lessons!`);
}

insertLessons().catch(console.error);
