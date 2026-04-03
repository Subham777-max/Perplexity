import { createSlice } from '@reduxjs/toolkit';

const THEME_STORAGE_KEY = 'app-theme-preference';

// Initialize theme from localStorage or system preference
const getInitialTheme = () => {
  // Check localStorage
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // Default to light
  return 'light';
};

const initialState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, action.payload);
      applyThemeToDOM(action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyThemeToDOM(newTheme);
    },
  },
});

// Helper function to apply theme to DOM body
const applyThemeToDOM = (theme) => {
  const body = document.body;
  body.classList.remove('light', 'dark');
  body.classList.add(theme);
};

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
