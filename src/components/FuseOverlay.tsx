import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FuseOverlayProps {
  setExploded: (exploded: boolean) => void;
  exploded: boolean;
}

export default function FuseOverlay({ setExploded, exploded }: FuseOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const backgroundPathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);

  const [pathData, setPathData] = useState('');
  const [isTouch, setIsTouch] = useState(false);

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const explodedRef = useRef(exploded);
  const readyToExplodeRef = useRef(true);

  // Cache of pre-calculated path coordinates to avoid calling getPointAtLength on every scroll tick
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const numSamples = 300; // 300 points is more than enough for high fidelity lookup

  // Detect touch devices to bypass heavy SVG filters and throttle particle rates
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    explodedRef.current = exploded;
    if (exploded) {
      if (sparkRef.current) {
        sparkRef.current.style.opacity = '0';
        sparkRef.current.style.visibility = 'hidden';
      }
      const progPath = progressPathRef.current;
      if (progPath) {
        progPath.style.strokeDashoffset = '0';
      }
    } else {
      // Re-armed! Do not set readyToExplodeRef.current = true immediately 
      // if we are still at the very bottom of the page.
      const currentScroll = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const isAtBottom = maxScroll - currentScroll <= 120;
      
      if (isAtBottom) {
        readyToExplodeRef.current = false;
      } else {
        readyToExplodeRef.current = true;
      }
      const st = scrollTriggerRef.current;
      if (st) {
        st.update();
        const progress = st.progress;
        
        const progPath = progressPathRef.current;
        if (progPath) {
          const totalLength = progPath.getTotalLength();
          const currentOffset = totalLength * (1 - progress);
          progPath.style.strokeDashoffset = String(currentOffset);

          if (progress > 0.005 && progress <= 1.0) {
            try {
              const idx = Math.min(numSamples, Math.max(0, Math.round(progress * numSamples)));
              const point = pointsRef.current[idx];
              if (point && sparkRef.current) {
                sparkRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
                sparkRef.current.style.opacity = '1';
                sparkRef.current.style.visibility = 'visible';
              }
            } catch (err) {}
          } else {
            if (sparkRef.current) {
              sparkRef.current.style.opacity = '0';
              sparkRef.current.style.visibility = 'hidden';
            }
          }
        }
      }
    }
  }, [exploded]);

  useEffect(() => {
    const calculatePath = () => {
      const getAnchorCoordinates = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        return {
          x: rect.left + rect.width / 2 + scrollX,
          y: rect.top + rect.height / 2 + scrollY
        };
      };

      const p0 = getAnchorCoordinates('detonator-anchor');
      const p1 = getAnchorCoordinates('cactus-anchor');
      const p2 = getAnchorCoordinates('projects-anchor');
      const p3 = getAnchorCoordinates('projects-end-anchor');
      const p4 = getAnchorCoordinates('mine-anchor');

      if (!p0 || !p4) return;

      // Adapt points depending on layout
      const py1 = p1 ? p1 : { x: p0.x + 100, y: (p0.y + p4.y) * 0.3 };
      const py2 = p2 ? p2 : { x: p0.x - 120, y: (p0.y + p4.y) * 0.6 };
      const py3 = p3 ? p3 : { x: p4.x + 80, y: (p0.y + p4.y) * 0.8 };

      // Build smooth snake-like curved cubic-bezier route (M -> C or multiple Cs)
      const h1 = py1.y - p0.y;
      const h2 = py2.y - py1.y;
      const h3 = py3.y - py2.y;
      const h4 = p4.y - py3.y;

      const d = `
        M ${p0.x} ${p0.y}
        C ${p0.x} ${p0.y + h1 * 0.4}, ${py1.x} ${py1.y - h1 * 0.4}, ${py1.x} ${py1.y}
        C ${py1.x} ${py1.y + h2 * 0.4}, ${py2.x} ${py2.y - h2 * 0.4}, ${py2.x} ${py2.y}
        C ${py2.x} ${py2.y + h3 * 0.4}, ${py3.x} ${py3.y - h3 * 0.4}, ${py3.x} ${py3.y}
        C ${py3.x} ${py3.y + h4 * 0.4}, ${p4.x + 120} ${p4.y}, ${p4.x} ${p4.y}
      `;

      setPathData(d);
    };

    calculatePath();

    // Re-check on dynamic frame mutations
    window.addEventListener('resize', calculatePath);
    window.addEventListener('load', calculatePath);

    // Watch for internal height adjustments (e.g. text folds or image loads)
    let frameId: number;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        calculatePath();
      });
    });
    observer.observe(document.body);

    return () => {
      window.removeEventListener('resize', calculatePath);
      window.removeEventListener('load', calculatePath);
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  // Set up the GSAP scroll triggers for the progress drawing and spark positioning
  useEffect(() => {
    if (!pathData) return;

    const progPath = progressPathRef.current;
    if (!progPath) return;

    // Flush and measure length
    const totalLength = progPath.getTotalLength();
    progPath.style.strokeDasharray = String(totalLength);
    progPath.style.strokeDashoffset = String(totalLength);

    // Pre-calculate path points for O(1) rendering during scroll triggering
    try {
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= numSamples; i++) {
        const len = (i / numSamples) * totalLength;
        const pt = progPath.getPointAtLength(len);
        pts.push({ x: pt.x, y: pt.y });
      }
      pointsRef.current = pts;
    } catch (e) {
      console.warn('Could not pre-calculate path coordinates:', e);
    }

    const ctx = gsap.context(() => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: 'body',
        start: () => {
          const heroEl = document.getElementById('hero');
          const startOffset = heroEl ? heroEl.offsetHeight * 0.3 : window.innerHeight * 0.3;
          return `top+=${startOffset} top`;
        },
        end: 'bottom-=85 bottom', // Ends 85px before physical bottom to guarantee reaching 100% progress on mobile/Safari
        onUpdate: (self) => {
          if (explodedRef.current) {
            // Once exploded, do not track scroll modifications back or forth!
            return;
          }
          const progress = self.progress;

          // Trigger explosion when we hit the bottom area
          const currentScroll = window.scrollY || window.pageYOffset;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const isAtBottom = maxScroll - currentScroll <= 90; // Extremely safe threshold on mobile Safari

          if ((progress >= 0.98 || isAtBottom) && readyToExplodeRef.current) {
            readyToExplodeRef.current = false;
            setExploded(true);
            return;
          }

          // Re-arm when scrolled back up (safely out of the bottom Zone)
          const isWellAboveBottom = maxScroll - currentScroll > 120;
          if (isWellAboveBottom && progress < 0.95 && !readyToExplodeRef.current) {
            readyToExplodeRef.current = true;
          }

          // Update current strokeDashoffset instantly without any CSS delay
          const currentOffset = totalLength * (1 - progress);
          progPath.style.strokeDashoffset = String(currentOffset);

          // Extract correct coordinate pairs along route from cached array
          if (progress > 0.005 && progress <= 1.0) {
            try {
              const idx = Math.min(numSamples, Math.max(0, Math.round(progress * numSamples)));
              const point = pointsRef.current[idx];
              
              // Position the spark using hardware-accelerated translate3d
              if (point && sparkRef.current) {
                sparkRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
                sparkRef.current.style.opacity = '1';
                sparkRef.current.style.visibility = 'visible';

                // Generate custom flying sparks relative to leading coordinate
                spawnSparkParticle(point.x, point.y);
              }
            } catch (err) {
              // Ignore occasional browser SVG drawing coordinates discrepancies
            }
          } else {
            if (sparkRef.current) {
              sparkRef.current.style.opacity = '0';
              sparkRef.current.style.visibility = 'hidden';
            }
          }
        }
      });
    });

    return () => {
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [pathData, setExploded]);

  // Spawns burning flame embers relative to coordinate (direct DOM write for high performance)
  const spawnSparkParticle = (x: number, y: number) => {
    // Throttle spark rate significantly to keep mobile CPU and GPUs cool
    const threshold = isTouch ? 0.92 : 0.45;
    if (Math.random() > threshold) return;

    const container = particlesContainerRef.current;
    if (!container) return;

    const particle = document.createElement('div');
    particle.className = 'absolute w-1.5 h-1.5 rounded-full bg-amber-400 border border-amber-600 spark-particle pointer-events-none z-20';
    
    const px = x + (Math.random() - 0.5) * 16;
    const py = y + (Math.random() - 0.5) * 16;
    
    particle.style.left = '0';
    particle.style.top = '0';
    particle.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;

    container.appendChild(particle);

    // Cleanup particle after animation finishes (400ms)
    setTimeout(() => {
      if (particle.parentNode === container) {
        container.removeChild(particle);
      }
    }, 400);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 select-none">
      {/* Absolute full height SVG canvas */}
      <svg 
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full overflow-visible"
        style={{ minHeight: '100%' }}
      >
        <defs>
          {/* Glowing spark linear shader */}
          <linearGradient id="fuse-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe600" />
            <stop offset="50%" stopColor="#ff4d00" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          {/* Radial mask for extra lighting */}
          <filter id="glow-panel">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {pathData && (
          <>
            {/* 1. Underlying Braided Fuse Rope (Unburned state) */}
            <path
              ref={backgroundPathRef}
              d={pathData}
              fill="none"
              stroke="#3e2417"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="14 8"
              className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]"
            />
            {/* Thin support core thread */}
            <path
              d={pathData}
              fill="none"
              stroke="#2c1a10"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* 2. Active Glowing Burning path (Scrolled progress) */}
            <path
              ref={progressPathRef}
              d={pathData}
              fill="none"
              stroke="url(#fuse-glow)"
              strokeWidth="5.5"
              strokeLinecap="round"
              filter={isTouch ? undefined : "url(#glow-panel)"}
            />
          </>
        )}
      </svg>

      {/* 3. The Lead Spark/Flame Sizzle element floating over SVG */}
      <div 
        ref={sparkRef}
        className="absolute w-8 h-8 pointer-events-none"
        style={{
          left: 0,
          top: 0,
          transform: 'translate3d(0, 0, 0) translate(-50%, -50%)',
          opacity: 0,
          visibility: 'hidden',
          transition: 'none'
        }}
      >
        {/* Glowing flame core layers */}
        <div className="absolute inset-0.5 rounded-full bg-amber-400 animate-ping opacity-60" />
        <div className="absolute inset-1 rounded-full bg-red-500 blur-[2px] animate-pulse" />
        <div className="absolute inset-2.5 rounded-full bg-yellow-300 shadow-[0_0_12px_#fbbf24]" />
        
        {/* Spark smoke trail */}
        <div className="absolute inset-3 rounded-full bg-white opacity-95 scale-75" />
      </div>

      {/* 4. Falling spark embers in DOM space */}
      <div ref={particlesContainerRef} className="absolute inset-0 pointer-events-none overflow-visible" />
    </div>
  );
}
