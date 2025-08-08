import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogIn, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHero = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const scrollToFeatures = () => {
    if (location.pathname === '/') {
      const featuresSection = document.getElementById('features-section');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#features-section');
    }
  };

  const navigateToAbout = () => {
    navigate('/about');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const navigateToContact = () => {
    navigate('/contact');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out ${
      isScrolled 
        ? 'px-4 py-2' 
        : 'px-4 py-4'
    }`}>
      <div className={`transition-all duration-500 ease-out ${
        isScrolled 
          ? 'max-w-4xl mx-auto bg-background/20 backdrop-blur-xl border border-emerald-400/40 rounded-3xl shadow-2xl shadow-emerald-500/30 ring-1 ring-emerald-400/20' 
          : 'max-w-7xl mx-auto'
      }`}>
        <div className={`flex items-center justify-between transition-all duration-500 ease-out ${
          isScrolled ? 'h-12 px-6' : 'h-16 px-4'
        }`}>
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToHero}
              className="flex items-center gap-3 focus:outline-none"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              aria-label="Go to hero section"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/10384/10384161.png"
                alt="Logo"
                className="w-8 h-8 rounded-lg shadow bg-transparent"
              />
              <span
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #3d997a 0%, #94e671 25%, #ffdf40 50%, #ffdf40 75%, #ff9100 100%)',
                }}
              >
                FinanceFlow
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={scrollToHero}
              className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors relative overflow-hidden group"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Home</span>
              <span className="block absolute top-full transition-transform duration-300 group-hover:-translate-y-full">Home</span>
            </button>
            <button 
              onClick={scrollToFeatures}
              className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors relative overflow-hidden group"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Features</span>
              <span className="block absolute top-full transition-transform duration-300 group-hover:-translate-y-full">Features</span>
            </button>
            <button 
              onClick={navigateToAbout}
              className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors relative overflow-hidden group"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">About</span>
              <span className="block absolute top-full transition-transform duration-300 group-hover:-translate-y-full">About</span>
            </button>
            <button 
              onClick={navigateToContact}
              className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors relative overflow-hidden group"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Contact Us</span>
              <span className="block absolute top-full transition-transform duration-300 group-hover:-translate-y-full">Contact Us</span>
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors duration-200"
              onClick={() => navigate('/login')}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button 
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors duration-200"
              onClick={() => navigate('/signup')}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 