type Row = Record<string, unknown>;
const equal = (a: unknown, b: unknown) =>
  JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** Only fields changed by this revision may be written. Unrelated admin edits survive. */
export function planCurriculumUpdate(
  current: Row,
  target: Row,
  revisions: Row[],
) {
  const candidates = revisions.map((previous) => {
    const fields = Object.keys(target).filter(
      (key) =>
        !["id", "slug"].includes(key) && !equal(target[key], previous[key]),
    );
    const conflicts = fields.filter(
      (key) =>
        !equal(current[key], previous[key]) &&
        !equal(current[key], target[key]),
    );
    const patch = Object.fromEntries(
      fields
        .filter((key) => !equal(current[key], target[key]))
        .map((key) => [key, target[key]]),
    );
    return { patch, conflicts };
  });
  return (
    candidates.find((candidate) => candidate.conflicts.length === 0) ?? {
      patch: {},
      conflicts: candidates[0]?.conflicts ?? ["unknown_revision"],
    }
  );
}
