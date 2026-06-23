import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DetonatorLogo from './DetonatorLogo';

interface HeaderProps {
  scrollToSection: (id: string) => void;
  activeSection: string;
}

export default function Header({ scrollToSection, activeSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { id: 'hero', label: 'Home', number: '01' },
    { id: 'about', label: 'About', number: '02' },
    { id: 'portfolio', label: 'Portfolio', number: '03' },
    { id: 'contact', label: 'Contact', number: '04' }
  ];

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between transition-all duration-300 pointer-events-none">
        {/* Brand Icon (Detonator Outline) */}
        <div 
          className={`${isOpen ? 'flex' : 'hidden md:flex'} items-center gap-1.5 sm:gap-2 cursor-pointer group z-50 pointer-events-auto`}
          onClick={() => {
            scrollToSection('hero');
            setIsOpen(false);
          }}
          id="brand-logo"
        >
          <DetonatorLogo 
            className={`w-8 h-10 sm:w-10 sm:h-12 transition-transform duration-300 group-hover:scale-110 ${
              isOpen ? 'text-white' : 'text-slate-900 dark:text-stone-900' 
            }`}
          />
        </div>

        {/* Desktop Nav Items - shown on MD screens and above */}
        <nav className="hidden md:flex items-center bg-black/10 p-1.5 rounded-full backdrop-blur-lg pointer-events-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-black text-white shadow-lg shadow-black/20' 
                    : 'text-slate-950 hover:bg-black/5 hover:text-black'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile/Tablet Hamburger Toggle Button - hidden on MD screens */}
        <div className="flex md:hidden items-center gap-4 z-50 pointer-events-auto ml-auto md:ml-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            id="mobile-menu-toggle"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100/85 hover:bg-stone-200 border border-stone-250 backdrop-blur-md shadow-sm transition-all duration-300 focus:outline-none pointer-events-auto"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                {isOpen ? (
                  <X className="w-5 h-5 text-stone-900" />
                ) : (
                  <Menu className="w-5 h-5 text-stone-900" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            id="mobile-nav-overlay"
            className="fixed inset-0 w-full h-full bg-[#fcf5e9]/98 dark:bg-[#1c1917]/98 backdrop-blur-xl z-40 flex flex-col justify-between p-8 pt-32 md:hidden"
          >
            {/* Custom Background Decals to evoke desert landscape (matching aesthetic) */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Nav Menu Lists */}
            <nav className="flex flex-col gap-6 mt-6">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ x: -25, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -25, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08, ease: 'easeOut' }}
                  >
                    <button
                      onClick={() => handleNavClick(item.id)}
                      id={`mobile-nav-link-${item.id}`}
                      className="group flex items-baseline gap-4 w-full text-left cursor-pointer"
                    >
                      <span className="font-mono text-xs font-semibold text-stone-500 dark:text-stone-400 tracking-wider">
                        {item.number}
                      </span>
                      <span className={`font-serif text-4xl sm:text-5xl font-black uppercase tracking-tight transition-all duration-300 ${
                        isActive 
                          ? 'text-[#5ca732] dark:text-[#78cf44]' 
                          : 'text-stone-900 dark:text-stone-100 group-hover:text-[#5ca732] group-hover:pl-2'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </nav>

            

            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
