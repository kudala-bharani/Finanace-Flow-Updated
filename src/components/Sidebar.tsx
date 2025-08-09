import {
  Home,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  PiggyBank,
  BarChart3,
  Search,
  LineChart,
  Sun,
  Moon,
  DollarSign,
  PanelLeft,
  PanelLeftOpen,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useContext } from "react";
import { SettingsContext } from "../lib/SettingsContext";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  // When true, render a full-screen mobile-friendly menu (no side sheet)
  mobileFullscreen?: boolean;
  // When true, hide the built-in header (useful when parent renders its own)
  hideHeader?: boolean;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    color: "text-emerald-400",
    shortcut: "Ctrl+D",
  },
  {
    id: "accounts",
    label: "Accounts",
    icon: CreditCard,
    color: "text-blue-400",
  },
  {
    id: "income",
    label: "Income",
    icon: TrendingUp,
    color: "text-emerald-400",
    shortcut: "Ctrl+I",
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: TrendingDown,
    color: "text-orange-400",
    shortcut: "Ctrl+E",
  },
  { id: "friends", label: "Friends", icon: Users, color: "text-purple-400" },
  { id: "budget", label: "Budget Goals", icon: Target, color: "text-pink-400" },
  {
    id: "savings",
    label: "Savings Goals",
    icon: PiggyBank,
    color: "text-yellow-400",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "text-cyan-400",
  },
  {
    id: "enhanced-analytics",
    label: "Enhanced Analytics",
    icon: LineChart,
    color: "text-indigo-400",
  },
  { id: "search", label: "Search", icon: Search, color: "text-green-400" },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    color: "text-gray-400",
  },
];

