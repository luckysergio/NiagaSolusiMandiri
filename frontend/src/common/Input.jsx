// src/common/Input.jsx
import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled,
  required,
  icon: Icon,
  helperText,
  className = '',
  ...rest
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 sm:py-3
            bg-slate-700/50 border rounded-xl 
            text-white placeholder-slate-400 
            focus:outline-none focus:ring-2 transition-all duration-200
            text-sm sm:text-base
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error 
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
              : "border-slate-600 focus:ring-indigo-500/20 focus:border-indigo-500"
            }
          `}
          {...rest}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs sm:text-sm text-red-400">{error}</p>
      ) : (
        helperText && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500">{helperText}</p>
        )
      )}
    </div>
  );
};

export default Input;