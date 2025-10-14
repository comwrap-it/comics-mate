import { GenerationFormData, N8NApiResponse } from '../types';
import { API_CONFIG } from '../constants/config';
import { useAppStore } from '../store/useAppStore';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const generateCaricature = async (formData: GenerationFormData): Promise<N8NApiResponse> => {
  try {
    // Ottieni l'endpoint N8N configurabile dallo store
    const n8nEndpoint = useAppStore.getState().n8nEndpoint;
    
    // Crea FormData per multipart/form-data
    const data = new FormData();
    
    // Aggiungi tutti i campi del form
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('type', formData.type);
    data.append('class', formData.class);
    data.append('size', formData.size);
    data.append('quality', formData.quality);
    data.append('model', formData.model);
    if (formData.customPrompt) {
      data.append('customPrompt', formData.customPrompt);
    }
    data.append('image', formData.image);
    
    // Log per debug (rimuovere in produzione)
    console.log('Sending request to N8N:', {
      endpoint: n8nEndpoint,
      name: formData.name,
      email: formData.email,
      type: formData.type,
      class: formData.class,
      size: formData.size,
      quality: formData.quality,
      model: formData.model,
      customPrompt: formData.customPrompt,
      imageSize: formData.image.size,
      imageName: formData.image.name
    });
    
    const startTime = Date.now();
    
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes timeout
    
    try {
      const response = await fetch(n8nEndpoint, {
        method: 'POST',
        body: data,
        signal: controller.signal,
        // Non impostare Content-Type, il browser lo farà automaticamente per FormData
      });
      
      clearTimeout(timeoutId);
    
    const processingTime = Date.now() - startTime;
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `Server error: ${response.status} - ${errorText}`,
        response.status
      );
    }
    
    const result = await response.json();
    
    // Verifica la struttura della risposta
    if (typeof result !== 'object') {
      throw new ApiError('Invalid server response');
    }
    
    // Gestisce imageB4 convertendolo in data URL se presente
    let imageUrl = result.imageUrl || result.image_url || result.url;
    if (result.imageB4 && !imageUrl) {
      imageUrl = `data:image/png;base64,${result.imageB4}`;
    }
    
    return {
      success: result.success ?? true,
      imageUrl,
      videoUrl: result.videoUrl,
      imageB4: result.imageB4,
      category: result.category,
      email: result.email,
      message: result.message || 'Caricature generated successfully!',
      processingTime,
      error: result.error
    };
    
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Error generating caricature:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle timeout errors
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout: The generation process is taking longer than expected (10 minutes). Please try again.', 408);
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Connection error. Check your internet connection.');
    }
    
    throw new ApiError('Unexpected error during caricature generation');
  }
};

// Utility per validare URL immagine
export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Utility per scaricare immagine
export const downloadImage = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error downloading image');
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
    throw new ApiError('Error during image download');
  }
};