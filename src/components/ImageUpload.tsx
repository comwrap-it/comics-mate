import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  error?: string;
  currentImage?: File;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  error,
  currentImage
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Genera anteprima quando cambia l'immagine
  React.useEffect(() => {
    if (currentImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(currentImage);
    } else {
      setPreview(null);
    }
  }, [currentImage]);

  const handleFileSelect = useCallback((file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return;
    }

    if (file.size > maxSize) {
      return;
    }

    onImageSelect(file);
  }, [onImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Chiamiamo onImageSelect con un file vuoto per resettare
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Upload your photo *
      </label>
      
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer',
          isDragOver
            ? 'border-[#3b82f6] bg-blue-50'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-400 bg-white hover:border-gray-500 hover:bg-gray-50',
          preview ? 'p-2' : 'p-8'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="relative">
            <img
                src={preview}
                alt="Preview"
                className="w-full aspect-square object-cover rounded-lg"
              />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {currentImage?.name}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 text-gray-500 mb-4">
              {isDragOver ? (
                <Upload className="w-full h-full text-[#3b82f6]" />
              ) : (
                <ImageIcon className="w-full h-full" />
              )}
            </div>
            <div className="text-sm">
              {isDragOver ? (
                <p className="font-medium text-[#3b82f6]">Drop the image here</p>
              ) : (
                <>
                  <p className="font-medium text-gray-900">Click to upload or drag here</p>
                  <p className="text-xs text-gray-600 mt-1">
                    JPG, PNG or WebP (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
      
      {!error && (
        <p className="mt-1 text-xs text-gray-600">
          Upload a clear photo of your face for the best results
        </p>
      )}
    </div>
  );
};