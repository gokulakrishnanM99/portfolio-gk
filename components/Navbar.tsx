import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Code, Briefcase, User, Layers, Award, Sun, Moon, Sparkles, Check } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMinimal, setIsMinimal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [accent, setAccent] = useState('purple');
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Initialize state based on DOM
  useEffect(() => {
    // Theme check
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    // Mode check
    const mode = document.documentElement.getAttribute('data-mode');
    const storedAccent = localStorage.getItem('minimal-accent') || 'purple';
    
    if (mode === 'minimal') {
      setIsMinimal(true);
      setAccent(storedAccent);
      document.documentElement.setAttribute('data-accent', storedAccent);
    }
  }, []);

  // Handle click outside to close theme menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const setPrimaryMode = () => {
    document.documentElement.removeAttribute('data-mode');
    document.documentElement.removeAttribute('data-accent');
    localStorage.removeItem('mode');
    setIsMinimal(false);
    setShowThemeMenu(false);
  };

  const setMinimalMode = (color: string) => {
    document.documentElement.setAttribute('data-mode', 'minimal');
    document.documentElement.setAttribute('data-accent', color);
    localStorage.setItem('mode', 'minimal');
    localStorage.setItem('minimal-accent', color);
    setAccent(color);
    setIsMinimal(true);
    setShowThemeMenu(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: User },
    { name: 'Portfolio', path: '/portfolio', icon: Code },
    { name: 'Resume', path: '/resume', icon: Briefcase },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'Works', path: '/works', icon: Layers },
  ];

  // Reordered: Red, Orange, Purple, Blue, Green
  const minimalColors = [
    { name: 'red',    hex: '#FFA7A7', label: 'Red' },
    { name: 'orange', hex: '#f4ba73', label: 'Orange' },
    { name: 'purple', hex: '#D8C6FF', label: 'Purple' },
    { name: 'blue',   hex: '#79f3d2', label: 'Blue' },
    { name: 'green',  hex: '#adffc6', label: 'Green' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold tracking-tighter flex items-center group font-logo">
              <span className="text-primary-600 dark:text-primary-500 group-hover:scale-110 transition-transform">G</span>
              {/* Changed dark:text-slate-100 to dark:text-white for better visibility in Minimal Dark mode */}
              <span className="text-slate-800 dark:text-white group-hover:scale-110 transition-transform delay-75">K</span>
            </NavLink>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-slate-900 font-semibold shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6 relative" ref={themeMenuRef}>
              {/* Minimal Mode Menu Trigger */}
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`p-2 rounded-full transition-all focus:outline-none relative ${
                  isMinimal 
                    ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-slate-800' 
                    : 'text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Change Theme Mode"
              >
                <Sparkles className={`w-5 h-5 ${isMinimal ? 'fill-current' : ''}`} />
              </button>

              {/* Theme Selection Dropdown */}
              {showThemeMenu && (
                <div className="absolute top-12 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 animate-fade-in z-50 min-w-[300px]">
                  <div className="flex items-center gap-3 p-2">
                    {/* Primary Mode Option */}
                    <button
                      onClick={setPrimaryMode}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        !isMinimal
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      Primary
                    </button>

                    {/* Divider */}
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>

                    {/* Minimal Color Swatches */}
                    <div className="flex items-center gap-2">
                      {minimalColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setMinimalMode(color.name)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 border-2 ${
                            isMinimal && accent === color.name ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.label}
                        >
                           {isMinimal && accent === color.name && (
                             <Check className="w-4 h-4 text-black/50" />
                           )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dark/Light Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden items-center gap-4">
             {/* Simplified Mobile Theme Toggle - Cycles through Primary -> Minimal Red -> Minimal Orange ... */}
             <button 
                onClick={() => {
                   if (!isMinimal) {
                     setMinimalMode('red'); // Start with the first color in array
                   } else {
                     const idx = minimalColors.findIndex(c => c.name === accent);
                     if (idx < minimalColors.length - 1) {
                       setMinimalMode(minimalColors[idx + 1].name);
                     } else {
                       setPrimaryMode();
                     }
                   }
                }}
                className={`p-2 rounded-full transition-all ${isMinimal ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
              >
                <Sparkles className={`w-5 h-5 ${isMinimal ? 'fill-current' : ''}`} />
              </button>
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-slate-800'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;