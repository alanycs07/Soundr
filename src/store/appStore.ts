import { create } from 'zustand';

interface CleaningSession {
  id: string;
  date: Date;
  duration: number;
  type: 'quick' | 'full';
}

interface AppStore {
  cleaningSessions: CleaningSession[];
  streak: number;
  addCleaningSession: (session: Omit<CleaningSession, 'id'>) => void;
  getStreak: () => number;
}

export const useAppStore = create<AppStore>((set, get) => ({
  cleaningSessions: [],
  streak: 0,

  addCleaningSession: (session) => {
    set((state) => ({
      cleaningSessions: [
        ...state.cleaningSessions,
        {
          ...session,
          id: Date.now().toString(),
        },
      ],
    }));
  },

  getStreak: () => {
    const { cleaningSessions } = get();
    if (cleaningSessions.length === 0) return 0;
    return cleaningSessions.length;
  },
}));