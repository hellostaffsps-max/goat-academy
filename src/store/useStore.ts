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
      set((state) => ({
        completedLessons: isNowCompleted
          ? [...state.completedLessons, id]
          : state.completedLessons.filter((c) => c !== id),
      }));
    } catch {
      // Fallback: if not authenticated, toggle locally only
      set((state) => ({
        completedLessons: state.completedLessons.includes(id)
          ? state.completedLessons.filter((c) => c !== id)
          : [...state.completedLessons, id],
      }));
    }
  },

  isCompleted: (id) => get().completedLessons.includes(id),

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
      set({
        favorites,
        completedLessons: progress,
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
      dailyProgress: 0,
      settings: { fontSize: "medium", reducedMotion: false },
    }),
}));
