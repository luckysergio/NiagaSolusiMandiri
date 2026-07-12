// src/pages/dashboard/components/common/StatusBadge.jsx
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
  // NANTI TAMBAHKAN:
  // in_stock: { label: 'Tersedia', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  // out_of_stock: { label: 'Habis', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  // pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  // completed: { label: 'Selesai', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  // cancelled: { label: 'Dibatalkan', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const StatusBadge = React.memo(({ status, size = 'sm' }) => {
  const info = statusMap[status] || {
    label: status || '-',
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${info.color}`}>
      {info.label}
    </span>
  );
});

export default StatusBadge;