export const Sidebar = ({
  activeSection,
  setActiveSection,
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
  mobileFullscreen = false,
  hideHeader = false,
}: SidebarProps) => {
  const { settings, setSettings } = useContext(SettingsContext);
  const isDark =
    settings.theme === "dark" ||
    (settings.theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const handleThemeToggle = () => {
    setSettings({ ...settings, theme: isDark ? "light" : "dark" });
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user_settings");
    localStorage.removeItem("signup_name");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Add more keys if needed
    window.location.href = "/"; // Redirect to home page
  };
  return (
    <TooltipProvider>
      <aside
        className={`bg-background border-r border-border flex flex-col h-screen ${
          mobileFullscreen ? "w-full" : isCollapsed ? "w-10 lg:w-12" : "w-48 lg:w-56"
        }`}
        aria-label="Sidebar navigation"
      >
        {/* Header with logo and collapse/expand button */}
        {!hideHeader && (
          <div
            className={`flex items-center justify-between p-3 lg:p-4 border-b border-border flex-shrink-0 ${
              !mobileFullscreen && isCollapsed ? "px-2 lg:px-3 justify-center" : ""
            }`}
          >
            {/* Brand */}
            {!(!mobileFullscreen && isCollapsed) && (
              <button
                className="flex items-center gap-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
                aria-label="Go to Dashboard"
                onClick={() => {
                  setActiveSection("dashboard");
                  setIsOpen(false);
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/10384/10384161.png"
                  alt="Finance Logo"
                  className="w-5 h-5 lg:w-6 lg:h-6"
                />
                <span className="text-lg lg:text-xl font-bold text-primary">
                  Finance
                </span>
              </button>
            )}

            {/* Collapse/Expand toggle (desktop-only) */}
            {!mobileFullscreen && (
              !isCollapsed ? (
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Collapse sidebar"
                      onClick={() => setIsCollapsed(true)}
                      className="ml-2 p-1 lg:p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <PanelLeft size={18} className="lg:w-4 lg:h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="ml-2 bg-black text-white dark:bg-white dark:text-black shadow-lg rounded-md px-3 py-1.5 font-medium"
                  >
                    Collapse
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Expand sidebar"
                      onClick={() => setIsCollapsed(false)}
                      className="p-1 lg:p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <PanelLeftOpen size={18} className="lg:w-4 lg:h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="ml-2 bg-black text-white dark:bg-white dark:text-black shadow-lg rounded-md px-3 py-1.5 font-medium"
                  >
                    Expand
                  </TooltipContent>
                </Tooltip>
              )
            )}
          </div>
        )}

        {/* Menu items - non-scrollable, fixed height */}
        <nav
          className={`flex flex-col gap-0.5 py-2 lg:py-3 flex-1 px-2 lg:px-3 ${
            mobileFullscreen ? "items-stretch" : isCollapsed ? "items-center" : "items-stretch"
          }`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const baseBtn = `flex items-center w-full h-9 lg:h-10 my-0.5 rounded-lg transition-all duration-200 ${
              !mobileFullscreen && isCollapsed ? "justify-center" : "gap-2.5 px-2"
            }`;
            const activeStyles = isActive
              ? "bg-muted text-foreground hover:bg-muted/80"
              : "hover:bg-muted text-muted-foreground hover:text-foreground";
            const finalBtn = `${baseBtn} ${activeStyles}`;

            return (
              <Tooltip key={item.id} delayDuration={100}>
                <TooltipTrigger asChild>
                  <button
                    className={finalBtn}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsOpen(false);
                    }}
                    aria-label={item.label}
                  >
                    <Icon
                      className={`w-4 h-4 lg:w-4 lg:h-4 ${item.color} flex-shrink-0`}
                    />
                    {(!(!mobileFullscreen && isCollapsed)) && (
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                    )}
                    {(!(!mobileFullscreen && isCollapsed)) && item.shortcut && (
                      <span className="ml-auto text-xs text-muted-foreground hidden lg:inline">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {!mobileFullscreen && isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="ml-2 bg-black text-white dark:bg-white dark:text-black shadow-lg rounded-md px-3 py-1.5 font-medium"
                  >
                    {item.label}
                    {item.shortcut && (
                      <span className="ml-2 text-xs opacity-75">
                        ({item.shortcut})
                      </span>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom section with theme toggle and logout - fixed at bottom */}
        <div
          className={`border-t border-border p-2 lg:p-3 flex-shrink-0 px-2 lg:px-3 ${
            !mobileFullscreen && isCollapsed ? "flex flex-col items-center gap-1" : ""
          }`}
        >
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                onClick={handleThemeToggle}
                className={`flex items-center gap-2.5 rounded-lg p-1.5 lg:p-2 hover:bg-muted transition-colors w-full ${
                  !mobileFullscreen && isCollapsed ? "justify-center" : "px-2"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Moon size={18} className="lg:w-4 lg:h-4" />
                ) : (
                  <Sun size={18} className="lg:w-4 lg:h-4" />
                )}
                {(!(!mobileFullscreen && isCollapsed)) && (
                  <span className="text-sm">Theme</span>
                )}
              </button>
            </TooltipTrigger>
            {!mobileFullscreen && isCollapsed && (
              <TooltipContent
                side="right"
                className="ml-2 bg-black text-white dark:bg-white dark:text-black shadow-lg rounded-md px-3 py-1.5 font-medium"
              >
                Toggle theme
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2.5 rounded-lg p-1.5 lg:p-2 hover:bg-muted transition-colors text-red-500 hover:text-red-600 w-full ${
                  !mobileFullscreen && isCollapsed ? "justify-center" : "px-2"
                }`}
                aria-label="Logout"
              >
                <LogOutIcon size={18} className="lg:w-4 lg:h-4" />
                {(!(!mobileFullscreen && isCollapsed)) && (
                  <span className="text-sm">Logout</span>
                )}
              </button>
            </TooltipTrigger>
            {!mobileFullscreen && isCollapsed && (
              <TooltipContent
                side="right"
                className="ml-2 bg-black text-white dark:bg-white dark:text-black shadow-lg rounded-md px-3 py-1.5 font-medium"
              >
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};
