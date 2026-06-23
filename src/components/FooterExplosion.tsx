import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Github, Linkedin, RefreshCw } from 'lucide-react';
import DetonatorLogo from './DetonatorLogo';

gsap.registerPlugin(ScrollTrigger);

interface FooterExplosionProps {
  fuseProgress: number; // 0 to 1 from parent scrolled wire
  exploded: boolean;
  setExploded: (exploded: boolean) => void;
}

export default function FooterExplosion({ fuseProgress, exploded, setExploded }: FooterExplosionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const explosionRef = useRef<HTMLDivElement>(null);
  const staticMineRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  
  const [particles, setParticles] = useState<{ id: number; dx: number; dy: number; size: number }[]>([]);
  const [copied, setCopied] = useState(false);
  const [readyToExplode, setReadyToExplode] = useState(true);

  // Trigger explosion details when fuse reaches the absolute bottom
  useEffect(() => {
    // If progress is near 100%, not exploded, and armed/ready
    if (fuseProgress >= 0.995 && !exploded && readyToExplode) {
      triggerExplosion();
    }
    // Prime the explosion again once the user has scrolled up slightly away from the bottom (past 98% mark)
    if (fuseProgress < 0.98 && !readyToExplode) {
      setReadyToExplode(true);
    }
  }, [fuseProgress, exploded, readyToExplode]);

  const triggerExplosion = () => {
    setExploded(true);

    // Prevent clashing animation tweens
    gsap.killTweensOf([containerRef.current, explosionRef.current, contactsRef.current]);

    // Create custom particle coordinates for debris
    const arr = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 350,
      dy: (Math.random() - 0.6) * 300,
      size: Math.random() * 12 + 4,
    }));
    setParticles(arr);

    // GSAP Blast Sequence
    const tl = gsap.timeline();
    
    // 1. Rumble screen
    tl.to(containerRef.current, {
      x: () => (Math.random() - 0.5) * 15,
      y: () => (Math.random() - 0.5) * 15,
      duration: 0.1,
      repeat: 6,
      yoyo: true,
      ease: 'none',
      onComplete: () => {
        gsap.set(containerRef.current, { x: 0, y: 0 });
      }
    });

    // 2. Explode card out
    tl.fromTo(explosionRef.current, 
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.5, 
        ease: 'back.out(1.5)'
      },
      '<'
    );

    // 3. Fade in contacts beautifully
    tl.fromTo(contactsRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    );
  };

  const resetExplosion = () => {
    setReadyToExplode(false);
    setExploded(false);
    setParticles([]);
    
    // Kill any active tweens on these elements to prevent overlapping animation states
    gsap.killTweensOf([containerRef.current, explosionRef.current, contactsRef.current]);

    // Smoothly scroll up slightly so there's distance to re-scroll and detonate again
    window.scrollTo({
      top: window.scrollY - 200,
      behavior: 'smooth'
    });
    
    // GSAP collapse back
    gsap.timeline()
      .to(contactsRef.current, { scale: 0.8, opacity: 0, duration: 0.2 })
      .to(explosionRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
  };

  return (
    <footer 
      ref={containerRef}
      id="contact" 
      className="relative w-full min-h-[95vh] bg-transparent flex flex-col justify-between py-16 overflow-hidden border-t-4 border-desert-clay"
    >
      {/* Absolute background element mountain dunes */}
      <div className="absolute inset-x-0 top-0 h-16 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 100" preserveAspectRatio="none" fill="none">
          <path d="M0 40 C 360 100, 1080 0, 1440 40 L 1440 0 L 0 0 Z" fill="#a25c35" />
        </svg>
      </div>

      {/* Main interactive visual layer */}
      <div className="w-full max-w-4xl mx-auto px-6 flex-1 flex flex-col items-center justify-center relative z-20">
        
        {/* State A: Static Mine Cave Entrance before detonating */}
        <div 
          ref={staticMineRef}
          className={`relative w-72 md:w-96 aspect-square max-w-[400px] flex items-center justify-center transition-all duration-500 ${
            exploded ? 'opacity-0 scale-90 pointer-events-none invisible' : 'opacity-100 scale-100 visible'
          }`}
        >
          <svg 
            viewBox="0 0 200 200" 
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Radial glow for the miner's lantern */}
              <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
                <stop offset="35%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
              </radialGradient>
              {/* Rocky mountain shading gradient */}
              <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#854d0e" />
                <stop offset="50%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>

            {/* Jagged, craggy outer rock base layer */}
            <path 
              d="M 10 185 L 18 150 L 12 125 L 25 100 L 20 85 L 35 68 L 52 52 L 78 45 L 98 42 L 122 46 L 148 54 L 165 72 L 178 88 L 174 108 L 188 128 L 182 154 L 192 185 Z" 
              fill="url(#rockGrad)" 
              stroke="#292524" 
              strokeWidth="3.5" 
            />

            {/* Inward Rock Face Layers for deep 3D perspective */}
            <path 
              d="M 22 184 L 28 152 L 25 130 L 36 108 L 32 94 L 46 80 L 60 66 L 82 60 L 102 58 L 122 62 L 140 68 L 154 84 L 164 104 L 160 124 L 172 152 L 168 184 Z" 
              fill="#52250c" 
            />
            
            {/* Dark inside cave tunnel */}
            <path 
              d="M 46 182 Q 44 94, 100 94 Q 156 94, 154 182 Z" 
              fill="#12100e" 
              stroke="#1c1917" 
              strokeWidth="3" 
            />

            {/* Miner's Rails exiting matching the perspective */}
            {/* Wooden Rail Ties */}
            <line x1="84" y1="184" x2="116" y2="184" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            <line x1="77" y1="190" x2="123" y2="190" stroke="#3f1902" strokeWidth="4.2" strokeLinecap="round" />
            <line x1="70" y1="196" x2="130" y2="196" stroke="#2d1101" strokeWidth="5.5" strokeLinecap="round" />
            
            {/* Steel Tracks */}
            <path d="M 88 182 Q 86 189, 74 200" stroke="#a8a29e" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 88 182 Q 86 189, 74 200" stroke="#78716c" strokeWidth="0.8" strokeLinecap="round" fill="none" />
            <path d="M 112 182 Q 114 189, 126 200" stroke="#a8a29e" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 112 182 Q 114 189, 126 200" stroke="#78716c" strokeWidth="0.8" strokeLinecap="round" fill="none" />

            {/* Rugged Timber Frames (Left, Right Posts, and Cross-timber header) */}
            {/* Left Column Post */}
            <polygon points="40,182 52,182 52,98 40,98" fill="#92400e" stroke="#1c1917" strokeWidth="2" />
            {/* Left columns inner wood lines */}
            <line x1="46" y1="102" x2="46" y2="178" stroke="#78350f" strokeWidth="1.5" />
            
            {/* Right Column Post */}
            <polygon points="148,182 160,182 148,98 160,98" fill="#92400e" stroke="#1c1917" strokeWidth="2" />
            {/* Right columns inner wood lines */}
            <line x1="154" y1="102" x2="154" y2="178" stroke="#78350f" strokeWidth="1.5" />

            {/* Support Brackets (Diagonal timber corner brace reinforcements) */}
            <polygon points="52,112 68,98 58,98 52,104" fill="#78350f" stroke="#1c1917" strokeWidth="1" />
            <polygon points="148,112 132,98 142,98 148,104" fill="#78350f" stroke="#1c1917" strokeWidth="1" />

            {/* Cross header top beam */}
            <polygon points="34,103 166,103 162,88 38,88" fill="#7c2d12" stroke="#1c1917" strokeWidth="2.2" />
            <line x1="38" y1="95" x2="162" y2="95" stroke="#451a03" strokeWidth="1.5" />

            {/* Iron bracket plates clamping wood corners */}
            <rect x="39" y="88" width="13" height="15" fill="#44403c" stroke="#1c1917" strokeWidth="1" />
            <circle cx="43" cy="95" r="1" fill="#a8a29e" />
            <circle cx="48" cy="95" r="1" fill="#a8a29e" />
            
            <rect x="148" y="88" width="13" height="15" fill="#44403c" stroke="#1c1917" strokeWidth="1" />
            <circle cx="152" cy="95" r="1" fill="#a8a29e" />
            <circle cx="157" cy="95" r="1" fill="#a8a29e" />

            {/* Wooden MINE DANGER Sign hanging askew */}
            <g transform="rotate(-4, 100, 116)">
              {/* Chains holding sign */}
              <line x1="72" y1="103" x2="72" y2="114" stroke="#57534e" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="128" y1="103" x2="128" y2="114" stroke="#57534e" strokeWidth="1.5" strokeLinecap="round" />
              
              {/* Wooden Board */}
              <rect x="64" y="112" width="72" height="24" rx="1.5" fill="#ca8a04" stroke="#1c1917" strokeWidth="1.8" />
              <rect x="66" y="114" width="68" height="20" fill="none" stroke="#78350f" strokeWidth="1" />
              
              {/* Warning Lettering */}
              <text x="100" y="123" fill="#ef4444" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.8">DANGER</text>
              <text x="100" y="130" fill="#292524" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">TNT STORAGE</text>
            </g>

            {/* Hanging Lantern (Yellow soft glow light effect on left timber beam) */}
            {/* Glowing Aura back layer */}
            <circle cx="28" cy="120" r="18" fill="url(#lanternGlow)" pointerEvents="none" />
            
            {/* Bracket hanger */}
            <path d="M 40 110 H 28 V 114" fill="none" stroke="#292524" strokeWidth="1.5" strokeLinecap="round" />
            {/* Cap & Glass structure */}
            <path d="M 24 114 H 32 L 30 112 H 26 Z" fill="#44403c" stroke="#1c1917" strokeWidth="1" />
            <rect x="25" y="114" width="6" height="8" rx="1" fill="none" stroke="#1c1917" strokeWidth="1" />
            {/* Warm core flame */}
            <ellipse cx="28" cy="118" rx="1.5" ry="2.5" fill="#f59e0b" />
            <circle cx="28" cy="118.5" r="0.8" fill="#ffffff" />
            {/* Bottom Fuel Cap */}
            <rect x="24" y="122" width="8" height="2.5" fill="#44403c" stroke="#1c1917" strokeWidth="1" />

            {/* Scattered Loose Rocks on Ground side coordinates */}
            <path d="M 28 182 Q 33 176, 38 182 Z" fill="#6b371b" stroke="#1c1917" strokeWidth="1" />
            <path d="M 166 180 Q 170 174, 174 180 Z" fill="#6b371b" stroke="#1c1917" strokeWidth="1" />
            <path d="M 158 184 Q 163 179, 166 184 Z" fill="#52250c" stroke="#1c1917" strokeWidth="1" />

            {/* Red TNT Sticks stacked inside tunnel */}
            <g id="mine-dynamite">
              {/* Stick 1 */}
              <rect x="80" y="155" width="40" height="10" rx="2" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
              {/* Stick 2 */}
              <rect x="80" y="165" width="40" height="10" rx="2" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
              {/* Stick 3 */}
              <rect x="80" y="175" width="40" height="10" rx="2" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
              {/* Yellow wire loop wrapper */}
              <path d="M 85 155 L 85 185 M 115 155 L 115 185" stroke="#facc15" strokeWidth="2" />
            </g>
          </svg>

          {/* Fuse End Anchor Target point (Placed precisely at the right side of the bottom dynamite stick) */}
          <div 
            id="mine-anchor" 
            className="absolute pointer-events-none w-1 h-1 bg-red-650/0"
            style={{ top: '90%', left: '60%', transform: 'translate(-20%, -50%)' }}
          />

          {/* Decorative scroll prompt before detonation */}
          <div className="absolute top-[-30px] font-mono text-[10px] text-stone-800 bg-[#dfd6cb]/80 border border-stone-800 px-3 py-1 rounded-md animate-bounce select-none pointer-events-none">
            Scroll completely down to detonate!
          </div>
        </div>

        {/* State B: Active Explosion Blast & Social Portal Reveal */}
        <div 
          ref={explosionRef}
          className={`absolute w-full max-w-[540px] aspect-square flex items-center justify-center ${
            exploded ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
          }`}
          style={{ transform: 'scale(0)' }}
        >
          {/* Jagged Explosion Vector Vector matching screenshots */}
          <svg 
            viewBox="0 0 300 300" 
            className="absolute inset-0 w-full h-full drop-shadow-[0_20px_35px_rgba(224,133,62,0.45)]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(20, 14)">
              {/* outer dark smoke layer */}
              <path d="M 150 10 L 180 50 L 230 40 L 220 90 L 270 100 L 240 150 L 280 180 L 230 200 L 240 250 L 190 230 L 170 280 L 130 240 L 90 280 L 80 230 L 30 240 L 50 190 L 10 170 L 50 130 L 20 80 L 70 80 L 80 30 L 120 60 Z" fill="#78350f" opacity="0.35" />
              {/* outer red flame rim */}
              <path d="M 150 25 L 175 60 L 215 52 L 205 95 L 250 105 L 222 145 L 260 175 L 215 190 L 225 235 L 180 218 L 160 260 L 125 225 L 85 260 L 78 215 L 35 222 L 52 178 L 15 160 L 52 125 L 28 82 L 72 82 L 82 35 L 120 65 Z" fill="#ef4444" />
              {/* main orange jagged flare */}
              <path d="M 150 40 L 170 75 L 200 68 L 192 105 L 230 112 L 208 145 L 240 170 L 200 182 L 208 220 L 170 206 L 152 240 L 122 210 L 88 240 L 82 202 L 45 208 L 60 170 L 28 152 L 60 122 L 40 88 L 78 88 L 88 45 L 122 72 Z" fill="#f97316" />
              {/* central hot yellow energy center (Crater center portal) */}
              <path d="M 150 55 L 165 85 L 188 80 L 180 110 L 210 118 L 192 145 L 218 165 L 185 174 L 190 202 L 160 192 L 145 220 L 120 195 L 90 218 L 88 188 L 58 192 L 70 160 L 42 145 L 70 120 L 52 95 L 85 95 L 94 58 L 122 82 Z" fill="#facc15" />
            </g>
          </svg>

          {/* Flying explosion debris sparks */}
          {particles.map((p) => (
            <div 
              key={p.id}
              className="absolute w-2 h-2 rounded-full bg-yellow-400 border border-red-500 spark-particle pointer-events-none"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                transform: `translate(${p.dx}px, ${p.dy}px)`,
                transition: 'transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s ease-out',
                opacity: exploded ? 0 : 1,
              }}
            />
          ))}

          {/* Symmetrical container centered on a pristine, mathematically aligned design space */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            {/* Active Contact portal contents nested right in the blast center */}
            <div 
              ref={contactsRef}
              className="relative text-center p-6 flex flex-col items-center justify-center pointer-events-auto max-w-[340px]"
            >
              <h5 className="font-serif text-3xl font-extrabold text-stone-900 tracking-tight leading-none uppercase mb-5">
                Contact Me
              </h5>
             

              {/* Social link circle graphics (Red colored matching images inside blast crater) */}
              <div className="flex gap-4">
                {/* Google Mail */}
                <a 
                  href="mailto:tamasrhorvath@gmail.com"
                  aria-label="Contact Email"
                 className="w-14 h-14 bg-[#1c1917] hover:bg-[#292524] text-[#facc15] hover:text-[#facc15] rounded-full border-2 border-stone-900 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/25"
                >
                  
                  <Mail className="w-6 h-6" />
                </a>

                {/* GitHub */}
                <a 
                  href="https://github.com/trh95" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Candidate GitHub"
                  className="w-14 h-14 bg-[#1c1917] hover:bg-[#292524] text-[#facc15] hover:text-[#facc15] rounded-full border-2 border-stone-900 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/25"
                >
                  <Github className="w-6 h-6" />
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/trh95/" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Candidate LinkedIn"
                  className="w-14 h-14 bg-[#1c1917] hover:bg-[#292524] text-[#facc15] hover:text-[#facc15] rounded-full border-2 border-stone-900 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/25"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          {/* Reset loop flow callback button absolutely positioned so it does not skew the central texts */}
          <button 
            onClick={resetExplosion}
            className="absolute bottom-[30%] left-1/2 -translate-x-1/2 px-4 py-2 bg-stone-950/80 hover:bg-stone-950 text-slate-300 hover:text-white rounded-full text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 transition-all shadow z-20 pointer-events-auto"
          >
            <RefreshCw className="w-3 h-3" /> Re-arm TNT
          </button>
          </div>

        </div>

      </div>

      {/* Humble, literal footer and copyrights margin branding matches the images */}
      <div className="relative text-center z-10 select-none pb-2 border-t border-black/5 pt-6 mt-16 flex flex-col items-center gap-2 max-w-xl mx-auto">
        <div className="opacity-90 transition-transform duration-300 hover:scale-110">
          <DetonatorLogo className="w-8 h-9 text-stone-900" />
        </div>
        <p className="text-stone-900 font-mono font-bold tracking-tight text-xs flex items-center gap-1 leading-none">
          © 2026 | Tamás Horváth
        </p>
      </div>
    </footer>
  );
}
