import { create } from 'zustand';

export type Theme = 'day' | 'night';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('grevia_theme');
    if (saved === 'day' || saved === 'night') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'night';
    }
  }
  return 'night'; // Default theme
};

const applyThemeClass = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'night') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }
};

const initialTheme = getInitialTheme();
applyThemeClass(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'day' ? 'night' : 'day';
      localStorage.setItem('grevia_theme', nextTheme);
      applyThemeClass(nextTheme);
      return { theme: nextTheme };
    }),
  setTheme: (theme: Theme) => {
    localStorage.setItem('grevia_theme', theme);
    applyThemeClass(theme);
    set({ theme });
  },
}));
