import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description,
  action,
  className = '' 
}) => (
  <div className={`flex flex-col items-center justify-center py-16 text-center animate-fadeIn ${className}`}>
    <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-6">
      <Icon className="w-10 h-10 text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm max-w-md mb-6">{description}</p>
    {action && (
      <div className="animate-slideUp">
        {action}
      </div>
    )}
  </div>
);

export default EmptyState;