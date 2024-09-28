import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: (changeToDarkMode?: boolean) => void;
}

const useToggleTheme = create<ThemeState>((set, get) => ({
  isDarkMode: false,
  toggleTheme: (changeToDarkMode) => {
    const isDarkMode = changeToDarkMode ?? !get().isDarkMode;
    set({ isDarkMode });
    if (isDarkMode) {
      document.documentElement.style.setProperty(
        "--background-color",
        "#0A0A0A"
      );
    } else {
      document.documentElement.style.setProperty(
        "--background-color",
        "#F5F5F5"
      );
    }
  },
}));

export default useToggleTheme;
