import React from 'react';
import { formatRupiahInput, parseRupiah } from '../utils/currency';

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
    
    // Format otomatis saat user mengetik
    const formatted = formatRupiahInput(rawValue);
    
    // Buat event baru dengan value yang sudah diformat
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
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono ${
            error ? 'border-red-500/50' : 'border-slate-600/50'
          }`}
          placeholder={placeholder}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default RupiahInput;