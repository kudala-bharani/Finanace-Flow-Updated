import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Menu, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuLinks = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 30);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/' && location.hash === '#features-section') {
      document.getElementById('features-section')?.scrollIntoView();
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (mobileMenuOpen) menuLinks.current?.querySelector('button')?.focus();
  }, [mobileMenuOpen]);

  const activateNavigation = (action: () => void) => () => {
    setMobileMenuOpen(false);
    action();
  };

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
    <nav aria-label="Primary" className={`sticky top-0 z-50 w-full transition-[padding-top,padding-bottom] duration-500 ease-out ${
      isScrolled 
        ? 'px-3 py-2 sm:px-4'
        : 'px-3 py-4 sm:px-4'
    }`}>
      <div className={`transition-[max-width,background-color,border-color,box-shadow] duration-500 ease-out ${
        isScrolled 
          ? 'max-w-4xl mx-auto bg-background/20 backdrop-blur-xl border border-emerald-400/40 rounded-3xl shadow-2xl shadow-emerald-500/30 ring-1 ring-emerald-400/20' 
          : 'max-w-7xl mx-auto'
      }`}>
        <div
          className={`relative flex items-center justify-between transition-[height] duration-500 ease-out ${
            isScrolled ? 'h-12 px-1 min-[375px]:px-2 sm:px-6' : 'h-16 px-1 sm:px-4'
          }`}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setMobileMenuOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && mobileMenuOpen) {
              setMobileMenuOpen(false);
              menuButton.current?.focus();
            }
          }}
        >
          {/* Logo and Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={activateNavigation(scrollToHero)}
              className="flex min-w-0 items-center gap-1.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 sm:gap-3"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              aria-label="Go to hero section"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/10384/10384161.png"
                alt="Logo"
                className="size-5 shrink-0 rounded-lg bg-transparent shadow min-[375px]:size-6 sm:size-8"
              />
              <span
                className="truncate bg-clip-text text-sm font-bold text-transparent min-[375px]:text-base sm:text-xl"
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
          <div
            id="public-navigation-links"
            ref={menuLinks}
            className={`${mobileMenuOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full z-10 mt-2 flex-col items-start gap-4 rounded-xl border border-border bg-background p-4 md:static md:mt-0 md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 lg:gap-8`}
          >
            <button 
              onClick={activateNavigation(scrollToHero)}
              className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors relative overflow-hidden group"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Home</span>
              <span aria-hidden="true" className="block absolute top-full transition-transform duration-300 group-hover:-translate-y-full">Home</span>
            </button>
            <button 
              onClick={activateNavigation(scrollToFeatures)}
              className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors relative overflow-hidden group"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Features</span>
              <span aria-hidden="true" className="block absolute top-full transition-transform duration-300 group-hover:-translate-y-full">Features</span>
            </button>
            <button 
              onClick={activateNavigation(navigateToAbout)}
              className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors relative overflow-hidden group"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">About</span>
              <span aria-hidden="true" className="block absolute top-full transition-transform duration-300 group-hover:-translate-y-full">About</span>
            </button>
            <button 
              onClick={activateNavigation(navigateToContact)}
              className="text-sm font-semibold text-foreground hover:text-emerald-500 transition-colors relative overflow-hidden group"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Contact Us</span>
              <span aria-hidden="true" className="block absolute top-full transition-transform duration-300 group-hover:-translate-y-full">Contact Us</span>
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="px-2 text-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors duration-200 max-[374px]:text-xs sm:px-3"
              onClick={() => navigate('/login')}
            >
              <LogIn className="mr-2 hidden h-4 w-4 sm:block" />
              Sign In
            </Button>
            <Button 
              size="sm"
              className="bg-emerald-500 px-2 text-white font-semibold hover:bg-emerald-600 transition-colors duration-200 max-[374px]:text-xs sm:px-3"
              onClick={() => navigate('/signup')}
            >
              <UserPlus className="mr-2 hidden h-4 w-4 sm:block" />
              Sign Up
            </Button>
            <Button
              ref={menuButton}
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="public-navigation-links"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
