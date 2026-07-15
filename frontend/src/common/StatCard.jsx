import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
      iconBg: 'bg-indigo-500/20',
      trend: trendUp ? 'text-emerald-400' : 'text-red-400',
    },
    emerald: {
      bg: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      trend: trendUp ? 'text-emerald-400' : 'text-red-400',
    },
    amber: {
      bg: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      trend: trendUp ? 'text-emerald-400' : 'text-red-400',
    },
    red: {
      bg: 'from-red-500/20 to-pink-500/20',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      iconBg: 'bg-red-500/20',
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
        hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40
        transition-all duration-300 animate-fadeIn
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl border ${colorScheme.border} ${colorScheme.iconBg}`}>
          <Icon className={`w-6 h-6 ${colorScheme.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${colorScheme.trend} bg-slate-900/40 px-2.5 py-1 rounded-full border ${colorScheme.border}`}>
            {trendUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-slate-400 text-sm font-semibold mb-1.5">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;