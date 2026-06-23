import { Project } from '../types';
import honeyValleyImg from '../assets/honeyvalley.png';
import medtrackImg from '../assets/medtrack.png';
import acoustixImg from '../assets/acoustix.png';
import roiImg from '../assets/roi.png';
import boltImg from '../assets/bolt.jpg';
import textImg from '../assets/text.jpg';

/**
 * FEATURED PROJECTS DATABASE
 * 
 * Contains exactly 8 high-performance creative design and tech works
 * suited for a award-winning creative developer portfolio.
 * Prefilled with real links, premium descriptive copy, and tags,
 * all ready for custom personal upgrades!
 */
export const projects: Project[] = [
  {
    id: 'honey-valley',
    title: 'Honey Valley',
    category: 'Creative Frontend & E-Commerce',
    description: 'An elegant presentation catalog for an organic local honey garden. Features smooth layout bindings, sensory interface animations, detailed product modals, custom shopping cart micro-interactions, and responsive sizing graphics.',
    visualType: 'custom',
    imageUrl: honeyValleyImg,
    tags: ['React', 'TypeScript', 'Web Audio API', 'Framer Motion', 'Tailwind CSS', 'Zustand'],
    demoUrl: 'https://honey-valley.vercel.app/',
    githubUrl: 'https://github.com/trh95/Honey-Valley'
  },
  {
  id: 'MedTrackPro',
  title: 'MedTrack Pro',
  category: 'Full-Stack Clinical & Administration',
  description: 'A high-fidelity patient database and appointment scheduling platform designed for nurse coordinators. Features real-time state synchronization via TanStack Query, reactive specialist calendars, live mathematical Hungarian TAJ insurance card CDV verification, and a polished healthcare administration dashboard.',
  visualType: 'clinical',
  imageUrl: medtrackImg,
  tags: ['React', 'TypeScript', 'Express', 'TanStack Query', 'Material UI', 'Axios'],
  demoUrl: 'https://medtrackpro-one.vercel.app/',
  githubUrl: 'https://github.com/trh95/medtrack_pro'
  },
  {
    id: 'AcoustiX',
  title: 'AcoustiX',
  category: 'Audio DSP / Room Acoustics',
  description: 'Professional-grade interactive room acoustics simulator and Web Audio analysis engine. Features real-time RT60 reverberation calculations, interactive physical speaker/microphone node dragging, and custom DSP impulse response modeling.',
  visualType: 'custom',
  imageUrl: acoustixImg,
  tags: ['Web Audio API', 'GSAP Animations', 'Tailwind CSS', 'Room Acoustics', 'RT60 Simulation'],
  demoUrl: 'https://acoustix-omega.vercel.app/',
  githubUrl: 'https://github.com/trh95/AcoustiX'
  },
 {
    id: 'ROI',
    title: 'ROI-Selector',
    category: 'Computer Vision / Annotation Tools',
    description: 'An interactive Region of Interest (ROI) selection utility built with OpenCV. It downsamples high-resolution images for fluid crosshair bounding box selection, maps coordinates back to original high-res dimensions, and exports the data structures to formatted JSON files.',
    visualType: 'custom',
    imageUrl: roiImg,
    tags: ['OpenCV', 'Python', 'Computer Vision', 'Data Annotation', 'JSON Export', 'Image Scaling'],
    demoUrl: '',
    githubUrl: 'https://github.com/trh95/ROI'
  },
  {
    id: 'Bolt',
    title: 'Bolt-Checker',
    category: 'Computer Vision / Industrial Quality Control',
    description: 'An automated manufacturing QA script that leverages OpenCV and NumPy to analyze color spaces (HSV) and morphological masks. It validates the mandatory presence of both red and black safety markings on bolts across multiple predefined Regions of Interest (ROIs).',
    visualType: 'custom',
    imageUrl: boltImg,
    tags: ['OpenCV', 'Python', 'Computer Vision', 'Image Processing', 'NumPy', 'Quality Assurance'],
    demoUrl: '',
    githubUrl: 'https://github.com/trh95/Bolt'
  },
  {
    id: 'Text',
    title: 'Text-Detection',
    category: 'Computer Vision / Optical Character Recognition (OCR)',
    description: 'An industrial OCR pipeline that preprocesses high-resolution images using OpenCV grayscale conversions and binary thresholding. It integrates EasyOCR with structural constraints (alphanumeric allowlists and rotation matrices) to detect and verify current rating labels (e.g., 160A, 200A) on electrical components.',
    visualType: 'custom',
    imageUrl: textImg,
    tags: ['OpenCV', 'EasyOCR', 'Python', 'OCR', 'Image Thresholding', 'Industrial Automation'],
    demoUrl: '',
    githubUrl: 'https://github.com/trh95/Text-Detection'
  }
];
