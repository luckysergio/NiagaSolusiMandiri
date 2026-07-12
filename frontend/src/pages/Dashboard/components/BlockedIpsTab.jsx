// src/pages/dashboard/components/BlockedIpsTab.jsx
import React from 'react';
import { Search, X, RefreshCw, Eye, ShieldAlert, Globe } from 'lucide-react';
import Card from '../../../common/Card';
import StatusBadge from './common/StatusBadge';
import LoadingState from './common/LoadingState';
import EmptyState from './common/EmptyState';
import Pagination from './common/Pagination';
import useBlockedIps from '../../../hooks/useBlockedIps';

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTimeAgo = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

const BlockedIpsTab = ({ onViewDetail }) => {
  const {
    data: blockedIps,
    pagination: blockedPagination,
    isLoading: blockedLoading,
    isFetching: blockedFetching,
    refetch: refetchBlocked,
    page: blockedPage,
    setPage: setBlockedPage,
    search: blockedSearch,
    setSearch: setBlockedSearch,
    filter: blockedFilter,
    setFilter: setBlockedFilter,
  } = useBlockedIps();

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Filters */}
      <Card variant="glass" padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari IP address..."
              value={blockedSearch}
              onChange={(e) => setBlockedSearch(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            {blockedSearch && (
              <button
                onClick={() => setBlockedSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={blockedFilter}
            onChange={(e) => setBlockedFilter(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all"
          >
            <option value="active">Aktif Saja</option>
            <option value="all">Semua</option>
          </select>

          <button
            onClick={refetchBlocked}
            disabled={blockedFetching}
            className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-400 ${blockedFetching ? 'animate-spin' : ''}`} />
          </button>

          <div className="ml-auto text-sm text-slate-400">
            <span className="font-semibold text-indigo-400">{blockedPagination.total || 0}</span> IP
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card variant="gradient" padding="none">
        {blockedLoading ? (
          <LoadingState message="Memuat IP diblokir..." />
        ) : blockedIps.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="Tidak ada IP diblokir"
            description="Tidak ada IP yang sedang diblokir saat ini"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-700/50">
                  <th className="px-4 py-3 font-medium">IP Address</th>
                  <th className="px-4 py-3 font-medium">Attempts</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Blocked Until</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {blockedIps.map((ip) => (
                  <tr key={ip.id} className="hover:bg-slate-700/30 transition-all">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm font-mono">{ip.ip_address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-sm font-semibold">{ip.attempts}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ip.block_type} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ip.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {ip.blocked_until ? (
                        <div>
                          <div>{formatDateTime(ip.blocked_until)}</div>
                          <div className="text-xs text-slate-500">{getTimeAgo(ip.blocked_until)}</div>
                        </div>
                      ) : (
                        <span className="text-red-400 text-xs">Permanen</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm truncate max-w-50" title={ip.reason}>
                      {ip.reason || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onViewDetail('blocked', ip)}
                        className="p-1.5 hover:bg-indigo-500/20 rounded-lg transition-all text-slate-400 hover:text-indigo-400"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 pb-4">
          <Pagination
            pagination={blockedPagination}
            currentPage={blockedPage}
            onPageChange={setBlockedPage}
          />
        </div>
      </Card>
    </div>
  );
};

export default BlockedIpsTab;