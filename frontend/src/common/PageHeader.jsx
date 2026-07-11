import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  className = '',
}) => {
  return (
    <div className={`mb-6 animate-fadeIn ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;