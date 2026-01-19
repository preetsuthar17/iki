import { THEME_STORAGE_KEY, DEFAULT_THEME } from "@/lib/types/theme";

const themeScript = `
(function() {
  const storageKey = "${THEME_STORAGE_KEY}";
  const defaultTheme = "${DEFAULT_THEME}";

  function getTheme() {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") return stored;
    if (stored === "system" || !stored) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return defaultTheme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : defaultTheme;
  }

  const theme = getTheme();
  document.documentElement.classList.add(theme);
})();
`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
