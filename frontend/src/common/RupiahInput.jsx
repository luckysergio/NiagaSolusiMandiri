import React from 'react';
import { formatRupiahInput } from '../utils/currency';

const RupiahInput = ({
  label,
  name,
  value,
  onChange,
  placeholder = '0',
  error,
  disabled = false,
  required = false,
  helperText,
  className = '',
}) => {
  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatRupiahInput(rawValue);
    
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: formatted,
        type: 'text',
      },
    };
    
    onChange(syntheticEvent);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold group-focus-within:text-indigo-400 transition-colors">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 font-mono text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-600 focus:ring-indigo-500/20'
          }`}
          placeholder={placeholder}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs sm:text-sm text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400"></span>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default RupiahInput;