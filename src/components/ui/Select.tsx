import React from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  onChange,
  className,
  id,
  value,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={handleChange}
          className={clsx(
            'w-full px-3 py-2 pr-10 border rounded-lg shadow-sm transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent',
            'appearance-none bg-white text-gray-900',
            '[&>option]:bg-white [&>option]:text-gray-900',
            error 
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-400 hover:border-gray-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-500">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white text-gray-900">
              {option.icon ? `${option.icon} ${option.label}` : option.label}
            </option>
          ))}
        </select>
        
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
      
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