import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((state) => ({
        ids: state.ids.includes(id) ? state.ids.filter((savedId) => savedId !== id) : [...state.ids, id],
      })),
    }),
    {
      name: 'workout-saved',
      partialize: (state) => ({ ids: state.ids }),
      merge: (persistedState, currentState) => {
        const saved = persistedState as { ids?: unknown } | undefined;
        const ids = Array.isArray(saved?.ids)
          ? [...new Set(saved.ids.filter((id): id is string => typeof id === 'string'))]
          : [];
        return { ...currentState, ids };
      },
    },
  ),
);
