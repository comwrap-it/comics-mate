import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Settings as SettingsIcon, Save, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { n8nEndpoint, setN8nEndpoint } = useAppStore();
  const [endpointUrl, setEndpointUrl] = useState(n8nEndpoint);
  const [isValid, setIsValid] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEndpointUrl(n8nEndpoint);
  }, [n8nEndpoint]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setEndpointUrl(value);
    setError('');
    setIsSaved(false);
    
    if (value.trim()) {
      const valid = validateUrl(value.trim());
      setIsValid(valid);
      if (!valid) {
        setError('Inserisci un URL valido (deve iniziare con http:// o https://)');
      }
    } else {
      setIsValid(false);
      setError('Endpoint is required');
    }
  };

  const handleSave = () => {
    const trimmedUrl = endpointUrl.trim();
    
    if (!trimmedUrl) {
      setError('Endpoint is required');
      setIsValid(false);
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      setError('Inserisci un URL valido (deve iniziare con http:// o https://)');
      setIsValid(false);
      return;
    }

    setN8nEndpoint(trimmedUrl);
    setIsValid(true);
    setError('');
    setIsSaved(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultEndpoint = 'https://comwrap25.app.n8n.cloud/webhook-test/get-caricature';
    setEndpointUrl(defaultEndpoint);
    setN8nEndpoint(defaultEndpoint);
    setIsValid(true);
    setError('');
    setIsSaved(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  const hasChanges = endpointUrl.trim() !== n8nEndpoint;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-[#3b82f6] p-2 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Impostazioni</h1>
          </div>
          <p className="text-gray-600">Configura le impostazioni dell'applicazione</p>
        </div>

        {/* N8N Endpoint Configuration */}
        <Card className="bg-white border-gray-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center space-x-2">
              <span>Configurazione N8N</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Configure the endpoint for API calls to N8N. This URL will be used for all caricature generation requests.
            </CardDescription>
          </CardHeader>
          
          <div className="p-6 pt-0">
            <div className="space-y-6">
              {/* Current Endpoint Display */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Endpoint Attuale
                </label>
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                  <code className="text-green-600 text-sm break-all">{n8nEndpoint}</code>
                </div>
              </div>

              {/* Endpoint Configuration */}
              <div>
                <Input
                  label="Nuovo Endpoint N8N"
                  value={endpointUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://your-n8n-instance.com/webhook/your-endpoint"
                  error={error}
                  className="bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#3b82f6]"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Inserisci l'URL completo del webhook N8N incluso il protocollo (http:// o https://)
                </p>
              </div>

              {/* Success Message */}
              {isSaved && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Endpoint saved successfully!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleSave}
                  disabled={!isValid || !hasChanges}
                  className="bg-[#3b82f6] hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salva Endpoint
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Ripristina Default
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-[#9ca3af]">
                    <p className="font-medium mb-1 text-gray-800">Important Information:</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• The endpoint will be automatically saved in the browser</li>
                      <li>• All API calls to N8N will use this endpoint</li>
                        <li>• Make sure the endpoint is accessible and working</li>
                      <li>• Changes will take effect immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { Settings };