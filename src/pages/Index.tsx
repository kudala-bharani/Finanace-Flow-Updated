import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  Users,
  PiggyBank,
  Search,
  Palette,
  LayoutDashboard,
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Smartphone,
  Wallet,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
// import TiltImage from '@/components/TiltImage'; // Removed TiltImage import

const features = [
  {
    icon: <LayoutDashboard className="w-8 h-8 text-emerald-500" />,
    title: "Unified Dashboard",
    desc: "Get a complete overview of your finances, recent activity, and quick actions in one place.",
    screenshot: "/screenshots/dashboard/Screenshot 2025-07-13 012510.png",
    color: "emerald",
  },
  {
    icon: <CreditCard className="w-8 h-8 text-purple-500" />,
    title: "Account Management",
    desc: "Manage multiple bank accounts, credit cards, and investment accounts in one centralized location.",
    screenshot: "/screenshots/accounts/Screenshot 2025-07-13 012547.png",
    color: "purple",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
    title: "Income Tracking",
    desc: "Easily add, categorize, and analyze your income sources with detailed insights.",
    screenshot: "/screenshots/income/Screenshot 2025-07-13 012631.png",
    color: "emerald",
  },
  {
    icon: <TrendingDown className="w-8 h-8 text-red-500" />,
    title: "Expense Tracking",
    desc: "Track expenses, set categories, and control your spending with smart categorization.",
    screenshot: "/screenshots/expenses/Screenshot 2025-07-13 012652.png",
    color: "red",
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-indigo-500" />,
    title: "Advanced Analytics",
    desc: "Visualize your financial trends with beautiful charts and actionable insights.",
    screenshot: "/screenshots/analytics/Screenshot 2025-07-13 012733.png",
    color: "indigo",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "Friend Transactions",
    desc: "Split bills, track debts, and settle up with friends easily and securely.",
    screenshot: "/screenshots/friends/Screenshot 2025-07-13 012755.png",
    color: "blue",
  },
  {
    icon: <PiggyBank className="w-8 h-8 text-pink-500" />,
    title: "Budget & Savings Goals",
    desc: "Set budgets, create savings goals, and watch your progress with visual tracking.",
    screenshot: "/screenshots/budget/Screenshot 2025-07-13 012826.png",
    color: "pink",
  },
];

const benefits = [
  { icon: <Zap className="w-5 h-5" />, text: "Real-time synchronization" },
  { icon: <Shield className="w-5 h-5" />, text: "Bank-level security" },
  { icon: <Smartphone className="w-5 h-5" />, text: "Mobile responsive" },
  { icon: <CheckCircle className="w-5 h-5" />, text: "Free forever plan" },
];

// Custom hook for cursor glow effect
const useCardTiltGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovering) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
        // Tilt logic
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        setTilt({ x: -rotateX, y: rotateY });
      }
    };
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
      setTilt({ x: 0, y: 0 });
    };
    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isHovering]);
  return { cardRef, mousePosition, isHovering, tilt };
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30"
                >
                  ✨ FinanceFlow - Personal Finance Made Simple
                </Badge>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                  Take Control of Your
                  <span className="block text-emerald-400">
                    Financial Future
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Track expenses, set budgets, and achieve your financial goals
                  with FinanceFlow. Everything you need to manage your money in
                  one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 md:px-7 md:py-3.5 xl:px-8 xl:py-4 rounded-xl flex items-center gap-2 group"
                  onClick={() => navigate("/signup")}
                >
                  <UserPlus className="w-5 h-5" />
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 font-semibold px-6 py-3 md:px-7 md:py-3.5 xl:px-8 xl:py-4 rounded-xl flex items-center gap-2"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {benefit.icon}
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              <div className="relative z-10 p-8">
                <div className="aspect-square flex items-center justify-center overflow-hidden">
                  <img
                    src="/screenshots/hero/Revenue-pana.png"
                    alt="FinanceFlow Hero Illustration"
                    className="w-full h-full object-contain p-4"
                    style={{
                      animation: "gentle-bounce 4s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Sections */}
      <section id="features-section" className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From tracking daily expenses to planning long-term goals,
              FinanceFlow has got you covered with powerful tools and insights.
            </p>
          </div>

          <div className="space-y-20 lg:space-y-24 xl:space-y-32">
            {features.map((feature, index) => {
              const { cardRef, mousePosition, isHovering, tilt } =
                useCardTiltGlow();

              return (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`space-y-6 ${
                      index % 2 === 1 ? "lg:col-start-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20`}
                      >
                        {feature.icon}
                      </div>
                      <Badge
                        variant="outline"
                        className={`border-${feature.color}-500/30 text-${feature.color}-600`}
                      >
                        Feature
                      </Badge>
                    </div>
                    <h3 className="text-3xl font-bold">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Available in all plans</span>
                    </div>
                  </div>
                  {/* Screenshot */}
                  <div
                    className={`relative ${
                      index % 2 === 1 ? "lg:col-start-1" : ""
                    }`}
                  >
                    <div
                      ref={cardRef}
                      className="relative backdrop-blur-2xl bg-white/5 border border-white/30 rounded-3xl p-3 shadow-2xl transition-all duration-300 hover:border-white/50 hover:shadow-2xl hover:shadow-white/10 overflow-hidden"
                      style={
                        {
                          "--mouse-x": `${mousePosition.x}px`,
                          "--mouse-y": `${mousePosition.y}px`,
                          perspective: "1000px",
                          transform: `rotateX(${tilt.x}deg) rotateY(${
                            tilt.y
                          }deg) scale(${isHovering ? 1.04 : 1})`,
                          transition: isHovering
                            ? "transform 0.2s cubic-bezier(.03,.98,.52,.99)"
                            : "transform 0.3s cubic-bezier(.03,.98,.52,.99)",
                        } as React.CSSProperties
                      }
                    >
                      {/* Cursor glow overlay */}
                      {isHovering && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.1), transparent 40%)`,
                            zIndex: 1,
                          }}
                        />
                      )}
                      <div className="backdrop-blur-lg bg-white/3 border border-white/15 rounded-2xl p-4 relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="text-xs text-white/70 ml-2">
                            finance-app.com
                          </div>
                        </div>
                        {/* Actual screenshot */}
                        <div className="aspect-video rounded-xl overflow-hidden border border-white/20">
                          <img
                            src={feature.screenshot}
                            alt={`${feature.title} screenshot`}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          {/* Fallback placeholder */}
                          <div className="aspect-video bg-gradient-to-br from-white/8 to-white/3 rounded-xl flex items-center justify-center hidden">
                            <div className="text-center space-y-4">
                              <div
                                className={`w-16 h-16 bg-${feature.color}-500/30 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm`}
                              >
                                {feature.icon}
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 bg-white/20 rounded w-32 mx-auto"></div>
                                <div className="h-3 bg-white/10 rounded w-24 mx-auto"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                      {/* .backdrop-blur-lg ... */}
                    </div>{" "}
                    {/* .relative (screenshot card) */}
                  </div>{" "}
                  {/* .grid (feature card row) */}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-border bg-background/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              © {new Date().getFullYear()} FinanceFlow. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
