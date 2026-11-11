export interface LearningSnapshot {
  favorites: string[];
  completedLessons: string[];
  quizPassed: string[];
  toolsUsed: string[];
  dailyProgress: number;
  settings: { fontSize: "small" | "medium" | "large"; reducedMotion: boolean };
}

export const emptyLearningSnapshot = (): LearningSnapshot => ({
  favorites: [],
  completedLessons: [],
  quizPassed: [],
  toolsUsed: [],
  dailyProgress: 0,
  settings: { fontSize: "medium", reducedMotion: false },
});
export const learningStorageKey = (userId: string | null) =>
  `goatjourney-learning-v1:${userId ?? "guest"}`;

export function parseLearningSnapshot(raw: string | null): LearningSnapshot {
  const defaults = emptyLearningSnapshot();
  if (!raw) return defaults;
  try {
    const value = JSON.parse(raw);
    const strings = (items: unknown) =>
      Array.isArray(items)
        ? [
            ...new Set(
              items.filter(
                (item): item is string =>
                  typeof item === "string" &&
                  item.length > 0 &&
                  item.length < 200,
              ),
            ),
          ]
        : [];
    return {
      favorites: strings(value.favorites),
      completedLessons: strings(value.completedLessons),
      quizPassed: strings(value.quizPassed),
      toolsUsed: strings(value.toolsUsed),
      dailyProgress: Number.isFinite(value.dailyProgress)
        ? Math.max(0, value.dailyProgress)
        : 0,
      settings: {
        fontSize: ["small", "medium", "large"].includes(
          value.settings?.fontSize,
        )
          ? value.settings.fontSize
          : "medium",
        reducedMotion: value.settings?.reducedMotion === true,
      },
    };
  } catch {
    return defaults;
  }
}
