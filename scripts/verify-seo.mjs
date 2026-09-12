/** Run against `npm run start`: node scripts/verify-seo.mjs http://localhost:3000 */
import assert from "node:assert/strict";
const base = process.argv[2] || "http://localhost:3000";
const origin = "https://www.goatjourney.online";
const get = async (path) => {
  const response = await fetch(new URL(path, base), { redirect: "manual" });
  return {
    status: response.status,
    headers: response.headers,
    html: await response.text(),
  };
};
const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.status, 200);
const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
assert.equal(new Set(urls).size, urls.length, "duplicate sitemap URLs");
assert(urls.length > 15);
const titles = new Set();
const results = [];
for (let start = 0; start < urls.length; start += 6) {
  await Promise.all(
    urls.slice(start, start + 6).map(async (url) => {
      assert(url.startsWith(origin + "/"));
      const path = new URL(url).pathname;
      assert(!/^\/(admin|auth|settings|favorites)(\/|$)/.test(path));
      const { status, html } = await get(path);
      assert.equal(status, 200, path);
      const canonicals = [
        ...html.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/g),
      ].map((m) => new URL(m[1]).href);
      assert.deepEqual(canonicals, [url], `canonical ${path}`);
      assert.equal(
        (html.match(/<h1[\s>]/g) || []).length,
        1,
        `one visible h1 ${path}`,
      );
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
      assert(title, `title ${path}`);
      assert(!titles.has(title), `duplicate title ${title}`);
      titles.add(title);
      assert(
        !/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html),
        `indexable ${path}`,
      );
      const schemas = [
        ...html.matchAll(
          /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
        ),
      ].map((m) => JSON.parse(m[1]));
      const graph = schemas.flatMap((s) => s["@graph"] || [s]);
      const person = graph.find(
        (s) =>
          s["@type"] === "Person" &&
          s["@id"] === origin + "/about#wael-irzeqat",
      );
      assert.equal(person?.name, "Wael Irzeqat", `entity ${path}`);
      if (path.startsWith("/services/"))
        assert(
          graph.some((s) => s["@type"] === "Service"),
          `service schema ${path}`,
        );
      if (path.startsWith("/blog/"))
        assert(
          graph.some((s) => s["@type"] === "BlogPosting"),
          `article schema ${path}`,
        );
      if (path.startsWith("/lesson/"))
        assert(
          graph.some((s) => s["@type"] === "LearningResource"),
          `lesson schema ${path}`,
        );
      results.push({ path, status, title });
    }),
  );
}
for (const path of [
  "/does-not-exist",
  "/lesson/not-a-real-lesson",
  "/blog/not-a-real-article",
  "/downloads/not-a-real-resource",
  "/services/not-a-real-service",
  "/downloads/__proto__",
]) {
  const result = await get(path);
  assert.equal(result.status, 404, path);
  assert(result.html.includes("noindex"), `404 robots ${path}`);
}
for (const path of ["/settings", "/favorites", "/auth/login"]) {
  const result = await get(path);
  assert.equal(result.status, 200, path);
  assert(result.headers.get("x-robots-tag")?.includes("noindex"), path);
  assert(
    /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(result.html),
    path,
  );
}
const admin = await get("/admin");
assert([307, 308].includes(admin.status));
assert(admin.headers.get("location")?.includes("/auth/login"));
const robots = await get("/robots.txt");
assert.equal(robots.status, 200);
assert(robots.html.includes(`Sitemap: ${origin}/sitemap.xml`));
assert(!robots.html.includes("goatjourney.com"));
const og = await fetch(new URL("/og/default.png", base));
assert.equal(og.status, 200);
assert(og.headers.get("content-type")?.includes("image/png"));
const png = Buffer.from(await og.arrayBuffer());
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
const search = await get("/explore?q=Barista");
assert.equal(search.status, 200);
assert(search.html.includes("Barista Training Palestine"));
const sw = await get("/sw.js");
assert(sw.headers.get("cache-control")?.includes("no-store"));
console.log(
  JSON.stringify(
    {
      passed: true,
      sitemapPages: urls.length,
      invalidRoutes: 6,
      privatePages: 3,
      adminRedirect: true,
      og: "1200x630 PNG",
      search: true,
      results,
    },
    null,
    2,
  ),
);
