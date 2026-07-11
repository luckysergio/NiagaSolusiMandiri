import React from 'react';

const Input = ({
  label,
  icon: Icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          className={`
            block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 sm:py-3
            bg-slate-700/50 border rounded-xl 
            text-white placeholder-slate-400 
            focus:outline-none focus:ring-2 transition-all duration-200
            text-sm sm:text-base
            ${error 
              ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
              : "border-slate-600 focus:ring-indigo-500/20 focus:border-indigo-500"
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;