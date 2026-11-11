import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getLessonNavigation } from "../src/lib/lessonNavigation.ts";
import {
  parseLearningSnapshot,
  learningStorageKey,
  emptyLearningSnapshot,
} from "../src/lib/learning-storage.ts";
import {
  normalizeLessonSearch,
  lessonDurationMinutes,
  matchesLessonDuration,
} from "../src/lib/lesson-filters.ts";

const curriculum = JSON.parse(
  await readFile(
    new URL("../src/data/reviewedCurriculum.json", import.meta.url),
    "utf8",
  ),
);
let navigationChecks = 0;
for (const path of curriculum.paths) {
  for (const [index, slug] of path.lessons.entries()) {
    const nav = getLessonNavigation(
      slug,
      curriculum.lessons,
      curriculum.paths,
      path.slug,
    );
    assert.equal(nav.pathId, path.slug, `Shared lesson switched path: ${slug}`);
    assert.equal(nav.lessonIndex, index + 1);
    assert.equal(nav.prev?.id ?? null, path.lessons[index - 1] ?? null);
    assert.equal(nav.next?.id ?? null, path.lessons[index + 1] ?? null);
    navigationChecks++;
  }
}
assert.deepEqual(
  parseLearningSnapshot("invalid json"),
  emptyLearningSnapshot(),
);
assert.deepEqual(parseLearningSnapshot("null"), emptyLearningSnapshot());
const sanitized = parseLearningSnapshot(
  JSON.stringify({
    favorites: ["espresso", "espresso", 42],
    settings: { fontSize: "xxl", reducedMotion: true },
  }),
);
assert.deepEqual(sanitized.favorites, ["espresso"]);
assert.equal(sanitized.settings.fontSize, "medium");
assert.notEqual(learningStorageKey(null), learningStorageKey("account-a"));
assert.notEqual(
  learningStorageKey("account-a"),
  learningStorageKey("account-b"),
);
assert.equal(
  normalizeLessonSearch("  إِسْبريسو  "),
  normalizeLessonSearch("اسبرِيسو"),
);
assert.equal(lessonDurationMinutes("١٥ دقيقة"), 15);
assert.equal(lessonDurationMinutes("2 hours"), 120);
assert.equal(matchesLessonDuration("١٥ دقيقة", "medium"), true);
assert.equal(matchesLessonDuration("غير محدد", "short"), false);
assert.equal(matchesLessonDuration("غير محدد", "unknown"), true);

// Exercise the real guest store in an isolated in-memory browser storage.
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
const memory = new Map();
globalThis.window = {
  localStorage: {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
  },
};
const { useStore } = await import("../src/store/useStore.ts");
assert.equal(useStore.getState().initialized, false);
let initializations = 0;
const stopObserving = useStore.subscribe((state, previous) => { if (state.initialized && !previous.initialized) initializations++; });
await Promise.all([useStore.getState().ensureInitialized(), useStore.getState().ensureInitialized(), useStore.getState().ensureInitialized()]);
stopObserving();
assert.equal(initializations, 1, "Concurrent consumers must share initialization");
await useStore.getState().toggleCompleted("espresso");
await useStore.getState().toggleFavorite("v60");
await useStore.getState().updateSettings({ fontSize: "large" });
await useStore.getState().markQuizPassed("costing");
const { useStore: lessonConsumer } = await import("../src/store/useStore.ts?consumer=direct-lesson");
assert.equal(lessonConsumer.getState, useStore.getState, "Route module re-evaluation replaced the initialized store");
assert.equal(lessonConsumer.getState().initialized, true);
assert.deepEqual(lessonConsumer.getState().completedLessons, ["espresso"]);
useStore.setState({ ...emptyLearningSnapshot(), initialized: false });
await useStore.getState().syncFromServer();
assert.deepEqual(useStore.getState().completedLessons, ["espresso"]);
assert.deepEqual(useStore.getState().favorites, ["v60"]);
assert.deepEqual(useStore.getState().quizPassed, ["costing"]);
assert.equal(useStore.getState().settings.fontSize, "large");
await useStore.getState().toggleCompleted("espresso");
await useStore.getState().toggleFavorite("v60");
assert.deepEqual(useStore.getState().completedLessons, []);
assert.deepEqual(useStore.getState().favorites, []);
const guestSaved = memory.get(learningStorageKey(null));
useStore.getState().invalidateAccountScope("account-b");
assert.deepEqual(useStore.getState().quizPassed, []);
assert.equal(useStore.getState().initialized, false);
assert.equal(
  memory.get(learningStorageKey(null)),
  guestSaved,
  "Account transition overwrote guest storage",
);
await useStore.getState().syncFromServer();
assert.deepEqual(useStore.getState().quizPassed, ["costing"]);
useStore.getState().clearData();
useStore.setState({ ...emptyLearningSnapshot(), initialized: false });
await useStore.getState().syncFromServer();
assert.deepEqual(useStore.getState().quizPassed, []);
console.log(
  JSON.stringify({
    navigationChecks,
    guestReloadPersistence: "passed",
    concurrentInitialization: "passed",
    routeModuleLifetime: "passed",
    scopeIsolation: "passed",
    resetAndUndo: "passed",
    filters: "passed",
  }),
);
