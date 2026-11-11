"use client";

import { create, type StoreApi, type UseBoundStore } from "zustand";
import { useEffect } from "react";
import {
  getUserLearningSnapshot,
  toggleUserFavorite,
  toggleUserProgress,
  updateUserSettings,
} from "@/actions/user-data";
import { checkBadges } from "@/lib/badges";
import {
  emptyLearningSnapshot,
  learningStorageKey,
  parseLearningSnapshot,
  type LearningSnapshot,
} from "@/lib/learning-storage";

interface AppState extends LearningSnapshot {
  initialized: boolean;
  accountId: string | null;
  saveError: string | null;
  pendingFavorites: string[];
  pendingLessons: string[];
  badges: string[];
  searchQuery: string;
  selectedCategory: string | null;
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  toggleCompleted: (id: string) => Promise<void>;
  isCompleted: (id: string) => boolean;
  awardBadges: () => void;
  hasBadge: (id: string) => boolean;
  markQuizPassed: (pathId: string) => void;
  trackToolUsage: (toolId: string) => void;
  setDailyProgress: (n: number) => void;
  updateSettings: (
    settings: Partial<LearningSnapshot["settings"]>,
  ) => Promise<void>;
  syncFromServer: () => Promise<void>;
  ensureInitialized: () => Promise<void>;
  invalidateAccountScope: (accountId: string | null) => void;
  clearData: () => void;
}

const readLocal = (accountId: string | null) => {
  try {
    return parseLearningSnapshot(
      window.localStorage.getItem(learningStorageKey(accountId)),
    );
  } catch {
    return emptyLearningSnapshot();
  }
};
const toggle = (items: string[], id: string, enabled: boolean) =>
  enabled ? [...new Set([...items, id])] : items.filter((item) => item !== id);
function createLearningStore() {
  let generation = 0;
  let settingsQueue: Promise<void> = Promise.resolve();
  let initialization: Promise<void> | undefined;

  const store = create<AppState>()((set, get) => ({
    ...emptyLearningSnapshot(),
    initialized: false,
    accountId: null,
    saveError: null,
    pendingFavorites: [],
    pendingLessons: [],
    badges: [],
    searchQuery: "",
    selectedCategory: null,

    toggleFavorite: async (id) => {
      if (!get().initialized) await get().ensureInitialized();
      if (!get().initialized || get().pendingFavorites.includes(id)) return;
      const version = generation;
      const accountId = get().accountId;
      set((state) => ({
        pendingFavorites: [...state.pendingFavorites, id],
        saveError: null,
      }));
      try {
        const enabled = accountId
          ? await toggleUserFavorite(id, accountId)
          : !get().favorites.includes(id);
        if (version !== generation) return;
        set((state) => ({ favorites: toggle(state.favorites, id, enabled) }));
      } catch {
        if (version === generation)
          set({
            saveError:
              "تعذّر حفظ المفضلة في حسابك. حاول مرة أخرى أو أعد تحميل الصفحة.",
          });
      } finally {
        if (version === generation)
          set((state) => ({
            pendingFavorites: state.pendingFavorites.filter(
              (item) => item !== id,
            ),
          }));
      }
    },
    isFavorite: (id) => get().favorites.includes(id),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

    toggleCompleted: async (id) => {
      if (!get().initialized) await get().ensureInitialized();
      if (!get().initialized || get().pendingLessons.includes(id)) return;
      const version = generation;
      const accountId = get().accountId;
      set((state) => ({
        pendingLessons: [...state.pendingLessons, id],
        saveError: null,
      }));
      try {
        const enabled = accountId
          ? await toggleUserProgress(id, accountId)
          : !get().completedLessons.includes(id);
        if (version !== generation) return;
        set((state) => {
          const completedLessons = toggle(state.completedLessons, id, enabled);
          return {
            completedLessons,
            badges: checkBadges({ ...state, completedLessons }),
          };
        });
      } catch {
        if (version === generation)
          set({
            saveError:
              "تعذّر حفظ إكمال الدرس في حسابك. حاول مرة أخرى أو أعد تحميل الصفحة.",
          });
      } finally {
        if (version === generation)
          set((state) => ({
            pendingLessons: state.pendingLessons.filter((item) => item !== id),
          }));
      }
    },
    isCompleted: (id) => get().completedLessons.includes(id),
    awardBadges: () => set({ badges: checkBadges(get()) }),
    hasBadge: (id) => get().badges.includes(id),
    markQuizPassed: async (pathId) => {
      if (!get().initialized) await get().ensureInitialized();
      if (!get().initialized) return;
      set((state) => {
        const quizPassed = [...new Set([...state.quizPassed, pathId])];
        return { quizPassed, badges: checkBadges({ ...state, quizPassed }) };
      });
    },
    trackToolUsage: async (toolId) => {
      if (!get().initialized) await get().ensureInitialized();
      if (!get().initialized) return;
      set((state) => {
        const toolsUsed = [...new Set([...state.toolsUsed, toolId])];
        return { toolsUsed, badges: checkBadges({ ...state, toolsUsed }) };
      });
    },
    setDailyProgress: async (dailyProgress) => {
      if (!get().initialized) await get().ensureInitialized();
      if (get().initialized) set({ dailyProgress });
    },

    updateSettings: async (settings) => {
      if (!get().initialized) await get().ensureInitialized();
      if (!get().initialized) return;
      const version = generation;
      const accountId = get().accountId;
      const next = { ...get().settings, ...settings };
      set({ settings: next, saveError: null });
      if (!accountId) return;
      settingsQueue = settingsQueue.then(async () => {
        if (version !== generation) return;
        try {
          await updateUserSettings(next, accountId);
        } catch {
          if (version === generation)
            set({
              saveError:
                "حُفظ المظهر على هذا الجهاز، وتعذّرت مزامنته مع حسابك.",
            });
        }
      });
      await settingsQueue;
    },

    invalidateAccountScope: (accountId) => {
      if (get().initialized && get().accountId === accountId) return;
      generation += 1;
      set({
        ...emptyLearningSnapshot(),
        accountId,
        initialized: false,
        badges: [],
        pendingFavorites: [],
        pendingLessons: [],
        saveError: null,
      });
    },
    ensureInitialized: () => {
      if (get().initialized) return Promise.resolve();
      return initialization || get().syncFromServer();
    },
    syncFromServer: async () => {
      const version = ++generation;
      set({ initialized: false, pendingFavorites: [], pendingLessons: [] });
      const request = (async () => {
        try {
          const remote = process.env.NEXT_PUBLIC_SUPABASE_URL
            ? await getUserLearningSnapshot()
            : null;
          if (version !== generation) return;
          const accountId = remote?.userId ?? null;
          const local = readLocal(accountId);
          const snapshot = remote?.userId
            ? {
                ...local,
                favorites: [...new Set(remote.favorites)],
                completedLessons: [...new Set(remote.progress)],
                settings: remote.settings
                  ? parseLearningSnapshot(
                      JSON.stringify({
                        settings: {
                          fontSize: remote.settings.font_size,
                          reducedMotion: remote.settings.reduced_motion,
                        },
                      }),
                    ).settings
                  : local.settings,
              }
            : local;
          set({
            ...snapshot,
            accountId,
            badges: checkBadges(snapshot),
            initialized: true,
            saveError: null,
          });
        } catch {
          if (version !== generation) return;
          // Never load an unverified account's cached progress into another session.
          const local = readLocal(null);
          set({
            ...local,
            accountId: null,
            badges: checkBadges(local),
            initialized: true,
            saveError:
              "تعذّر الاتصال بالحساب. تقدمك الحالي يُحفظ على هذا الجهاز كزائر.",
          });
        }
      })();
      initialization = request;
      try {
        await request;
      } finally {
        if (initialization === request) initialization = undefined;
      }
    },
    clearData: () => {
      generation += 1;
      set({
        ...emptyLearningSnapshot(),
        badges: [],
        saveError: null,
        pendingFavorites: [],
        pendingLessons: [],
      });
    },
  }));

  // Runs only after the layout's client effect restores the appropriate account scope.
  // Server render and first client render therefore use identical defaults.
  store.subscribe((state) => {
    if (!state.initialized || typeof window === "undefined") return;
    const snapshot: LearningSnapshot = {
      favorites: state.favorites,
      completedLessons: state.completedLessons,
      quizPassed: state.quizPassed,
      toolsUsed: state.toolsUsed,
      dailyProgress: state.dailyProgress,
      settings: state.settings,
    };
    try {
      window.localStorage.setItem(
        learningStorageKey(state.accountId),
        JSON.stringify(snapshot),
      );
    } catch {
      /* Browser storage may be unavailable in private/restricted sessions. */
    }
  });

  return store;
}

// A single browser instance survives route/chunk evaluation. Server rendering
// retains deterministic empty state and never reads browser storage.
const browserStoreKey = Symbol.for("goatjourney.learning-store.v1");
const browserHost = globalThis as typeof globalThis & {
  [browserStoreKey]?: UseBoundStore<StoreApi<AppState>>;
};
const learningStore =
  typeof window === "undefined"
    ? createLearningStore()
    : (browserHost[browserStoreKey] ??= createLearningStore());

function useLearningStore<T = AppState>(selector?: (state: AppState) => T): T {
  const state = learningStore(selector ?? ((value) => value as unknown as T));
  useEffect(() => {
    // Each consumer can establish readiness, including a directly opened lesson.
    // The shared promise prevents concurrent mounts from resetting one another.
    void learningStore.getState().ensureInitialized();
  }, []);
  return state;
}
export const useStore = Object.assign(useLearningStore, learningStore);
