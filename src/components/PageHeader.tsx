import React, { ReactNode, useContext } from "react";
import { Button } from "@/components/ui/button";
import { SettingsContext } from "@/lib/SettingsContext";
import { Moon, Sun } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  const { settings, setSettings } = useContext(SettingsContext);
  const isDark = settings.theme === "dark" || (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setSettings({ ...settings, theme: isDark ? "light" : "dark" });
  };

  return (
    <header className="top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border lg:sticky">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-3 sm:flex sm:flex-wrap">
        <div className="min-w-0 sm:mr-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground break-words">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
          {isDark ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
        </Button>
        {actions && <div className="col-span-2 min-w-0 max-w-full">{actions}</div>}
      </div>
    </header>
  );
};
