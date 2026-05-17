import { useThemeStore } from '../store/theme.store';

export const useDarkMode = () => {
  return useThemeStore((state) => state.isDark);
};

export const darkBg = (isDark: boolean) => isDark ? 'bg-gray-900' : 'bg-gray-100';
export const darkCard = (isDark: boolean) => isDark ? 'bg-gray-800' : 'bg-white';
export const darkText = (isDark: boolean) => isDark ? 'text-white' : 'text-gray-800';
export const darkTextMuted = (isDark: boolean) => isDark ? 'text-gray-300' : 'text-gray-600';
export const darkInput = (isDark: boolean) => isDark ? 'bg-gray-700 text-white border-gray-600' : '';
export const darkLabel = (isDark: boolean) => isDark ? 'text-gray-300' : 'text-gray-700';