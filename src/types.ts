export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  visualType?: 'rickmorty' | 'business' | 'login' | 'hangman' | 'barcode' | 'bolt' | 'roi' | 'ocr' | 'custom' | 'clinical';
}

export interface AnchorPoint {
  id: string;
  x: number; // Percent of container width or local x
  y: number; // Vertical scroll coordinate in pixels
}

export interface SocialLink {
  platform: 'google' | 'github' | 'linkedin';
  url: string;
  icon: string;
}

