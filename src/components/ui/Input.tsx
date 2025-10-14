import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent',
          error 
            ? 'border-red-500 bg-red-50 text-red-700 placeholder-red-400'
            : 'border-gray-400 bg-white text-gray-900 hover:border-gray-500 placeholder-gray-500',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600">
          {helperText}
        </p>
      )}
    </div>
  );
};