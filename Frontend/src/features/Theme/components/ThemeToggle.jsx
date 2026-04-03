import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from "lucide-react";
/**
 * Theme Toggle Button Component
 * Toggles between light and dark mode with smooth transitions
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        inline-flex items-center gap-2
        px-3 py-1.5 text-sm font-medium
        rounded-lg border transition-all duration-200
        shadow-sm cursor-pointer
        
        text-text-secondary hover:text-text-primary
        bg-tertiary hover:bg-secondary border-theme
        
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-custom-primary
        
        active:scale-95
      "
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="text-base">
        {theme === "light" ? (
            <Moon className="w-5 h-5 text-text-primary" />
        ) : (
            <Sun className="w-5 h-5 text-text-primary" />
        )}
      </span>
      <span className="hidden sm:inline">
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
