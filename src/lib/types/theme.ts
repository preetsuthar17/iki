export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

export type ResolvedTheme = Exclude<Theme, "system">;

export const THEME_STORAGE_KEY = "iki-theme";

export const DEFAULT_THEME: Theme = "system";
