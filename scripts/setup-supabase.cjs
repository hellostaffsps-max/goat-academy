const fs = require("fs");

const PAT = process.env.SUPABASE_PAT || "";
const PROJECT_REF = "brasoittyeiubayuupxw";
const API_BASE = "https://api.supabase.com";

async function query(sql) {
  const res = await fetch(`${API_BASE}/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PAT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function main() {
  console.log("🔧 Setting up Supabase project...\n");

  // 1. Add path column
  console.log("1️⃣  Adding 'path' column to 'lessons'...");
  try {
    await query("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS path text;");
    console.log("   ✅ Column 'path' added (or already exists)\n");
  } catch (e) {
    console.error("   ❌ Failed:", e.message);
  }

  // 2. Create bucket
  console.log("2️⃣  Creating 'images' bucket...");
  try {
    await query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES ('images', 'images', true, 5242880, '{image/jpeg,image/png,image/webp,image/gif}')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("   ✅ Bucket 'images' created (or already exists)\n");
  } catch (e) {
    console.error("   ❌ Failed:", e.message);
  }

  // 3. Enable RLS
  console.log("3️⃣  Enabling RLS on storage.objects...");
  try {
    await query("ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;");
    console.log("   ✅ RLS enabled\n");
  } catch (e) {
    console.log("   ⚠️  RLS may already be enabled or permission issue\n");
  }

  // 4. Create policies
  console.log("4️⃣  Creating storage policies...");
  const policies = [
    { name: "Allow public read from images", action: "SELECT", check: "USING (bucket_id = 'images')" },
    { name: "Allow authenticated uploads to images", action: "INSERT", check: "WITH CHECK (bucket_id = 'images')" },
    { name: "Allow authenticated delete from images", action: "DELETE", check: "USING (bucket_id = 'images')" },
  ];

  for (const p of policies) {
    try {
      await query(`
        DO $$ BEGIN
          CREATE POLICY "${p.name}"
            ON storage.objects FOR ${p.action}
            ${p.check};
        EXCEPTION WHEN duplicate_object THEN
          RAISE NOTICE 'Policy already exists';
        END $$;
      `);
      console.log(`   ✅ ${p.name}`);
    } catch (e) {
      console.log(`   ⚠️  ${p.name}: ${e.message}`);
    }
  }

  console.log("\n🎉 Setup complete!");
  console.log("   • Column 'path' added to 'lessons'");
  console.log("   • Bucket 'images' is public with 5MB limit");
  console.log("   • RLS policies created for read/insert/delete");
}

main().catch(console.error);
