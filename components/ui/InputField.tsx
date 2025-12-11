import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  error,
  success,
  icon,
  className = "",
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // Ensure we have an ID for the label
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
          {icon || (isPassword && <Lock className="h-5 w-5" />)}
        </div>
        
        <input
          id={inputId}
          type={inputType}
          className={`
            block w-full pl-10 pr-10 py-2.5 
            bg-white border rounded-lg 
            text-slate-900 placeholder-slate-400 
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-slate-50 disabled:text-slate-500
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
              : success 
                ? 'border-green-300 focus:border-green-500 focus:ring-green-100'
                : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-primary-100'
            }
          `}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-label="Hide password" />
              ) : (
                <Eye className="h-5 w-5" aria-label="Show password" />
              )}
            </button>
          ) : error ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : success ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : null}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
};