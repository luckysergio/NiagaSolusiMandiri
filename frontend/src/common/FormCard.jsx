import React from 'react';

const FormCard = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
}) => {
  return (
    <div className="animate-fadeIn">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
        {/* Header */}
        {(title || subtitle) && (
          <div className="p-6 border-b border-slate-700/50">
            {title && (
              <h3 className="text-xl font-semibold text-white mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-slate-400 text-sm">{subtitle}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCard;