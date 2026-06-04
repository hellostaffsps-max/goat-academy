"use client";

import { create } from "zustand";
import {
  getUserFavorites,
  toggleUserFavorite,
  getUserProgress,
  toggleUserProgress,
  getUserSettings,
  updateUserSettings,
} from "@/actions/user-data";
import { checkBadges } from "@/lib/badges";

interface AppState {
  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected category filter
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;

  // Completed lessons (progress tracking)
  completedLessons: string[];
  toggleCompleted: (id: string) => Promise<void>;
  isCompleted: (id: string) => boolean;

  // Badges / Achievements
  badges: string[];
  awardBadges: () => void;
  hasBadge: (id: string) => boolean;

  // Quiz tracking
  quizPassed: string[];
  markQuizPassed: (pathId: string) => void;

  // Tool usage tracking
  toolsUsed: string[];
  trackToolUsage: (toolId: string) => void;

  // Daily plan progress
  dailyProgress: number;
  setDailyProgress: (n: number) => void;

  // Settings
  settings: {
    fontSize: "small" | "medium" | "large";
    reducedMotion: boolean;
  };
  updateSettings: (s: Partial<AppState["settings"]>) => Promise<void>;

  // Auth sync
  syncFromServer: () => Promise<void>;
  clearData: () => void;
}

export const useStore = create<AppState>()((set, get) => ({
  // Defaults
  favorites: [],
  searchQuery: "",
  selectedCategory: null,
  completedLessons: [],
  badges: [],
  quizPassed: [],
  toolsUsed: [],
  dailyProgress: 0,
  settings: {
    fontSize: "medium",
    reducedMotion: false,
  },

  toggleFavorite: async (id) => {
    try {
      const isNowFav = await toggleUserFavorite(id);
      set((state) => ({
        favorites: isNowFav
          ? [...state.favorites, id]
          : state.favorites.filter((f) => f !== id),
      }));
    } catch {
      // Fallback: if not authenticated, toggle locally only
      set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((f) => f !== id)
          : [...state.favorites, id],
      }));
    }
  },

  isFavorite: (id) => get().favorites.includes(id),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  toggleCompleted: async (id) => {
    try {
      const isNowCompleted = await toggleUserProgress(id);
      set((state) => {
        const completedLessons = isNowCompleted
          ? [...state.completedLessons, id]
          : state.completedLessons.filter((c) => c !== id);
        // Re-check badges after completion
        const newBadges = checkBadges({
          completedLessons,
          quizPassed: state.quizPassed,
          toolsUsed: state.toolsUsed,
        });
        return { completedLessons, badges: newBadges };
      });
    } catch {
      // Fallback: if not authenticated, toggle locally only
      set((state) => {
        const completedLessons = state.completedLessons.includes(id)
          ? state.completedLessons.filter((c) => c !== id)
          : [...state.completedLessons, id];
        const newBadges = checkBadges({
          completedLessons,
          quizPassed: state.quizPassed,
          toolsUsed: state.toolsUsed,
        });
        return { completedLessons, badges: newBadges };
      });
    }
  },

  isCompleted: (id) => get().completedLessons.includes(id),

  awardBadges: () => {
    const { completedLessons, quizPassed, toolsUsed } = get();
    const newBadges = checkBadges({ completedLessons, quizPassed, toolsUsed });
    set({ badges: newBadges });
  },

  hasBadge: (id) => get().badges.includes(id),

  markQuizPassed: (pathId) => {
    set((state) => {
      if (state.quizPassed.includes(pathId)) return state;
      const quizPassed = [...state.quizPassed, pathId];
      const newBadges = checkBadges({
        completedLessons: state.completedLessons,
        quizPassed,
        toolsUsed: state.toolsUsed,
      });
      return { quizPassed, badges: newBadges };
    });
  },

  trackToolUsage: (toolId) => {
    set((state) => {
      if (state.toolsUsed.includes(toolId)) return state;
      const toolsUsed = [...state.toolsUsed, toolId];
      const newBadges = checkBadges({
        completedLessons: state.completedLessons,
        quizPassed: state.quizPassed,
        toolsUsed,
      });
      return { toolsUsed, badges: newBadges };
    });
  },

  setDailyProgress: (n) => set({ dailyProgress: n }),

  updateSettings: async (s) => {
    const newSettings = { ...get().settings, ...s };
    set({ settings: newSettings });
    try {
      await updateUserSettings({
        fontSize: newSettings.fontSize,
        reducedMotion: newSettings.reducedMotion,
      });
    } catch {
      // Silently fail if not authenticated
    }
  },

  syncFromServer: async () => {
    try {
      const [favorites, progress, settings] = await Promise.all([
        getUserFavorites(),
        getUserProgress(),
        getUserSettings(),
      ]);
      const badges = checkBadges({
        completedLessons: progress,
        quizPassed: get().quizPassed,
        toolsUsed: get().toolsUsed,
      });
      set({
        favorites,
        completedLessons: progress,
        badges,
        settings: settings
          ? {
              fontSize: settings.font_size as "small" | "medium" | "large",
              reducedMotion: settings.reduced_motion,
            }
          : get().settings,
      });
    } catch {
      // If not authenticated, keep local state
    }
  },

  clearData: () =>
    set({
      favorites: [],
      completedLessons: [],
      badges: [],
      quizPassed: [],
      toolsUsed: [],
      dailyProgress: 0,
      settings: { fontSize: "medium", reducedMotion: false },
    }),
}));
