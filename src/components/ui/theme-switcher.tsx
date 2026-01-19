"use client";

import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";
import { Menu } from "@base-ui/react/menu";
import { useTheme } from "@/components/theme-provider";
import { THEMES, type Theme } from "@/lib/types/theme";
import { cn } from "@/lib/utils";

const themeConfig: Record<Theme, { icon: typeof IconSun; label: string }> = {
  light: { icon: IconSun, label: "Light" },
  dark: { icon: IconMoon, label: "Dark" },
  system: { icon: IconDeviceDesktop, label: "System" },
};

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const CurrentIcon = resolvedTheme === "dark" ? IconMoon : IconSun;

  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          "inline-flex items-center justify-center size-8 rounded-md",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-muted transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <CurrentIcon className="size-4" />
        <span className="sr-only">Change theme</span>
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup
            className={cn(
              "z-50 min-w-[7rem] overflow-hidden rounded-md",
              "border border-border bg-popover p-1 shadow-md flex flex-col gap-0.5",
              "origin-[var(--transform-origin)]",
              "transition-[transform,opacity] duration-150",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            )}
          >
            {THEMES.map((t) => {
              const { icon: Icon, label } = themeConfig[t];
              const isSelected = theme === t;

              return (
                <Menu.Item
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 text-xs rounded-sm cursor-pointer",
                    "outline-none transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground",
                    isSelected && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{label}</span>
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
