import { TypeConfig, SizeConfig, QualityConfig } from '../types';

export const GENERATION_TYPES: TypeConfig[] = [
  {
    value: 'anime',
    label: 'Anime',
    icon: '🎌',
    placeholder: 'e.g. Naruto, Goku, Sailor Moon',
    examples: ['Naruto', 'Dragon Ball', 'One Piece']
  },
  {
    value: 'superhero',
    label: 'Superhero',
    icon: '🦸',
    placeholder: 'e.g. Superman, Batman, Spider-Man',
    examples: ['Superman', 'Flash', 'Batman']
  },
  {
    value: 'dnd',
    label: 'D&D',
    icon: '🎲',
    placeholder: 'e.g. Elf, Dwarf, Wizard',
    examples: ['Mago', 'Guerriero', 'Bardo']
  },
  {
    value: 'cartoon',
    label: 'Cartoon',
    icon: '🎨',
    placeholder: 'e.g. Disney, Pixar, Cartoon Network',
    examples: ['Elsa', 'Shrek', 'Pikachu']
  }
];

export const SIZE_OPTIONS: SizeConfig[] = [
  {
    value: '1024x1024',
    label: 'Square',
    dimensions: '1024x1024',
    aspectRatio: '1:1'
  },
  {
    value: '1536x1024',
    label: 'Horizontal',
    dimensions: '1536x1024',
    aspectRatio: '3:2'
  },
  {
    value: '1024x1536',
    label: 'Vertical',
    dimensions: '1024x1536',
    aspectRatio: '2:3'
  }
];

export const QUALITY_OPTIONS: QualityConfig[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export const MODEL_OPTIONS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'firefly', label: 'Adobe Firefly' }
];

// API Configuration
export const API_CONFIG = {
  N8N_WEBHOOK_URL: 'https://comwrap25.app.n8n.cloud/webhook-test/get-caricature'
};