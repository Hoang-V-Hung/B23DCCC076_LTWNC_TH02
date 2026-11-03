import { create } from 'zustand';
import type { Exercise } from '../../types';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,

  startSession: (exercises, startIndex) => {
    if (!exercises.length) {
      set({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 });
      return;
    }
    const index = Number.isFinite(startIndex) ? Math.trunc(startIndex) : 0;
    set({
      queue: [...exercises],
      currentIndex: Math.max(0, Math.min(index, exercises.length - 1)),
      isRunning: true,
      elapsed: 0,
    });
  },

  toggleRun: () => {
    const { queue, currentIndex, isRunning, elapsed } = get();
    if (!queue.length) return;
    if (currentIndex < 0) {
      set({ currentIndex: 0, isRunning: true, elapsed: 0 });
      return;
    }
    const exercise = queue[currentIndex];
    if (!exercise) return;
    set({ isRunning: !isRunning, elapsed: elapsed >= exercise.duration ? 0 : elapsed });
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (!queue[currentIndex]) return;
    if (currentIndex === queue.length - 1) {
      set({ isRunning: false });
      return;
    }
    set({ currentIndex: currentIndex + 1, elapsed: 0 });
  },

  prev: () => {
    const { queue, currentIndex, elapsed } = get();
    if (!queue[currentIndex]) return;
    set({ currentIndex: elapsed > 3 ? currentIndex : Math.max(0, currentIndex - 1), elapsed: 0 });
  },

  addToSession: (exercise) => {
    if (get().queue.some((item) => item.id === exercise.id)) return;
    set((state) => ({ queue: [...state.queue, exercise] }));
  },

  tick: () => {
    const { queue, currentIndex, isRunning, elapsed } = get();
    const exercise = queue[currentIndex];
    if (!isRunning || !exercise) return;
    const nextElapsed = Math.min(elapsed + 1, exercise.duration);
    set({ elapsed: nextElapsed });
    if (nextElapsed >= exercise.duration) get().next();
  },
}));
