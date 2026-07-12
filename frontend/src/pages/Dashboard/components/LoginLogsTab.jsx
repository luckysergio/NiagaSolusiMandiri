import React from 'react';
import { Search, X, RefreshCw, Eye, LogIn, Calendar } from 'lucide-react';
import Card from '../../../common/Card';
import StatusBadge from './common/StatusBadge';
import LoadingState from './common/LoadingState';
import EmptyState from './common/EmptyState';
import Pagination from './common/Pagination';
import useLoginLogs from '../../../hooks/useLoginLogs';

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

const LoginLogsTab = ({ onViewDetail }) => {
  const {
    data: loginLogs,
    pagination: loginPagination,
    isLoading: loginLoading,
    isFetching: loginFetching,
    refetch: refetchLogin,
    page: loginPage,
    setPage: setLoginPage,
    search: loginSearch,
    setSearch: setLoginSearch,
    status: loginStatus,
    setStatus: setLoginStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    resetDateFilter,
  } = useLoginLogs();

  const hasDateFilter = dateFrom || dateTo;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Filters */}
      <Card variant="glass" padding="md">
        <div className="space-y-3">
          {/* Row 1: Search & Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari email..."
                value={loginSearch}
                onChange={(e) => setLoginSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              {loginSearch && (
                <button
                  onClick={() => setLoginSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={loginStatus}
              onChange={(e) => setLoginStatus(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all"
            >
              <option value="">Semua Status</option>
              <option value="success">Sukses</option>
              <option value="failed">Gagal</option>
              <option value="logout">Logout</option>
              <option value="refresh">Refresh</option>
              <option value="anomaly">Anomali</option>
            </select>

            <button
              onClick={refetchLogin}
              disabled={loginFetching}
              className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${loginFetching ? 'animate-spin' : ''}`} />
            </button>

            <div className="ml-auto text-sm text-slate-400">
              <span className="font-semibold text-indigo-400">{loginPagination.total || 0}</span> log ditemukan
            </div>
          </div>

          {/* Row 2: Date Filter */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Filter Tanggal:</span>
            </div>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />

            <span className="text-slate-400 text-sm">sampai</span>

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />

            {hasDateFilter && (
              <button
                onClick={resetDateFilter}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all"
                title="Reset Filter Tanggal"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card variant="gradient" padding="none">
        {loginLoading ? (
          <LoadingState message="Memuat log login..." />
        ) : loginLogs.length === 0 ? (
          <EmptyState
            icon={LogIn}
            title="Tidak ada log login"
            description={hasDateFilter ? "Tidak ada log login pada rentang tanggal yang dipilih" : "Belum ada log login yang tercatat"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-700/50">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">IP Address</th>
                  <th className="px-4 py-3 font-medium">Device</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Waktu</th>
                  <th className="px-4 py-3 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {loginLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/30 transition-all">
                    <td className="px-4 py-3 text-white text-sm">{log.user?.name || '-'}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{log.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300 text-sm font-mono">{log.ip_address}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm truncate max-w-37.5" title={log.device_id}>
                      {log.device_id || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      <div>{formatDateTime(log.created_at)}</div>
                      <div className="text-xs text-slate-500">{getTimeAgo(log.created_at)}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onViewDetail('login', log)}
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
            pagination={loginPagination}
            currentPage={loginPage}
            onPageChange={setLoginPage}
          />
        </div>
      </Card>
    </div>
  );
};

export default LoginLogsTab;