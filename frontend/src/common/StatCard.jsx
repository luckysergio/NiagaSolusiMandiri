import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  color = 'indigo',
  className = '',
}) => {
  const colors = {
    indigo: {
      bg: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/30',
      icon: 'text-indigo-400',
      trend: trendUp ? 'text-emerald-400' : 'text-red-400',
    },
    emerald: {
      bg: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400',
      trend: trendUp ? 'text-emerald-400' : 'text-red-400',
    },
    amber: {
      bg: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
      trend: trendUp ? 'text-emerald-400' : 'text-red-400',
    },
    red: {
      bg: 'from-red-500/20 to-pink-500/20',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      trend: trendUp ? 'text-emerald-400' : 'text-red-400',
    },
  };

  const colorScheme = colors[color] || colors.indigo;

  return (
    <div
      className={`
        bg-linear-to-br ${colorScheme.bg}
        border ${colorScheme.border}
        rounded-2xl p-6 backdrop-blur-sm
        hover:shadow-2xl hover:shadow-indigo-500/10
        transition-all duration-300 animate-fadeIn
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-slate-800/50 rounded-xl border ${colorScheme.border}`}>
          <Icon className={`w-6 h-6 ${colorScheme.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${colorScheme.trend}`}>
            {trendUp ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;