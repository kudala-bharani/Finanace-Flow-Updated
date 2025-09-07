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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="bg-card border border-border rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded border bg-muted text-foreground"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded border bg-muted text-foreground"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-emerald-500 underline">Sign up</a>
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="bg-card border border-border rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 rounded border bg-muted text-foreground" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded border bg-muted text-foreground" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded border bg-muted text-foreground" />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 rounded border bg-muted text-foreground" />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-500 underline">Login</a>
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) return;
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
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        activeSection={location.pathname.replace("/", "") || "dashboard"}
        setActiveSection={(section) => navigate("/" + section)}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <img src="https://cdn-icons-png.flaticon.com/512/10384/10384161.png" alt="Logo" className="w-6 h-6" />
            <span className="text-lg font-bold text-primary">Finance</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto h-full">
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
  useApplyTheme();
  const queryClient = new QueryClient();

  return (
    <SettingsProvider>
      <ExchangeRateProvider>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />

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
    </SettingsProvider>
  );
}

export default AppWithTheme;
