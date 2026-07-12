// src/pages/dashboard/components/SecurityAlertsTab.jsx
import React from 'react';
import { Search, X, RefreshCw, Eye, AlertTriangle, MapPin, Clock } from 'lucide-react';
import Card from '../../../common/Card';
import StatusBadge from './common/StatusBadge';
import LoadingState from './common/LoadingState';
import EmptyState from './common/EmptyState';
import Pagination from './common/Pagination';
import useSecurityAlerts from '../../../hooks/useSecurityAlerts';

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

const SecurityAlertsTab = ({ onViewDetail }) => {
  const {
    data: securityAlerts,
    pagination: alertPagination,
    isLoading: alertLoading,
    isFetching: alertFetching,
    refetch: refetchAlerts,
    page: alertPage,
    setPage: setAlertPage,
    search: alertSearch,
    setSearch: setAlertSearch,
    severity: alertSeverity,
    setSeverity: setAlertSeverity,
  } = useSecurityAlerts();

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Filters */}
      <Card variant="glass" padding="md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tipe alert..."
              value={alertSearch}
              onChange={(e) => setAlertSearch(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            {alertSearch && (
              <button
                onClick={() => setAlertSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={alertSeverity}
            onChange={(e) => setAlertSeverity(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all"
          >
            <option value="">Semua Severity</option>
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
            <option value="critical">Kritis</option>
          </select>

          <button
            onClick={refetchAlerts}
            disabled={alertFetching}
            className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-400 ${alertFetching ? 'animate-spin' : ''}`} />
          </button>

          <div className="ml-auto text-sm text-slate-400">
            <span className="font-semibold text-indigo-400">{alertPagination.total || 0}</span> alert
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <Card variant="gradient" padding="md">
        {alertLoading ? (
          <LoadingState message="Memuat alert keamanan..." />
        ) : securityAlerts.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="Tidak ada alert"
            description="Tidak ada alert keamanan yang tercatat"
          />
        ) : (
          <div className="space-y-3">
            {securityAlerts.map((alert, index) => {
              const severityColors = {
                critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
                high: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
                medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
                low: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
              };

              const colors = severityColors[alert.severity] || severityColors.low;

              return (
                <div
                  key={alert.id}
                  className={`flex items-start justify-between p-4 rounded-xl border transition-all group animate-slideUp ${colors.bg} ${colors.border} hover:bg-opacity-30`}
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                      <AlertTriangle className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-white font-medium capitalize">
                          {alert.type?.replace(/_/g, ' ')}
                        </p>
                        <StatusBadge status={alert.severity} />
                        <StatusBadge status={alert.resolved ? 'resolved' : 'unresolved'} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        User: <span className="text-white">{alert.user?.name || '-'}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.ip_address || '-'}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(alert.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewDetail('alert', alert)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white opacity-0 group-hover:opacity-100"
                    title="Lihat Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <Pagination
          pagination={alertPagination}
          currentPage={alertPage}
          onPageChange={setAlertPage}
        />
      </Card>
    </div>
  );
};

export default SecurityAlertsTab;