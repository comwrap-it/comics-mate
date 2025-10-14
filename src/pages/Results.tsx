import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Button } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { downloadImage, validateImageUrl } from '../services/api';
import { 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Image as ImageIcon,
  Video as VideoIcon
} from 'lucide-react';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const { lastResult, currentRequest, isLoading, clearResult } = useAppStore();
  
  const handleDownload = async (type: 'image' | 'video' = 'image') => {
    if (type === 'image' && lastResult?.imageUrl && validateImageUrl(lastResult.imageUrl)) {
      try {
        const filename = `caricatura-${currentRequest?.name || 'comics-mate'}-${Date.now()}.jpg`;
        await downloadImage(lastResult.imageUrl, filename);
      } catch (error) {
        console.error('Download error:', error);
      }
    } else if (type === 'video' && lastResult?.videoUrl && validateImageUrl(lastResult.videoUrl)) {
      try {
        const filename = `caricatura-video-${currentRequest?.name || 'comics-mate'}-${Date.now()}.mp4`;
        await downloadImage(lastResult.videoUrl, filename);
      } catch (error) {
        console.error('Video download error:', error);
      }
    }
  };
  
  const handleNewGeneration = () => {
    clearResult();
    navigate('/');
  };
  
  // If no results, redirect to home
  if (!lastResult && !isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-[#1a1a1a] min-h-screen p-6">
        <Card className="text-center bg-[#374151] border-[#374151]">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <ImageIcon className="w-16 h-16 text-[#9ca3af]" />
            </div>
            <CardTitle className="text-white">No results available</CardTitle>
            <p className="text-[#9ca3af] mt-2 mb-6">
              You haven't generated any caricatures yet. Start by creating your first image!
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-[#1a1a1a] min-h-screen p-6">
        <Card className="text-center bg-[#374151] border-[#374151]">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-[#3b82f6] p-4 rounded-full">
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <CardTitle className="text-white">Generation in progress...</CardTitle>
            <p className="text-[#9ca3af] mt-2">
              Your caricature is being processed. This may take a few minutes.
            </p>
            <p className="text-sm text-[#9ca3af] mt-1">
              Estimated time: 2-5 minutes
            </p>
            
            {currentRequest && (
              <div className="mt-6 p-4 bg-[#2d2d2d] border border-[#4b5563] rounded-lg text-left">
                <h3 className="font-medium text-white mb-2">Request details:</h3>
            <div className="space-y-1 text-sm text-[#9ca3af]">
              <p><span className="font-medium text-white">Name:</span> {currentRequest.name}</p>
              <p><span className="font-medium text-white">Type:</span> {currentRequest.type}</p>
              <p><span className="font-medium text-white">Class:</span> {currentRequest.class}</p>
              <p><span className="font-medium text-white">Dimensions:</span> {currentRequest.size}</p>
              <p><span className="font-medium text-white">Quality:</span> {currentRequest.quality}</p>
            </div>
              </div>
            )}
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  // Successful result
  if (lastResult?.success && (lastResult.imageUrl || lastResult.videoUrl)) {
    return (
      <div className="max-w-4xl mx-auto bg-[#1a1a1a] min-h-screen p-6">
        <Card className="bg-[#374151] border-[#374151]">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-green-400">Caricature Generated Successfully!</CardTitle>
            <p className="text-[#9ca3af] mt-2">
              Your personalized caricature is ready for download!
            </p>
            
            {lastResult.processingTime && (
              <div className="flex items-center justify-center mt-2 text-sm text-[#9ca3af]">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(lastResult.timestamp).toLocaleString('en-US')}
            </div>
            )}
          </CardHeader>
          
          {/* Generated content */}
          <div className="mb-6 space-y-6">
            {/* Image */}
            {lastResult.imageUrl && (
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Generated Image
                </h3>
                <div className="relative bg-[#2d2d2d] border border-[#4b5563] rounded-lg overflow-hidden">
                  <img
                    src={lastResult.imageUrl}
                    alt="Generated caricature"
                    className="w-full h-auto max-h-96 object-contain mx-auto"
                    onError={(e) => {
                      console.error('Error loading image');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Video */}
            {lastResult.videoUrl && (
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <VideoIcon className="w-5 h-5 mr-2" />
                  Generated Video
                </h3>
                <div className="relative bg-[#2d2d2d] border border-[#4b5563] rounded-lg overflow-hidden">
                  <video
                    src={lastResult.videoUrl}
                    controls
                    className="w-full h-auto max-h-96 object-contain mx-auto"
                    onError={(e) => {
                      console.error('Error loading video');
                      e.currentTarget.style.display = 'none';
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>
          
          {/* Dettagli della richiesta */}
          {currentRequest && (
            <div className="mb-6 p-4 bg-[#2d2d2d] border border-[#4b5563] rounded-lg">
              <h3 className="font-medium text-white mb-3">Generation details:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-white">Name:</span>
                  <p className="text-[#9ca3af]">{currentRequest.name}</p>
                </div>
                <div>
                  <span className="font-medium text-white">Type:</span>
                  <p className="text-[#9ca3af] capitalize">{currentRequest.type}</p>
                </div>
                <div>
                  <span className="font-medium text-white">Class:</span>
                  <p className="text-[#9ca3af]">{currentRequest.class}</p>
                </div>
                <div>
                  <span className="font-medium text-white">Dimensions:</span>
                  <p className="text-[#9ca3af]">{currentRequest.size}</p>
                </div>
                <div>
                  <span className="font-medium text-white">Quality:</span>
                  <p className="text-[#9ca3af] capitalize">{currentRequest.quality}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Azioni */}
          <div className="space-y-4">
            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {lastResult.imageUrl && (
                <Button
                  onClick={() => handleDownload('image')}
                  variant="primary"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              )}
              
              {lastResult.videoUrl && (
                <Button
                  onClick={() => handleDownload('video')}
                  variant="primary"
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleNewGeneration}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New
              </Button>
              
              <Button
                onClick={() => navigate('/')}
                variant="secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  // Error result
  return (
    <div className="max-w-2xl mx-auto bg-[#1a1a1a] min-h-screen p-6">
      <Card className="bg-[#374151] border-[#374151]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 p-3 rounded-full">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-red-400">Generation Error</CardTitle>
            <p className="text-[#9ca3af] mt-2">
              {lastResult?.error || lastResult?.message || 'An error occurred during caricature generation.'}
            </p>
          
          {lastResult?.processingTime && (
            <div className="flex items-center justify-center mt-2 text-sm text-[#9ca3af]">
              <Clock className="w-4 h-4 mr-1" />
              Tempo trascorso: {(lastResult.processingTime / 1000).toFixed(1)}s
            </div>
          )}
        </CardHeader>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleNewGeneration}
            variant="primary"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};