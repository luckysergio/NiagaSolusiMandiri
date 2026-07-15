import React from 'react';

const statusMap = {
  success: { label: 'Sukses', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  failed: { label: 'Gagal', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  logout: { label: 'Logout', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  refresh: { label: 'Refresh', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  anomaly: { label: 'Anomali', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  active: { label: 'Aktif', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  inactive: { label: 'Nonaktif', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  expired: { label: 'Kadaluarsa', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  permanent: { label: 'Permanen', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  temporary: { label: 'Sementara', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  manual: { label: 'Manual', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  auto: { label: 'Otomatis', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  low: { label: 'Rendah', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  medium: { label: 'Sedang', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  high: { label: 'Tinggi', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  critical: { label: 'Kritis', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  resolved: { label: 'Terselesaikan', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  unresolved: { label: 'Belum Selesai', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  featured: { label: 'Featured', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  completed: { label: 'Selesai', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const StatusBadge = React.memo(({ status, size = 'sm', className = '' }) => {
  const info = statusMap[status] || {
    label: status || '-',
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full border backdrop-blur-sm
      ${sizeClasses[size]} 
      ${info.color}
      ${className}
    `}>
      {info.label}
    </span>
  );
});

export default StatusBadge;