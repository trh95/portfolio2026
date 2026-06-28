import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroDetonatorProps {
  exploded: boolean;
}

export default function HeroDetonator({ exploded }: HeroDetonatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<SVGGElement>(null);
  const eagleRef = useRef<SVGSVGElement>(null);
  const vultureRef = useRef<SVGGElement>(null);
  const leftWingRef = useRef<SVGGElement>(null);
  const rightWingRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);

  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isIPadPro = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    if (isIOSDevice || isIPadPro) {
      setIsIOS(true);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (exploded) {
        // Freeze everything in the final exploded/landed state instantly
        gsap.set(handleRef.current, { y: 40 });
        gsap.set(vultureRef.current, { x: 0, y: 0, scale: 1, rotation: 0 });
        gsap.set(leftWingRef.current, { rotation: 0 });
        gsap.set(rightWingRef.current, { rotation: 0 });
        gsap.set(headRef.current, { rotation: 0 });

        // Gentle, looping idle "living creature" animations when viewed on screen
        const idleTl = gsap.timeline({
          repeat: -1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play pause play pause'
          }
        });

        // Breathing cycle (subtle up & down and wing tuck/expand)
        idleTl.to(vultureRef.current, {
          y: -1.5,
          duration: 1.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1
        }, 0);

        idleTl.to(leftWingRef.current, {
          rotation: -1,
          transformOrigin: '100% 50%',
          duration: 1.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1
        }, 0);

        idleTl.to(rightWingRef.current, {
          rotation: 1,
          transformOrigin: '0% 50%',
          duration: 1.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1
        }, 0);

        // Subtly tilt head or bob at 3.6 seconds
        idleTl.to(headRef.current, {
          rotation: -5,
          transformOrigin: '0% 100%',
          duration: 0.5,
          ease: 'power2.out'
        }, 3.6);

        idleTl.to(headRef.current, {
          rotation: 3,
          transformOrigin: '0% 100%',
          duration: 0.4,
          ease: 'power1.inOut'
        }, 4.4);

        idleTl.to(headRef.current, {
          rotation: 0,
          transformOrigin: '0% 100%',
          duration: 0.5,
          ease: 'sine.inOut'
        }, 5.1);

        // Quick minor wing rustle/feather flutter at 6.0s
        idleTl.to(leftWingRef.current, {
          rotation: 4,
          duration: 0.12,
          repeat: 3,
          yoyo: true,
          ease: 'power1.inOut'
        }, 6.0);

        idleTl.to(rightWingRef.current, {
          rotation: -4,
          duration: 0.12,
          repeat: 3,
          yoyo: true,
          ease: 'power1.inOut'
        }, 6.0);

      } else {
        // Normal scroll-animated behavior:
        // Vulture starts completely off-screen, small, and invisible, then swoops in via a curved trajectory
        const startX = window.innerWidth * 0.7;
        const startY = -window.innerHeight - 150; // Guaranteed off-screen on all devices

        // Continuous high-quality time-based wing flap animation managed dynamically
        let wingFlapTl: gsap.core.Timeline | null = null;

        const startFlapping = () => {
          if (wingFlapTl) return; // Already flapping
          wingFlapTl = gsap.timeline({ repeat: -1 });
          wingFlapTl.to(leftWingRef.current, {
            rotation: 30,
            transformOrigin: '0% 0%',
            duration: 0.14,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
          }, 0);
          wingFlapTl.to(rightWingRef.current, {
            rotation: -30,
            transformOrigin: '0% 0%',
            duration: 0.14,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
          }, 0);
        };

        const stopFlapping = () => {
          if (wingFlapTl) {
            wingFlapTl.kill();
            wingFlapTl = null;
          }
          // Smoothly fold wings into resting state
          gsap.to(leftWingRef.current, { rotation: 0, duration: 0.15, overwrite: 'auto', transformOrigin: '0% 0%' });
          gsap.to(rightWingRef.current, { rotation: 0, duration: 0.15, overwrite: 'auto', transformOrigin: '0% 0%' });
        };

        const vultureTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'top+=420 top',
            scrub: 0.6, // Butter-smooth scrolling interpolation
            onUpdate: (self) => {
              const p = self.progress;
              if (p < 0.96) {
                // Flying / swooping: resume natural flapping
                startFlapping();
              } else {
                // Landed: pause flapping and smoothly fold wings into resting state
                stopFlapping();
              }
            }
          }
        });

        // 1. Horizontal movement, scaling, rotation, and fading in (Power2 ease)
        vultureTl.fromTo(vultureRef.current, {
          x: startX,
          scale: 0.3,
          opacity: 0,
          rotation: -40,
        }, {
          x: 0,
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.0,
          ease: 'power2.out',
        }, 0);

        // 2. Vertical movement animated with different ease to form a gorgeous organic curved swoop path!
        vultureTl.fromTo(vultureRef.current, {
          y: startY,
        }, {
          y: 0,
          duration: 1.0,
          ease: 'sine.out',
        }, 0);

        // Animate the plunger down as the user scrolls, driven by the vulture's landing weight
        gsap.fromTo(handleRef.current, {
          y: 0
        }, {
          y: 40, // push down
          ease: 'power1.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top+=390 top', // starts precisely as the vulture settles on the plunger
            end: 'top+=590 top',   // pushed down over 200px of scrolling
            scrub: 0.6,
          }
        });
      }

      // Gently sway clouds and have a floating eagle (always active)
      gsap.to(eagleRef.current, {
        x: '30vw',
        y: '-10vh',
        rotation: 3,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [exploded]);

  return (
    <section 
      ref={containerRef}
      id="hero"
      className="relative w-full h-[100vh] min-h-[700px] overflow-hidden bg-gradient-to-b from-desert-sky-start to-desert-sky-end flex flex-col justify-between"
    >
      {/* Sky Details (Sun, Clouds, Floating Eagle) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft glowing sun */}
        <div className="absolute top-[15%] left-[20%] w-32 h-32 rounded-full bg-orange-100/50 blur-3xl" />
        
        {/* Vector Cloud 1 */}
        <div className="absolute top-[10%] left-[8%] opacity-30 animate-pulse duration-[8s]">
          <svg width="200" height="100" fill="white" viewBox="0 0 100 50">
            <path d="M 10 40 A 15 15 0 0 1 35 25 A 25 25 0 0 1 75 25 A 15 15 0 0 1 90 40 Z" />
          </svg>
        </div>

        {/* Vector Cloud 2 */}
        <div className="absolute top-[25%] right-[10%] opacity-25">
          <svg width="280" height="140" fill="white" viewBox="0 0 100 50">
            <path d="M 5 45 A 20 20 0 0 1 35 20 A 30 30 0 0 1 80 20 A 20 20 0 0 1 95 45 Z" />
          </svg>
        </div>

        {/* Floating Eagle flying high */}
        <svg 
          ref={eagleRef}
          className="absolute top-[20%] left-[45%] w-20 h-10 fill-stone-900" 
          viewBox="0 0 200 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Detailed eagle vector outline flapping style */}
          <path d="M 0 40 C 20 30, 40 10, 80 30 C 90 35, 100 35, 110 30 C 150 10, 170 30, 200 40 C 170 45, 150 45, 110 40 C 100 38, 90 38, 80 40 C 40 45, 20 45, 0 40 Z" />
        </svg>
      </div>

      {/* Layered Desert Mesa Mountains (Background) */}
      <div className="absolute bottom-[30%] left-0 w-full h-[50%] pointer-events-none z-10">
        <svg 
          className="w-full h-full min-w-[1200px]" 
          viewBox="0 0 1440 400" 
          preserveAspectRatio="none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deep distant red plateaus */}
          <path d="M 0 350 L 0 250 L 150 200 L 250 220 L 320 180 L 450 240 L 590 150 L 750 220 L 900 130 L 1100 230 L 1250 170 L 1440 250 L 1440 400 L 0 400 Z" fill="#9c4d2d" opacity="0.6" />
          {/* Mid-ground golden clay mesas */}
          <path d="M 0 370 L 0 280 L 100 280 L 150 240 L 220 240 L 280 290 L 450 290 L 520 230 L 680 230 L 760 300 L 980 300 L 1050 220 L 1200 220 L 1300 280 L 1440 280 L 1440 400 L 0 400 Z" fill="#b96a3a" opacity="0.8" />
          {/* Foreground mesas */}
          <path d="M 0 380 L 0 320 Z" fill="#cd723b" />
        </svg>
      </div>

      {/* Hero Welcome Text Layer */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center select-none">
        <p className="text-emerald-950 font-display font-semibold uppercase tracking-wider text-sm md:text-base opacity-90 mb-1">
          Welcome to my
        </p>
        <h1 className="text-slate-950 text-6xl md:text-8xl tracking-tighter uppercase serif-heading">
          Website.
        </h1>
      </div>

      {/* Desert Floor and Flanking Cacti */}
      <div className={`relative w-full h-[32%] flex flex-col justify-end bg-transparent ${isIOS ? 'z-30' : ''}`}>
        {/* Desert Floor Backdrop (becoming the sand layer base below the fuse) */}
        <div className="absolute inset-0 bg-[#e4943f] z-[1] select-none pointer-events-none">
          {/* Curved Sand Transition Line */}
          <div className="absolute top-0 left-0 w-full transform -translate-y-[90%] pointer-events-none">
            <svg className="w-full h-24" viewBox="0 0 1440 100" preserveAspectRatio="none" fill="none">
              <path d="M0 60 C 360 10, 720 110, 1440 60 L 1440 100 L 0 100 Z" fill="#e4943f" />
            </svg>
          </div>
        </div>

        {/* Flanking Cactus Left */}
        <div className="absolute bottom-[80%] left-[10%] md:left-[15%] w-16 md:w-24 pointer-events-none scale-90 md:scale-100 z-20">
          <svg viewBox="0 0 140 150" className="w-full h-full fill-cactus-green stroke-slate-900 stroke-[3]">
            {/* Trunk */}
            <rect x="40" y="30" width="20" height="110" rx="10" />
            {/* Left arm */}
            <path d="M 40 80 H 20 A 10 10 0 0 1 10 70 V 45 A 10 10 0 0 1 30 45 V 60 H 40" />
            {/* Right arm */}
            <path d="M 60 95 H 80 A 10 10 0 0 0 90 85 V 60 A 10 10 0 0 0 70 60 V 75 H 60" />
            {/* Ground mound */}
            <ellipse cx="50" cy="140" rx="35" ry="10" fill="#a25c35" stroke="none" />
          </svg>
        </div>

        {/* Flanking Cactus Right */}
        <div className="absolute bottom-[20%] right-[10%] md:right-[15%] w-16 md:w-24 pointer-events-none scale-90 md:scale-110 z-20">
          <svg viewBox="0 0 100 150" className="w-full h-full fill-cactus-green stroke-slate-900 stroke-[3]">
            {/* Trunk */}
            <rect x="40" y="20" width="20" height="120" rx="10" />
            {/* Left arm */}
            <path d="M 40 95 H 15 A 10 10 0 0 1 5 85 V 50 A 10 10 0 0 1 25 50 V 75 H 40" />
            {/* Right arm */}
            <path d="M 60 75 H 85 A 10 10 0 0 0 95 65 V 40 A 10 10 0 0 0 75 40 V 55 H 60" />
            {/* Ground mound */}
            <ellipse cx="50" cy="140" rx="35" ry="10" fill="#a25c35" stroke="none" />
          </svg>
        </div>

        {/* Small shrubs */}
        <div className="absolute bottom-[18%] left-[28%] md:left-[32%] w-8 h-6 opacity-85 z-20">
          <svg viewBox="0 0 40 30" className="fill-emerald-900">
            <circle cx="15" cy="20" r="10" />
            <circle cx="25" cy="18" r="9" />
            <circle cx="20" cy="12" r="8" />
          </svg>
        </div>
        <div className="absolute bottom-[16%] right-[25%] md:right-[30%] w-10 h-8 opacity-80 z-20">
          <svg viewBox="0 0 40 30" className="fill-emerald-900">
            <circle cx="15" cy="20" r="11" />
            <circle cx="28" cy="22" r="9" />
            <circle cx="22" cy="14" r="10" />
          </svg>
        </div>

        {/* Central Detonator Unit */}
        <div className="relative mx-auto mb-1 flex flex-col items-center z-20">
          {/* SVG representation of detonator box and movable plunger */}
          <div className="w-24 md:w-32 h-36 md:h-44 relative">
            <svg 
              className="w-full h-full overflow-visible"
              viewBox="0 0 120 180" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Animated Plunger Handle & Shaft */}
              <g ref={handleRef}>
                {/* Silver Metal shaft */}
                <rect x="56" y="20" width="8" height="50" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
                {/* Dark T-Bar handle */}
                <rect x="30" y="8" width="60" height="12" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
                {/* Little center joint */}
                <circle cx="60" cy="14" r="5" fill="#1e293b" />

                {/* Highly detailed Majestic Vulture designed to fly onto T-bar handle and sink it down */}
                <g ref={vultureRef}>
                  <g transform="translate(60, 8)">
                    
                    {/* Left Wing jointed at anchor -14, -28 */}
                    <g transform="translate(-14, -28)">
                      <g ref={leftWingRef}>
                        {/* Outer feathers silhouette */}
                        <path 
                          d="M 0 0 C -18 -6, -34 14, -28 40 C -22 55, -6 45, 0 0 Z" 
                          fill="#1c1917" 
                          stroke="#0f172a" 
                          strokeWidth="1.5" 
                        />
                        {/* Accent/inner highlight wings */}
                        <path 
                          d="M -5 3 C -19 3, -25 19, -22 39 C -18 49, -8 44, -5 3 Z" 
                          fill="#383533" 
                        />
                      </g>
                    </g>

                    {/* Right Wing jointed at anchor 14, -28 */}
                    <g transform="translate(14, -28)">
                      <g ref={rightWingRef}>
                        {/* Outer feathers silhouette */}
                        <path 
                          d="M 0 0 C 18 -6, 34 14, 28 40 C 22 55, 6 45, 0 0 Z" 
                          fill="#1c1917" 
                          stroke="#0f172a" 
                          strokeWidth="1.5" 
                        />
                        {/* Accent/inner highlight wings */}
                        <path 
                          d="M 5 3 C 19 3, 25 19, 22 39 C 18 49, 8 44, 5 3 Z" 
                          fill="#383533" 
                        />
                      </g>
                    </g>

                    {/* Yellow Vulture Legs */}
                    <line x1="-8" y1="-8" x2="-8" y2="0" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                    <line x1="8" y1="-8" x2="8" y2="0" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Claws gripping T-bar tightly */}
                    <path d="M -11 0 C -11 2, -7 2, -6 0 M -9 0 C -9 3, -5 3, -5 0" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 5 0 C 6 2, 10 2, 11 0 M 7 0 C 7 3, 11 3, 11 0" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Hunched Scavenger Body */}
                    <path 
                      d="M -16 -28 C -24 -16, -15 -4, 0 -2 C 15 -4, 24 -16, 16 -28 C 12 -38, -12 -38, -16 -28 Z" 
                      fill="#292524" 
                      stroke="#0f172a" 
                      strokeWidth="2" 
                    />

                    {/* Feathery gray/white collar ruff */}
                    <path 
                      d="M -12 -31 C -15 -35, -8 -39, 0 -37 C 8 -39, 15 -35, 12 -31 C 15 -27, 8 -25, 0 -27 C -8 -25, -15 -27, -12 -31 Z" 
                      fill="#e2e8f0" 
                      stroke="#64748b" 
                      strokeWidth="1" 
                    />

                    {/* Slender curved bald pink neck */}
                    <path 
                      d="M -5 -31 C -9 -38, 0 -46, 6 -45 C 8 -43, 5 -36, 1 -31 Z" 
                      fill="#fda4af" 
                      stroke="#e11d48" 
                      strokeWidth="1" 
                    />
                    
                    {/* Neck wrinkle lines */}
                    <path d="M -3 -35 Q 1 -36, 2 -33" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
                    <path d="M -1 -39 Q 3 -40, 4.5 -37" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
                    <path d="M 2 -43 Q 5 -44, 6 -41" fill="none" stroke="#f43f5e" strokeWidth="1.2" />

                    {/* Sinister pink bald head & hooked yellow beak */}
                    <g ref={headRef} transform="translate(7, -46)">
                      {/* Bald Head */}
                      <circle cx="2" cy="-2" r="5" fill="#fda4af" stroke="#e11d48" strokeWidth="0.8" />
                      {/* Eye (small but sharp) */}
                      <circle cx="3" cy="-3" r="1" fill="#0f172a" />
                      <path d="M 1.5 -4.5 L 4 -3.8" stroke="#be123c" strokeWidth="0.8" />
                      {/* Scavenger's yellow hooked beak */}
                      <path 
                        d="M 6 -4 C 11 -4, 12 1, 7 4 L 4 1 C 5 -1, 5 -2.5, 3 -2.5 Z" 
                        fill="#fbbf24" 
                        stroke="#b45309" 
                        strokeWidth="0.8" 
                      />
                    </g>
                  </g>
                </g>
              </g>

              {/* Wooden Detonator Box (Statics base) */}
              <rect x="25" y="70" width="70" height="90" rx="5" fill="#b45309" stroke="#1e293b" strokeWidth="3" />
              {/* Box wood texture accent lines */}
              <line x1="32" y1="78" x2="32" y2="152" stroke="#78350f" strokeWidth="2" />
              <line x1="88" y1="78" x2="88" y2="152" stroke="#78350f" strokeWidth="2" />
              
              {/* Beveled Top base guard */}
              <polygon points="18,70 102,70 94,64 26,64" fill="#78350f" stroke="#1e293b" strokeWidth="2" />

              {/* Red TNT Label Block */}
              <rect x="35" y="90" width="50" height="42" rx="3" fill="#dc2626" stroke="#1e293b" strokeWidth="2" />
              
              {/* Standard text elements for "TNT" */}
              <text 
                x="60" 
                y="120" 
                fill="white" 
                fontSize="18" 
                fontWeight="900" 
                fontFamily="sans-serif"
                textAnchor="middle" 
                letterSpacing="1"
              >
                TNT
              </text>

              {/* Little outlet valve at bottom where fuse wire exits */}
              <rect x="53" y="160" width="14" height="8" fill="#475569" stroke="#1e293b" strokeWidth="2" />
              <circle cx="60" cy="164" r="3" fill="#1e293b" />
              {/* Fallback hidden indicator inside SVG */}
              <circle cx="60" cy="164" r="1.5" opacity="0" className="pointer-events-none" />
            </svg>
            {/* Standard HTML absolute anchor point to bypass iOS/Safari nested SVG getBoundingClientRect() coordinate bugs */}
            <div 
              id="detonator-anchor" 
              className="absolute pointer-events-none w-1 h-1"
              style={{ left: '50%', top: '91.11%', transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
