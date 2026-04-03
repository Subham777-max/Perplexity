import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setTheme } from '../../../app/theme.slice';

/**
 * Custom hook for theme management
 * @returns {Object} Theme state and actions
 */
export function useTheme() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  return {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (newTheme) => dispatch(setTheme(newTheme)),
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
