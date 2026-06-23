import React from 'react';
import { Mail, Github, Linkedin, FileText } from 'lucide-react';
import cvPdf from '../assets/Horváth Tamás CV.pdf';

export default function AboutSection() {

  return (
    <section 
      id="about" 
      className="relative w-full min-h-[90vh] py-24 px-6 md:px-16 flex items-center bg-transparent overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-20">
        
        {/* Left Column - Biography & Skills */}
        <div className="md:col-span-7 flex flex-col justify-center text-slate-900 pr-0 md:pr-4">
          <p className="text-xl font-medium tracking-tight text-desert-clay font-display mb-2">
            Nice to meet you! My name is
          </p>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-stone-900 leading-none mb-4 serif-heading">
            Tamás Horváth
          </h2>
          <p className="text-2xl md:text-3xl font-display text-stone-850 leading-relaxed max-w-xl mb-6">
            I'm a <span className="text-[#5ca732] text-4xl font-extrabold tracking-tight px-2 py-0.5/5">Frontend Developer</span> based in Hungary.
          </p>

          {/* Detailed Skill list styled nicely as desert badges */}
          <div className="mb-8 bg-black/5 p-6 rounded-2xl border border-black/5 backdrop-blur-sm max-w-xl">
            <h3 className="font-display font-semibold transition-colors uppercase tracking-wider text-xs text-desert-clay mb-3">
              Technical Arsenal / Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'HTML', 'CSS', 'Bootstrap', 'JavaScript', 
                'TypeScript', 'Angular', 'React', 'Python', 
                'MySQL', 'MongoDB', 'Git', 'GSAP', 'TailwindCSS'
              ].map((skill) => (
                <span 
                  key={skill}
                  className="px-3.5 py-1 text-sm bg-stone-900 text-[#e4943f] font-mono font-medium rounded-full border border-stone-800 shadow-md shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-stone-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links Panel & Resume Button */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex gap-4">
              {/* Google Mail */}
              <a 
                href="mailto:tamasrhorvath@gmail.com"
                aria-label="Email Address"
                className="w-12 h-12 rounded-full border-2 border-stone-900 bg-[#3b711e]/10 flex items-center justify-center text-stone-900 hover:bg-[#3b711e] hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="w-5 h-5" />
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/trh95" 
                target="_blank" 
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="w-12 h-12 rounded-full border-2 border-stone-900 bg-[#3b711e]/10 flex items-center justify-center text-stone-900 hover:bg-[#3b711e] hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <Github className="w-5 h-5" />
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/trh95/" 
                target="_blank" 
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="w-12 h-12 rounded-full border-2 border-stone-900 bg-[#3b711e]/10 flex items-center justify-center text-stone-900 hover:bg-[#3b711e] hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Premium Open Resume Action Button */}
            <a 
              href={cvPdf}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-full bg-stone-900 text-[#7ee13f] font-display font-bold text-sm tracking-wide shadow-xl shadow-black/20 hover:bg-stone-800 active:scale-95 transition-all duration-300 hover:text-white flex items-center gap-2 border border-stone-800"
            >
              <FileText className="w-4 h-4" />
              Open Resume
            </a>
          </div>
        </div>

        {/* Right Column - Beautiful Giant Saguaro Cactus Vector (The Fuse Weaving Anchor) */}
        <div className="md:col-span-5 relative flex items-center justify-center py-6">
          <div className="w-[280px] md:w-[360px] h-[400px] md:h-[500px] relative">
            <svg 
              viewBox="0 0 120 195" 
              className="w-full h-full fill-cactus-green stroke-stone-900 stroke-[2.5]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cactus Ground pile */}
              <ellipse cx="60" cy="170" rx="45" ry="10" fill="#a25c35" stroke="none" />
              <ellipse cx="60" cy="170" rx="45" ry="10" fill="none" stroke="#2c1a0e" strokeWidth="2" />

              {/* Central Cactus Trunk */}
              <rect x="50" y="20" width="20" height="150" rx="10" fill="#5ca732" />
              {/* Texture ridges on trunk */}
              <line x1="55" y1="30" x2="55" y2="160" stroke="#468421" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="60" y1="25" x2="60" y2="165" stroke="#468421" strokeWidth="2.5" strokeDasharray="10 5" />
              <line x1="65" y1="30" x2="65" y2="160" stroke="#468421" strokeWidth="2" strokeDasharray="6 4" />

              {/* Right Giant Arm */}
              <path d="M 70 115 H 95 A 10 10 0 0 0 105 105 V 60 A 10 10 0 0 0 85 60 V 82 H 70" fill="#5ca732" />
              <path d="M 85 65 V 82" stroke="#468421" strokeWidth="2" strokeDasharray="5 4" fill="none" />
              <path d="M 95 65 V 95" stroke="#468421" strokeWidth="2" strokeDasharray="5 4" fill="none" />

              {/* Left Giant Arm */}
              <path d="M 50 85 H 25 A 10 10 0 0 1 15 75 V 35 A 10 10 0 0 1 35 35 V 55 H 50" fill="#5ca732" />
              <path d="M 35 40 V 55" stroke="#468421" strokeWidth="2" strokeDasharray="5 4" fill="none" />
              <path d="M 25 45 V 75" stroke="#468421" strokeWidth="2" strokeDasharray="5 4" fill="none" />

              {/* Highlight shader overlay */}
              <path d="M 50 22 H 60 A 10 10 0 0 1 70 32 V 162 H 50 Z" fill="white" opacity="0.08" stroke="none" />

              {/* Small sharp spines around borders */}
              <g stroke="#2d5415" strokeWidth="1.5">
                {/* Outer spine pairs */}
                <line x1="50" y1="35" x2="44" y2="33" />
                <line x1="50" y1="35" x2="44" y2="37" />
                <line x1="70" y1="50" x2="76" y2="48" />
                <line x1="70" y1="50" x2="76" y2="52" />
                <line x1="50" y1="90" x2="44" y2="92" />
                <line x1="70" y1="120" x2="76" y2="122" />
                <line x1="15" y1="50" x2="9" y2="50" />
                <line x1="105" y1="75" x2="111" y2="75" />
              </g>
            </svg>

            {/* Cactus Anchor point (Placed precisely where the fuse rope weaves around/joins the cactus base) */}
            <div 
              id="cactus-anchor" 
              className="absolute bottom-[28%] right-[22%] w-2.5 h-2.5 rounded-full bg-red-600/0"
            />
          </div>
        </div>

      </div>


    </section>
  );
}
