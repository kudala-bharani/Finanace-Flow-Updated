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
    setSettings({ ...settings, theme: isDark ? "light" : "dark" } as any);
  };

  return (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8 py-3 gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-card-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          {actions}
        </div>
      </div>
    </div>
  );
};
