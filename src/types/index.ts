// Types for generation form
export interface GenerationFormData {
  name: string;
  email: string;
  type: 'anime' | 'superhero' | 'dnd' | 'cartoon';
  class: string;
  size: '1024x1024' | '1536x1024' | '1024x1536';
  quality: 'low' | 'medium' | 'high';
  model: 'openai' | 'firefly';
  customPrompt?: string;
  image: File;
}

// Risposta API N8N
export interface N8NApiResponse {
  success: boolean;
  imageUrl?: string;
  videoUrl?: string;
  imageB4?: string;
  category?: string;
  email?: string;
  message: string;
  processingTime?: number;
  error?: string;
}

// Stato dell'applicazione
export interface AppState {
  isLoading: boolean;
  currentRequest?: GenerationFormData;
  lastResult?: N8NApiResponse;
  error?: string;
}

// Type configurations
export interface TypeConfig {
  value: string;
  label: string;
  icon: string;
  placeholder: string;
  examples: string[];
}

// Dimension configurations
export interface SizeConfig {
  value: string;
  label: string;
  dimensions: string;
  aspectRatio: string;
}

// Quality configurations
export interface QualityConfig {
  value: string;
  label: string;
}