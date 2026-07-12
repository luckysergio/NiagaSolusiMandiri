import React from 'react';
import { Search, X, RefreshCw, Eye, Activity, MapPin, Hash, Clock, Calendar } from 'lucide-react';
import Card from '../../../common/Card';
import LoadingState from './common/LoadingState';
import EmptyState from './common/EmptyState';
import Pagination from './common/Pagination';
import useActivityLogs from '../../../hooks/useActivityLogs';

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

const ActivityLogsTab = ({ onViewDetail }) => {
  const {
    data: activityLogs,
    pagination: activityPagination,
    isLoading: activityLoading,
    isFetching: activityFetching,
    refetch: refetchActivity,
    page: activityPage,
    setPage: setActivityPage,
    search: activitySearch,
    setSearch: setActivitySearch,
    module: activityModule,
    setModule: setActivityModule,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    resetDateFilter,
  } = useActivityLogs();

  const hasDateFilter = dateFrom || dateTo;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Filters */}
      <Card variant="glass" padding="md">
        <div className="space-y-3">
          {/* Row 1: Search & Module */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari action..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              {activitySearch && (
                <button
                  onClick={() => setActivitySearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={activityModule}
              onChange={(e) => setActivityModule(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all"
            >
              <option value="">Semua Module</option>
              <option value="users">Users</option>
              <option value="roles">Roles</option>
              <option value="profile">Profile</option>
              <option value="auth">Auth</option>
            </select>

            <button
              onClick={refetchActivity}
              disabled={activityFetching}
              className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${activityFetching ? 'animate-spin' : ''}`} />
            </button>

            <div className="ml-auto text-sm text-slate-400">
              <span className="font-semibold text-indigo-400">{activityPagination.total || 0}</span> aktivitas
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

      {/* Activity List */}
      <Card variant="gradient" padding="md">
        {activityLoading ? (
          <LoadingState message="Memuat log aktivitas..." />
        ) : activityLogs.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="Tidak ada aktivitas"
            description={hasDateFilter ? "Tidak ada aktivitas pada rentang tanggal yang dipilih" : "Belum ada aktivitas yang tercatat"}
          />
        ) : (
          <div className="space-y-3">
            {activityLogs.map((log, index) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all group animate-slideUp"
                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-white font-medium">
                        {log.user?.name || 'System'}
                      </p>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded">
                        {log.module}
                      </span>
                      <span className="text-xs text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {log.ip_address || '-'}
                      </span>
                      {log.reference_id && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Ref: #{log.reference_id}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(log.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onViewDetail('activity', log)}
                  className="p-2 hover:bg-indigo-500/20 rounded-lg transition-all text-slate-400 hover:text-indigo-400 opacity-0 group-hover:opacity-100"
                  title="Lihat Detail"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Pagination
          pagination={activityPagination}
          currentPage={activityPage}
          onPageChange={setActivityPage}
        />
      </Card>
    </div>
  );
};

export default ActivityLogsTab;