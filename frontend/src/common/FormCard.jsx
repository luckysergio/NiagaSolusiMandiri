import React from 'react';
import Card from './Card';

const FormCard = ({
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  className = '',
}) => {
  return (
    <Card variant="elevated" className={`overflow-hidden ${className}`}>
      {/* Header */}
      {(title || subtitle || Icon) && (
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="p-2.5 bg-indigo-500/20 rounded-xl">
                <Icon className="w-6 h-6 text-indigo-400" />
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-xl font-bold text-white mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-slate-400 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
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
    </Card>
  );
};

export default FormCard;