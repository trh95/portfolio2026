import React, { useState, useEffect } from 'react';
import { Play, Code, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { projects } from '../data/projects';

export default function ProjectsGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Listen for escape key to close the presentation detail drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Rendering the visual screens matches high-end Awwwards-style card covers
  const renderVisualMockup = (project: Project) => {
    if (project.imageUrl) {
      return (
        <div className="w-full h-full rounded-xl overflow-hidden relative group bg-[#0c0a09] flex flex-col border border-stone-800">
          {/* Image Viewport */}
          <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-stone-950">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <div className="bg-[#5ca732] text-white font-mono text-[9px] font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider scale-50 group-hover:scale-100 transition-all duration-300 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-current" /> Expand Details
            </div>
          </div>
        </div>
      );
    }

    // Handcrafted fallback representation if no image is supplied
    const initials = project.title
      ?.split(' ')
      ?.map((n) => n[0])
      ?.join('')
      ?.substring(0, 3)
      ?.toUpperCase() || 'PROJ';
    return (
      <div className="w-full h-full bg-[#1b1917] rounded-lg overflow-hidden flex flex-col justify-between p-3 relative text-[9px] text-stone-300 border border-stone-800">
        <div className="flex justify-between items-center text-stone-500 font-mono text-[7px] border-b pb-1 border-[#292524] select-none">
          <span>PROJECT // ID_{project.id.toUpperCase()}</span>
          <span className="text-[#5ca732]">ACTIVE</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-2 select-none">
          <div className="w-10 h-10 rounded-xl bg-[#292524] flex items-center justify-center border border-stone-850 text-[#facc15] font-serif text-lg font-bold shadow-inner">
            {initials}
          </div>
        </div>
        <div className="text-center font-mono text-[8px] text-stone-400 bg-stone-900/60 py-0.5 rounded border border-stone-850">
          CREATIVE PRODUCTION
        </div>
      </div>
    );
  };

  return (
    <section 
      id="portfolio" 
      className="relative w-full py-24 bg-desert-sand-dark overflow-hidden border-t-4 border-desert-clay"
    >
      {/* Decorative Slide Targets inside standard grid */}
      <div id="projects-anchor" className="absolute top-10 left-10 w-2 h-2 rounded-full bg-red-600/0 pointer-events-none" />
      <div id="projects-end-anchor" className="absolute bottom-10 right-10 w-2 h-2 rounded-full bg-red-650/0 pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        
        {/* Section Header */}
        <div className="text-center mb-16 select-none">
          <p className="text-stone-300/90 font-mono uppercase tracking-widest text-xs font-semibold mb-2">
            Selected Works
          </p>
          <h2 className="text-3xl md:text-5xl text-white tracking-tight uppercase serif-heading">
            Featured Projects
          </h2>
          <div className="w-20 h-1.5 bg-[#5ca732] mx-auto mt-4 rounded-full shadow-[0_0_8px_#5ca732]" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer bg-[#dfd6cb] rounded-2xl p-4 border-2 border-stone-900 shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01] flex flex-col justify-between"
              style={{ minHeight: '260px' }}
            >
              {/* Applet visual preview wrapper screen */}
              <div className="w-full h-36 rounded-xl overflow-hidden p-1 bg-stone-950/20 border border-stone-800/40 relative flex items-center justify-center">
                {renderVisualMockup(project)}
              </div>

              {/* Bottom modern text cards */}
              <div className="mt-4 flex items-center justify-between">
                <div className="bg-stone-900 text-[#dfd6cb] rounded-lg px-4 py-1.5 text-xs font-mono tracking-wider border border-stone-950 shadow-md max-w-[80%] truncate">
                  {project.title}
                </div>
                <div className="w-8 h-8 rounded-full bg-black/10 border border-black/5 flex items-center justify-center text-stone-900 group-hover:bg-[#5ca732] group-hover:text-white transition-colors duration-300">
                  <Play className="w-3.5 h-3.5 fill-current scale-90" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Side-Drawer / Modal overlay */}
      {selectedProject && (
        <div 
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 bg-stone-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#1e1c1a] border-4 border-stone-900 text-stone-100 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] cursor-default"
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-stone-900 bg-stone-950/60 select-none">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-serif text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
                  {selectedProject.title}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-4 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider rounded-lg bg-red-800 text-white hover:bg-red-700 border border-red-950 transition-colors shadow-md"
              >
                Close [esc]
              </button>
            </div>

            {/* Modal Body Work-Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
              
              {/* Left Aesthetic Presentation Panel */}
              <div className="md:col-span-7 bg-[#0c0a09] p-6 flex flex-col justify-center items-center relative min-h-[300px]">
                {selectedProject.imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950 max-w-full max-h-[480px] flex flex-col group">
                    {/* Image Viewport */}
                    <div className="overflow-hidden bg-[#0c0a09] flex items-center justify-center">
                      <img 
                        src={selectedProject.imageUrl} 
                        alt={selectedProject.title} 
                        className="max-w-full max-h-[420px] object-contain select-none pointer-events-none transition-transform duration-700 group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-3xl shadow border border-stone-750 font-serif font-black text-amber-500">
                    {selectedProject.title ? selectedProject.title[0].toUpperCase() : 'P'}
                  </div>
                )}
              </div>

              {/* Right Sidebar Description Panel */}
              <div className="md:col-span-5 p-8 flex flex-col justify-between border-t border-stone-900 md:border-t-0 md:border-l-2 md:border-stone-950 bg-stone-950/30">
                <div>
                  <span className="bg-[#5ca732]/20 text-[#7ee13f] font-mono text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-950">
                    {selectedProject.category}
                  </span>
                  
                  <h5 className="font-serif text-2xl font-bold text-white mt-4 leading-tight">
                    Project Overview
                  </h5>
                  
                  <p className="text-stone-300 text-xs md:text-sm leading-relaxed mt-4">
                    {selectedProject.description}
                  </p>

                  {/* Technology badging */}
                  <div className="mt-6 select-none animate-fade-in">
                    <p className="text-[9px] uppercase font-mono text-stone-500 tracking-wider font-bold mb-2">Technologies / Tools</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-stone-900 text-[#dfd6cb] rounded text-[10px] font-mono border border-stone-850">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t-2 border-stone-900">
                  <div className="flex flex-col sm:flex-row gap-2">
                    {selectedProject.demoUrl && (
                      <a 
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-4 py-2.5 bg-[#5ca732] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all hover:scale-103 cursor-pointer"
                      >
                        Visit Website <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a 
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-stone-900 hover:bg-stone-850 text-stone-200 border-2 border-stone-950 text-center py-2.5 rounded-xl font-bold text-xs font-mono flex items-center justify-center gap-1.5 shadow transition-all hover:scale-103 cursor-pointer"
                      >
                        <Code className="w-3.5 h-3.5" /> Github Repo
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
