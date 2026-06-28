/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroDetonator from './components/HeroDetonator';
import AboutSection from './components/AboutSection';
import ProjectsGrid from './components/ProjectsGrid';
import FooterExplosion from './components/FooterExplosion';
import FuseOverlay from './components/FuseOverlay';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [exploded, setExploded] = useState(false);

  // Smooth scroll helper to navigate around anchor sections
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  // Intersection Observer to highlight current active scrolling section
  useEffect(() => {
    const sections = ['hero', 'about', 'portfolio', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger trigger near center screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#e4943f] text-slate-900 selection:bg-stone-900 selection:text-amber-400">
      
      {/* 1. Header Navigation */}
      <Header scrollToSection={scrollToSection} activeSection={activeSection} />

      {/* 2. Main Page Compartments Grid */}
      <main className="relative w-full">
        {/* Hero Detonator Segment */}
        <HeroDetonator exploded={exploded} />

        {/* About & Technical Badgers Segment */}
        <AboutSection />

        {/* 8 Bento Portfolio Project Cards Segment */}
        <ProjectsGrid />

        {/* Mine Entrance Cave & Explosive Reveal Segment */}
        <FooterExplosion 
          exploded={exploded} 
          setExploded={setExploded} 
        />
      </main>

      {/* 3. Global SVG Custom Dynamic Fuse Overlapping Spline */}
      <FuseOverlay setExploded={setExploded} exploded={exploded} />

    </div>
  );
}
