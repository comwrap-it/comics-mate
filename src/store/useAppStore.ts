import { create } from 'zustand';
import { GenerationFormData, N8NApiResponse, AppState } from '../types';
import { generateCaricature, ApiError } from '../services/api';

// Default N8N endpoint (from config.ts)
const DEFAULT_N8N_ENDPOINT = 'https://comwrap25.app.n8n.cloud/webhook-test/get-caricature';

// Helper functions for localStorage
const getStoredEndpoint = (): string => {
  try {
    return localStorage.getItem('n8n_endpoint') || DEFAULT_N8N_ENDPOINT;
  } catch {
    return DEFAULT_N8N_ENDPOINT;
  }
};

const setStoredEndpoint = (endpoint: string): void => {
  try {
    localStorage.setItem('n8n_endpoint', endpoint);
  } catch (error) {
    console.warn('Failed to save N8N endpoint to localStorage:', error);
  }
};

interface AppStore extends AppState {
  // N8N Configuration
  n8nEndpoint: string;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  generateImage: (formData: GenerationFormData) => Promise<void>;
  clearResult: () => void;
  clearError: () => void;
  setN8nEndpoint: (endpoint: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  isLoading: false,
  currentRequest: undefined,
  lastResult: undefined,
  error: undefined,
  n8nEndpoint: getStoredEndpoint(),

  // Actions
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error: error || undefined });
  },

  generateImage: async (formData: GenerationFormData) => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      // Salva la richiesta corrente
      set({ currentRequest: formData });
      
      // Chiama l'API
      const result = await generateCaricature(formData);
      
      // Salva il risultato
      set({ 
        lastResult: result,
        isLoading: false 
      });
      
      // Se c'è un errore nella risposta, impostalo
      if (!result.success && result.error) {
        setError(result.error);
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      
      let errorMessage = 'Unexpected error during generation';
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false,
        lastResult: {
          success: false,
          message: errorMessage,
          error: errorMessage
        }
      });
    }
  },

  clearResult: () => {
    set({ 
      lastResult: undefined,
      currentRequest: undefined 
    });
  },

  clearError: () => {
    set({ error: undefined });
  },

  setN8nEndpoint: (endpoint: string) => {
    setStoredEndpoint(endpoint);
    set({ n8nEndpoint: endpoint });
  }
}));