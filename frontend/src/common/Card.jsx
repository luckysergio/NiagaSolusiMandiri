import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'md', 
  className = '',
  hover = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-2xl border transition-all duration-300';
  
  const variants = {
    default: 'bg-slate-800/50 border-slate-700/50',
    glass: 'bg-slate-800/30 backdrop-blur-xl border-slate-700/30',
    gradient: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50',
    elevated: 'bg-slate-800/80 border-slate-700/50 shadow-xl shadow-slate-900/50',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover 
    ? 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 cursor-pointer' 
    : '';

  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`;

  if (onClick) {
    return (
      <div onClick={onClick} className={classes} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;