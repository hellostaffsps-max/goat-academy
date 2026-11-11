import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Run the production action with a fake data client. No network or live data writes.
const source = fs.readFileSync(new URL("../src/actions/user-data.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function fixture(options = {}) {
  const userId = "owner-a";
  const rows = {
    user_favorites: [{ user_id: userId }, { user_id: "owner-b" }],
    user_progress: [{ user_id: userId }, { user_id: "owner-b" }],
    user_settings: options.missingSettings ? [] : [{ user_id: userId, font_size: "large", reduced_motion: true }, { user_id: "owner-b", font_size: "small", reduced_motion: true }],
  };
  const queries = [];
  const client = {
    auth: { getUser: async () => ({ data: { user: options.noUser ? null : { id: userId } }, error: options.authError ? new Error("auth unavailable") : null }) },
    from(table) {
      queries.push(table);
      return {
        delete() {
          assert.notEqual(table, "user_settings", "Reset must work without a user_settings DELETE policy");
          return { eq: async (column, value) => {
            assert.equal(column, "user_id");
            if (options.failedDelete === table) return { error: new Error("delete denied") };
            rows[table] = rows[table].filter(row => row.user_id !== value);
            return { error: null };
          } };
        },
        upsert(payload, config) {
          assert.equal(table, "user_settings");
          assert.equal(config.onConflict, "user_id");
          return { select: () => ({ single: async () => {
            if (options.failedUpsert) return { error: new Error("settings update denied"), data: null };
            if (options.emptyReadback) return { error: null, data: null };
            const existing = rows[table].find(row => row.user_id === payload.user_id);
            if (existing) Object.assign(existing, payload); else rows[table].push({ ...payload });
            return { error: null, data: { ...payload } };
          } }) };
        },
      };
    },
  };
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => {
    assert.equal(name, "@/utils/supabase/server");
    return { createClient: async () => client };
  }, Date, console });
  return { reset: exports.resetUserLearningData, rows, queries };
}
for (const missingSettings of [false, true]) {
  const test = fixture({ missingSettings });
  await test.reset("owner-a");
  assert.equal(test.rows.user_favorites.length, 1);
  assert.equal(test.rows.user_favorites[0].user_id, "owner-b");
  assert.equal(test.rows.user_progress.length, 1);
  assert.equal(test.rows.user_progress[0].user_id, "owner-b");
  const own = test.rows.user_settings.find(row => row.user_id === "owner-a");
  assert.equal(own.font_size, "medium"); assert.equal(own.reduced_motion, false);
  if (!missingSettings) assert.equal(test.rows.user_settings.find(row => row.user_id === "owner-b").font_size, "small");
}
for (const options of [{ noUser: true }, { authError: true }, {}]) {
  const test = fixture(options);
  await assert.rejects(test.reset("different-account"), /Account changed/);
  assert.equal(test.queries.length, 0, "Unauthorized resets must not issue any table query");
}
for (const options of [{ failedUpsert: true }, { failedDelete: "user_favorites" }, { failedDelete: "user_progress" }, { emptyReadback: true }]) {
  const test = fixture(options);
  await assert.rejects(test.reset("owner-a"));
}
console.log("Learning reset passed: existing/missing settings, owner isolation, authentication failures, write failures, and empty readback.");
