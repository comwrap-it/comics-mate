import { GenerationFormData } from '../types';

export interface ValidationErrors {
  name?: string;
  email?: string;
  type?: string;
  class?: string;
  size?: string;
  quality?: string;
  model?: string;
  image?: string;
}

export const validateForm = (data: Partial<GenerationFormData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validazione nome
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Validazione email
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email';
  }

  // Validazione tipo
  if (!data.type) {
    errors.type = 'Caricature type is required';
  }

  // Validazione classe (solo se tipo è selezionato)
  if (data.type && !data.class?.trim()) {
    errors.class = 'Class is required';
  }

  // Validazione dimensione
  if (!data.size) {
    errors.size = 'Dimensions are required';
  }

  // Validazione qualità
  if (!data.quality) {
    errors.quality = 'Quality is required';
  }

  // Validazione model
  if (!data.model) {
    errors.model = 'AI Model is required';
  }

  // Validazione immagine
  if (!data.image) {
    errors.image = 'Image is required';
  } else {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (data.image.size > maxSize) {
      errors.image = 'Image cannot exceed 10MB';
    } else if (!allowedTypes.includes(data.image.type)) {
      errors.image = 'Unsupported image format. Use JPG, PNG or WebP';
    }
  }

  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};