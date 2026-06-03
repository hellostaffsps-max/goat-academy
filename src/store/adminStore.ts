"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lessons as defaultLessons, type Lesson } from "@/data/coffeeData";

export interface Cafe {
  id: string;
  name: string;
  city: string;
  description: string;
  image?: string;
  date: string;
}

interface AdminState {
  isAuthenticated: boolean;
  adminPassword: string;
  cafes: Cafe[];
  lessons: Lesson[];
  login: (password: string) => boolean;
  logout: () => void;
  setPassword: (password: string) => void;
  addCafe: (cafe: Omit<Cafe, "id">) => void;
  updateCafe: (id: string, cafe: Partial<Cafe>) => void;
  deleteCafe: (id: string) => void;
  addLesson: (lesson: Omit<Lesson, "id">) => void;
  updateLesson: (id: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminPassword: "admin123",
      cafes: [
        {
          id: "cafe-1",
          name: "مقهى التجربة الأولى",
          city: "رام الله",
          description: "أول مقهى تم العمل معه في تأسيس المنيو وتدريب الفريق",
          date: "2025-01-15",
        },
      ],
      lessons: defaultLessons,
      login: (password) => {
        if (password === get().adminPassword) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      setPassword: (password) => set({ adminPassword: password }),
      addCafe: (cafe) =>
        set((state) => ({
          cafes: [...state.cafes, { ...cafe, id: `cafe-${Date.now()}` }],
        })),
      updateCafe: (id, cafe) =>
        set((state) => ({
          cafes: state.cafes.map((c) => (c.id === id ? { ...c, ...cafe } : c)),
        })),
      deleteCafe: (id) =>
        set((state) => ({
          cafes: state.cafes.filter((c) => c.id !== id),
        })),
      addLesson: (lesson) =>
        set((state) => ({
          lessons: [...state.lessons, { ...lesson, id: `lesson-${Date.now()}` }],
        })),
      updateLesson: (id, lesson) =>
        set((state) => ({
          lessons: state.lessons.map((l) => (l.id === id ? { ...l, ...lesson } : l)),
        })),
      deleteLesson: (id) =>
        set((state) => ({
          lessons: state.lessons.filter((l) => l.id !== id),
        })),
    }),
    {
      name: "goatjourney-admin",
      partialize: (state) => ({
        adminPassword: state.adminPassword,
        cafes: state.cafes,
        lessons: state.lessons,
      }),
    }
  )
);
