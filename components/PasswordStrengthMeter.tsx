import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { PasswordRequirement } from '../types';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const requirements: PasswordRequirement[] = useMemo(() => [
    { id: 'length', label: 'At least 8 characters', regex: /.{8,}/, met: false },
    { id: 'number', label: 'Contains a number', regex: /\d/, met: false },
    { id: 'lowercase', label: 'Lowercase letter', regex: /[a-z]/, met: false },
    { id: 'uppercase', label: 'Uppercase letter', regex: /[A-Z]/, met: false },
    { id: 'special', label: 'Special character', regex: /[^A-Za-z0-9]/, met: false },
  ], []);

  const results = requirements.map(req => ({
    ...req,
    met: req.regex.test(password)
  }));

  const metCount = results.filter(r => r.met).length;
  const score = (metCount / requirements.length) * 100;

  let strengthLabel = 'Weak';
  let colorClass = 'bg-slate-200';
  let textClass = 'text-slate-500';

  if (metCount === 0) {
    // default
  } else if (metCount <= 2) {
    strengthLabel = 'Weak';
    colorClass = 'bg-red-500';
    textClass = 'text-red-600';
  } else if (metCount <= 4) {
    strengthLabel = 'Medium';
    colorClass = 'bg-yellow-500';
    textClass = 'text-yellow-600';
  } else {
    strengthLabel = 'Strong';
    colorClass = 'bg-green-500';
    textClass = 'text-green-600';
  }

  return (
    <div className="space-y-3 mt-4 animate-fade-in">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
          <span className="text-slate-500">Strength</span>
          <span className={textClass}>{strengthLabel}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${colorClass}`} 
            style={{ width: `${Math.max(5, score)}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {results.map((req) => (
          <div 
            key={req.id} 
            className={`flex items-center text-xs transition-colors duration-200 ${
              req.met ? 'text-green-600' : 'text-slate-400'
            }`}
          >
            {req.met ? (
              <Check className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            ) : (
              <div className="w-3.5 h-3.5 mr-1.5 shrink-0 rounded-full border border-current opacity-60" />
            )}
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
};