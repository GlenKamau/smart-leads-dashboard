import { useEffect } from 'react';
import { useThemeStore } from '../store/theme.store';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return <>{children}</>;
};