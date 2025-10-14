import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, Button, Input, Select } from './ui';
import { ImageUpload } from './ImageUpload';
import { useAppStore } from '../store/useAppStore';
import { GenerationFormData } from '../types';
import { GENERATION_TYPES, SIZE_OPTIONS, QUALITY_OPTIONS, MODEL_OPTIONS } from '../constants/config';
import { validateForm, hasErrors, ValidationErrors } from '../utils/validation';
import { Sparkles, Wand2, Loader2, Clock } from 'lucide-react';

export const GenerationForm: React.FC = () => {
  const navigate = useNavigate();
  const { generateImage, isLoading, error, clearError } = useAppStore();
  
  const [formData, setFormData] = useState<Partial<GenerationFormData>>({
    name: '',
    email: '',
    type: undefined,
    class: '',
    size: '1024x1024',
    quality: 'medium',
    model: 'openai',
    customPrompt: '',
    image: undefined
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Pulisci errori quando il form cambia
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, error, clearError]);
  
  // Trova la configurazione del tipo selezionato
  const selectedTypeConfig = GENERATION_TYPES.find(t => t.value === formData.type);
  
  const handleInputChange = (field: keyof GenerationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Segna il campo come toccato
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Se cambia il tipo, resetta la classe
    if (field === 'type') {
      setFormData(prev => ({ ...prev, class: '' }));
      setTouched(prev => ({ ...prev, class: false }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Segna tutti i campi come toccati
    const allFields = ['name', 'email', 'type', 'class', 'size', 'quality', 'model', 'image'];
    setTouched(Object.fromEntries(allFields.map(field => [field, true])));
    
    // Valida il form
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (hasErrors(validationErrors)) {
      return;
    }
    
    // Se tutto è valido, genera l'immagine
    try {
      await generateImage(formData as GenerationFormData);
      // Naviga alla pagina dei risultati
      navigate('/results');
    } catch (error) {
      console.error('Generation error:', error);
    }
  };
  
  // Mostra errori solo per i campi toccati
  const getFieldError = (field: keyof ValidationErrors) => {
    return touched[field] ? errors[field] : undefined;
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white border-gray-400 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-900 mb-2">
            Create Your Caricature
          </CardTitle>
          <CardDescription className="text-gray-700">
            Upload your photo and customize the style
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informazioni personali */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name *"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={getFieldError('name')}
            />
            
            <Input
              label="Email *"
              type="email"
              placeholder="your-email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={getFieldError('email')}
            />
          </div>
          
          {/* Tipo di caricatura */}
          <Select
            label="Caricature Type *"
            placeholder="Select a style"
            options={GENERATION_TYPES.map(type => ({
              value: type.value,
              label: type.label,
              icon: type.icon
            }))}
            value={formData.type || ''}
            onChange={(value) => handleInputChange('type', value)}
            error={getFieldError('type')}
            helperText="Choose your preferred style for your caricature"
          />
          
          {/* Campo classe dinamico */}
          {selectedTypeConfig && (
            <Input
              label={`${selectedTypeConfig.label} Class *`}
              type="text"
              placeholder={selectedTypeConfig.placeholder}
              value={formData.class}
              onChange={(e) => handleInputChange('class', e.target.value)}
              error={getFieldError('class')}
              helperText={`Examples: ${selectedTypeConfig.examples.join(', ')}`}
            />
          )}
          
          {/* Configurazioni */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Dimensions *"
              options={SIZE_OPTIONS.map(size => ({
                value: size.value,
                label: `${size.label} (${size.dimensions})`
              }))}
              value={formData.size || ''}
              onChange={(value) => handleInputChange('size', value)}
              error={getFieldError('size')}
            />
            
            <Select
              label="Quality *"
              options={QUALITY_OPTIONS}
              value={formData.quality || ''}
              onChange={(value) => handleInputChange('quality', value)}
              error={getFieldError('quality')}
            />
            
            <Select
              label="AI Model *"
              options={MODEL_OPTIONS}
              value={formData.model || ''}
              onChange={(value) => handleInputChange('model', value)}
              error={getFieldError('model')}
              helperText="Choose the AI model for generation"
            />
          </div>
          
          {/* Custom Prompt */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Custom Prompt (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Describe briefly the action you would like your character to perform..."
              value={formData.customPrompt || ''}
              onChange={(e) => handleInputChange('customPrompt', e.target.value)}
            />
            <p className="text-sm text-gray-600">
              You can describe the action or pose you want your character to have in the caricature
            </p>
          </div>

          {/* Upload immagine */}
          <ImageUpload
            onImageSelect={(file) => handleInputChange('image', file)}
            currentImage={formData.image}
            error={getFieldError('image')}
          />
          
          {/* Errore generale */}
          {error && (
            <div className="bg-red-50 border border-red-400 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-800 mb-1">Generating Your Caricature</h3>
                  <p className="text-blue-600 text-sm">This process may take up to 10 minutes</p>
                </div>
              </div>
              <div className="flex items-center justify-center text-sm text-blue-700">
                <Clock className="w-4 h-4 mr-2" />
                <span>Please keep this page open while we create your personalized caricature</span>
              </div>
              <div className="mt-4 bg-blue-100 rounded-lg p-3">
                <p className="text-xs text-blue-800 text-center font-medium">
                  ⚡ High-quality AI generation in progress - Please be patient
                </p>
              </div>
            </div>
          )}
          
          {/* Pulsante di invio */}
          <Button
            type="submit"
            size="lg"
            loading={isLoading}
            disabled={isLoading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Caricature
              </>
            )}
          </Button>
          
          {!isLoading && (
            <p className="text-xs text-gray-600 text-center">
              Generation may take several minutes. Please don't close the page during processing.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
};