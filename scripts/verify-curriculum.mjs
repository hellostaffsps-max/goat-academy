import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { planCurriculumUpdate } from "../src/lib/curriculum-update.ts";
import { pathQuizzes } from "../src/data/pathQuizzes.ts";
import { projects, confirmedProject } from "../src/data/projects.ts";
const curriculum = JSON.parse(
  readFileSync(new URL("../src/data/reviewedCurriculum.json", import.meta.url)),
);
const previous = JSON.parse(
  readFileSync(
    new URL("../src/data/curriculumPreviousReview.json", import.meta.url),
  ),
);
const slugs = new Set(curriculum.lessons.map((l) => l.slug));
assert.equal(slugs.size, 112);
assert.deepEqual(
  [...slugs],
  previous.lessons.map((l) => l.slug),
);
for (const l of curriculum.lessons) {
  assert(l.content.includes("## التطبيق العملي"), l.slug);
  assert(
    !/Kew|WCR|SCA|FDA|WHO|University of|BCCDC|https?:/.test(l.description),
    l.slug,
  );
  assert.equal(l.content.match(/### دليل الإجابة/g)?.length, 1, l.slug);
  assert(!/https?:\/\/|## المراجع|مراجعة تحريرية/.test(l.content), l.slug);
  if (l.image.startsWith("/"))
    assert(existsSync(new URL(`../public${l.image}`, import.meta.url)), l.slug);
  assert.equal(l.image, previous.lessons.find((p) => p.slug === l.slug).image);
}
for (const path of curriculum.paths) {
  assert.equal(new Set(path.lessons).size, path.lesson_count);
  assert(
    path.lessons.every((slug) => slugs.has(slug)),
    path.slug,
  );
  assert.equal(pathQuizzes[path.slug].questions.length, 5);
  for (const q of pathQuizzes[path.slug].questions)
    assert(q.options[q.correctAnswer] && q.explanation);
}
const target = curriculum.lessons[0];
const prior = previous.lessons[0];
const editedImage = { ...prior, image: "/custom-upload.webp", rating: 4.9 };
const plan = planCurriculumUpdate(editedImage, target, [prior]);
assert.equal(plan.conflicts.length, 0);
assert.equal(plan.patch.image, undefined);
assert.equal(plan.patch.rating, undefined);
assert.equal(plan.patch.content, target.content);
assert(
  planCurriculumUpdate(
    { ...prior, content: "new administrator text" },
    target,
    [prior],
  ).conflicts.includes("content"),
);
assert.deepEqual(
  planCurriculumUpdate({ ...editedImage, ...plan.patch }, target, [prior])
    .patch,
  {},
);
assert.equal(projects.filter((p) => p.logo).length, 10);
assert.equal(new Set(projects.map((p) => p.slug)).size, 13);
for (const p of projects) {
  assert.equal(confirmedProject(p.name)?.slug, p.slug);
  if (p.logo)
    assert(existsSync(new URL(`../public${p.logo.src}`, import.meta.url)));
}
assert.equal(confirmedProject("مقهى ريكوفي (RECOFFE)").slug, "re-coffee");
assert.equal(confirmedProject("قهوة مريم (QAHWET MARIAM)").slug, "mariam");
assert.equal(confirmedProject("مقهى غير مسجل"), undefined);
console.log(
  "PASS: 112 lessons, 5 paths, 25 questions, 10 logos, 13 projects, protected images, conflict detection and retry.",
);
