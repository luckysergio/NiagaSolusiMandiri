import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconClassName = '',
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25',
    secondary: 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-500/25',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25',
    outline: 'bg-transparent border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 sm:py-3 text-sm sm:text-base',
    lg: 'px-6 py-3 sm:py-4 text-base sm:text-lg',
  };

  const renderIcon = () => {
    if (!Icon) return null;
    
    const baseIconClass = 'w-5 h-5 group-hover:scale-110 transition-transform duration-200';
    const combinedClass = iconClassName 
      ? `${baseIconClass} ${iconClassName}` 
      : baseIconClass;

    return <Icon className={combinedClass} />;
  };

  return (
    <button
      className={`
        rounded-xl font-medium transition-all duration-200
        flex items-center justify-center gap-2 group relative overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:scale-[1.02]'}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          {children}
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  );
};

export default Button;