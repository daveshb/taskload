"use client";

import { useThemeStore } from "@/stores/theme-store";

export function ThemeToggle() {
  const { theme, toggleTheme, name } = useThemeStore();

    console.log(name)

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
    >
      Tema actual: {theme === "light" ? "🌞 Claro" : "🌙 Oscuro"}
    </button>
  );
}
