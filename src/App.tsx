// App.tsx

import { useState, useContext, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

import { ExchangeRateProvider } from "./lib/ExchangeRateContext";
import { SettingsProvider, SettingsContext } from "./lib/SettingsContext";
import { useApplyTheme } from "./hooks/useApplyTheme";

import { Dashboard } from "./components/Dashboard";
import { AccountsManager } from "./components/AccountsManager";
import { IncomeTracker } from "./components/IncomeTracker";
import { ExpenseTracker } from "./components/ExpenseTracker";
import { FriendTransactions } from "./components/FriendTransactions";
import { BudgetGoals } from "./components/BudgetGoals";
import { SavingsGoals } from "./components/SavingsGoals";
import { Analytics } from "./components/Analytics";
import { EnhancedAnalytics } from "./components/EnhancedAnalytics";
import { SmartSearch } from "./components/SmartSearch";

import { Sidebar } from "./components/Sidebar";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { login, signup } from "./lib/api";
import { useToast } from "@/hooks/use-toast";

// ---------- Auth Utilities ----------
const isAuthenticated = () => !!localStorage.getItem("token");

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ---------- Auth Pages ----------
function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-foreground sm:p-6">
      <div className="bg-card border border-border rounded-xl shadow-lg p-6 w-full max-w-md sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            try {
              const result = await login({ email, password });
              localStorage.setItem("token", result.token);
              localStorage.setItem("user", JSON.stringify(result.user));
              toast({
                title: "Login successful",
                description: `Welcome, ${result.user.name}!`,
              });
              navigate("/dashboard");
            } catch {
              setError("Invalid email or password");
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 w-full min-w-0 px-4 rounded border bg-muted text-foreground"
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10 w-full min-w-0 px-4 rounded border bg-muted text-foreground"
          />
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-emerald-500 underline hover:text-emerald-600"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    signup({ name, email, password })
      .then((result) => {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast({
          title: "Signup successful",
          description: `Welcome, ${result.user.name}!`,
        });
        navigate("/dashboard");
      })
      .catch(() => setError("Signup failed. Email may already be registered."))
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-foreground sm:p-6">
      <div className="bg-card border border-border rounded-xl shadow-lg p-6 w-full max-w-md sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10 w-full min-w-0 px-4 rounded border bg-muted text-foreground"
          />
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 w-full min-w-0 px-4 rounded border bg-muted text-foreground"
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10 w-full min-w-0 px-4 rounded border bg-muted text-foreground"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-10 w-full min-w-0 px-4 rounded border bg-muted text-foreground"
          />
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-emerald-500 underline hover:text-emerald-600"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

// ---------- Shared Layout for Protected Routes ----------
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const activeSection = location.pathname.split("/")[1] || "dashboard";
  const sidebarProps = {
    activeSection,
    setActiveSection: (section: string) => navigate("/" + section),
    setIsOpen: setIsSidebarOpen,
    isCollapsed: isSidebarCollapsed,
    setIsCollapsed: setIsSidebarCollapsed,
  };

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsSidebarOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      )
        return;
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case "d":
            event.preventDefault();
            navigate("/dashboard");
            break;
          case "i":
            if (!event.shiftKey) {
              event.preventDefault();
              navigate("/income");
            }
            break;
          case "e":
            event.preventDefault();
            navigate("/expenses");
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="flex h-screen bg-background text-foreground supports-[height:100dvh]:h-dvh">
      <div className="hidden h-full shrink-0 lg:block">
        <Sidebar {...sidebarProps} />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-2 lg:hidden">
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/10384/10384161.png"
              alt=""
              className="w-6 h-6"
            />
            <span className="text-lg font-bold text-primary">Finance</span>
          </div>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open menu"
              >
                <Menu className="size-6" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              aria-describedby={undefined}
              className="w-[min(18rem,calc(100%-2rem))] p-0 motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none [&>button:last-child]:right-2 [&>button:last-child]:top-2 [&>button:last-child]:grid [&>button:last-child]:size-10 [&>button:last-child]:place-items-center"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Sidebar {...sidebarProps} mobileFullscreen />
            </SheetContent>
          </Sheet>
        </header>
        <main className="relative min-h-0 flex-1 overflow-y-auto">
          <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6 xl:py-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------- Main Theme Wrapper with Routes ----------
function AppWithTheme() {
  return (
    <SettingsProvider>
      <AppWithThemeInner />
    </SettingsProvider>
  );
}

function AppWithThemeInner() {
  const { settings } = useContext(SettingsContext);
  useApplyTheme(settings.theme as "light" | "dark" | "system");
  const queryClient = new QueryClient();

  return (
    <ExchangeRateProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route
                path="/"
                element={
                  <div className="min-h-screen bg-background text-foreground">
                    <Index />
                  </div>
                }
              />
              <Route
                path="/about"
                element={
                  <div className="min-h-screen bg-background text-foreground">
                    <About />
                  </div>
                }
              />
              <Route
                path="/contact"
                element={
                  <div className="min-h-screen bg-background text-foreground">
                    <Contact />
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="min-h-screen bg-background text-foreground">
                    <LoginForm />
                  </div>
                }
              />
              <Route
                path="/signup"
                element={
                  <div className="min-h-screen bg-background text-foreground">
                    <SignupForm />
                  </div>
                }
              />

              {/* Protected Routes with Shared Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AccountsManager />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/income"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <IncomeTracker />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expenses"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ExpenseTracker />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/friends"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <FriendTransactions />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <BudgetGoals />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/savings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SavingsGoals />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Analytics />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/enhanced-analytics"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <EnhancedAnalytics />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SmartSearch />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </QueryClientProvider>
      </TooltipProvider>
    </ExchangeRateProvider>
  );
}

export default AppWithTheme;
