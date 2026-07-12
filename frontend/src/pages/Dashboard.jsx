// src/pages/Dashboard.jsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  LogIn,
  LogOut,
  ShieldAlert,
  Activity,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Lock,
  Globe,
  Mail,
  User,
  MapPin,
  Hash,
  LayoutDashboard,
  Zap,
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../hooks/useAuth';
import Card from '../common/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    useStats,
    useLoginLogs,
    useActivityLogs,
    useBlockedIps,
    useSecurityAlerts,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('overview');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  
  // PERBAIKAN: Gunakan useRef untuk lastUpdate agar tidak trigger re-render
  const lastUpdateRef = useRef(new Date());
  const [lastUpdate, setLastUpdate] = useState(lastUpdateRef.current);

  // Per-tab state
  const [loginPage, setLoginPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [blockedPage, setBlockedPage] = useState(1);
  const [alertPage, setAlertPage] = useState(1);

  const [loginSearch, setLoginSearch] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [activityModule, setActivityModule] = useState('');
  const [blockedSearch, setBlockedSearch] = useState('');
  const [blockedFilter, setBlockedFilter] = useState('active');
  const [alertSearch, setAlertSearch] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');

  // Debounced searches
  const [debouncedLoginSearch, setDebouncedLoginSearch] = useState('');
  const [debouncedActivitySearch, setDebouncedActivitySearch] = useState('');
  const [debouncedBlockedSearch, setDebouncedBlockedSearch] = useState('');
  const [debouncedAlertSearch, setDebouncedAlertSearch] = useState('');

  // Debounce effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLoginSearch(loginSearch);
      setLoginPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [loginSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedActivitySearch(activitySearch);
      setActivityPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [activitySearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBlockedSearch(blockedSearch);
      setBlockedPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [blockedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAlertSearch(alertSearch);
      setAlertPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [alertSearch]);

  // Reset page saat filter berubah
  useEffect(() => {
    setLoginPage(1);
  }, [loginStatus]);

  useEffect(() => {
    setActivityPage(1);
  }, [activityModule]);

  useEffect(() => {
    setBlockedPage(1);
  }, [blockedFilter]);

  useEffect(() => {
    setAlertPage(1);
  }, [alertSeverity]);

  // Queries
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useStats();

  const {
    data: loginResponse,
    isLoading: loginLoading,
    refetch: refetchLogin,
    isFetching: loginFetching,
  } = useLoginLogs(loginPage, {
    email: debouncedLoginSearch,
    status: loginStatus,
  });

  const {
    data: activityResponse,
    isLoading: activityLoading,
    refetch: refetchActivity,
    isFetching: activityFetching,
  } = useActivityLogs(activityPage, {
    module: activityModule,
    action: debouncedActivitySearch,
  });

  const {
    data: blockedResponse,
    isLoading: blockedLoading,
    refetch: refetchBlocked,
    isFetching: blockedFetching,
  } = useBlockedIps(blockedPage, {
    ip: debouncedBlockedSearch,
    active_only: blockedFilter === 'active',
  });

  const {
    data: alertResponse,
    isLoading: alertLoading,
    refetch: refetchAlerts,
    isFetching: alertFetching,
  } = useSecurityAlerts(alertPage, {
    type: debouncedAlertSearch,
    severity: alertSeverity,
  });

  // Extract data dengan useMemo agar stable reference
  const loginLogs = useMemo(() => loginResponse?.data?.data || [], [loginResponse]);
  const loginPagination = useMemo(() => loginResponse?.data?.meta || {}, [loginResponse]);

  const activityLogs = useMemo(() => activityResponse?.data?.data || [], [activityResponse]);
  const activityPagination = useMemo(() => activityResponse?.data?.meta || {}, [activityResponse]);

  const blockedIps = useMemo(() => blockedResponse?.data?.data || [], [blockedResponse]);
  const blockedPagination = useMemo(() => blockedResponse?.data?.meta || {}, [blockedResponse]);

  const securityAlerts = useMemo(() => alertResponse?.data?.data || [], [alertResponse]);
  const alertPagination = useMemo(() => alertResponse?.data?.meta || {}, [alertResponse]);

  // PERBAIKAN: Update lastUpdate hanya saat data benar-benar berubah (berdasarkan length)
  useEffect(() => {
    const now = new Date();
    lastUpdateRef.current = now;
    setLastUpdate(now);
  }, [
    loginLogs.length,
    activityLogs.length,
    blockedIps.length,
    securityAlerts.length,
    stats?.users_total,
  ]);

  // PERBAIKAN: handleRefreshAll dengan stable reference
  const handleRefreshAll = useCallback(async () => {
    await Promise.all([
      refetchStats(),
      refetchLogin(),
      refetchActivity(),
      refetchBlocked(),
      refetchAlerts(),
    ]);
  }, [refetchStats, refetchLogin, refetchActivity, refetchBlocked, refetchAlerts]);

  const handleViewDetail = useCallback((type, data) => {
    setSelectedLog({ ...data, type });
    setShowDetailModal(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetailModal(false);
    setSelectedLog(null);
  }, []);

  // Helper functions
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', {
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

  // Status Badge Component
  const StatusBadge = React.memo(({ status, size = 'sm' }) => {
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
    };

    const info = statusMap[status] || { label: status || '-', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

    return (
      <span className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${info.color}`}>
        {info.label}
      </span>
    );
  });

  // Stats Cards
  const statsCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        id: 'users_total',
        title: 'Total User',
        value: stats.users_total || 0,
        icon: Users,
        color: 'from-blue-500 to-indigo-600',
      },
      {
        id: 'users_active',
        title: 'User Aktif',
        value: stats.users_active || 0,
        icon: UserCheck,
        color: 'from-emerald-500 to-teal-600',
      },
      {
        id: 'users_inactive',
        title: 'User Nonaktif',
        value: stats.users_inactive || 0,
        icon: UserX,
        color: 'from-red-500 to-rose-600',
      },
      {
        id: 'users_locked',
        title: 'User Terkunci',
        value: stats.users_locked || 0,
        icon: Lock,
        color: 'from-orange-500 to-amber-600',
      },
      {
        id: 'login_success',
        title: 'Login Sukses',
        subtitle: 'Hari ini',
        value: stats.login_success_today || 0,
        icon: LogIn,
        color: 'from-emerald-500 to-green-600',
      },
      {
        id: 'login_failed',
        title: 'Login Gagal',
        subtitle: 'Hari ini',
        value: stats.login_failed_today || 0,
        icon: LogOut,
        color: 'from-red-500 to-rose-600',
      },
      {
        id: 'blocked_ips',
        title: 'IP Diblokir',
        value: stats.blocked_ips || 0,
        icon: ShieldAlert,
        color: 'from-orange-500 to-amber-600',
      },
      {
        id: 'security_alerts',
        title: 'Alert Keamanan',
        value: stats.security_alerts_open || 0,
        icon: AlertTriangle,
        color: 'from-red-500 to-pink-600',
      },
      {
        id: 'security_critical',
        title: 'Alert Kritis',
        value: stats.security_alerts_critical || 0,
        icon: Zap,
        color: 'from-red-600 to-red-700',
      },
      {
        id: 'activity_today',
        title: 'Aktivitas',
        subtitle: 'Hari ini',
        value: stats.activity_today || 0,
        icon: Activity,
        color: 'from-purple-500 to-pink-600',
      },
    ];
  }, [stats]);

  // Loading Component
  const LoadingState = ({ message = 'Memuat data...' }) => (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <p className="text-slate-400 text-sm animate-pulse">{message}</p>
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md">{description}</p>
    </div>
  );

  // Pagination Component
  const Pagination = ({ pagination, currentPage, onPageChange }) => {
    if (!pagination.last_page || pagination.last_page <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-700/50">
        <p className="text-sm text-slate-400">
          Menampilkan <span className="font-semibold text-white">{pagination.from || 0}</span> -{' '}
          <span className="font-semibold text-white">{pagination.to || 0}</span> dari{' '}
          <span className="font-semibold text-indigo-400">{pagination.total || 0}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg">
            <span className="text-sm font-semibold text-white">{currentPage}</span>
            <span className="text-sm text-slate-400">/</span>
            <span className="text-sm text-slate-400">{pagination.last_page}</span>
          </div>
          <button
            onClick={() => onPageChange((p) => Math.min(pagination.last_page, p + 1))}
            disabled={currentPage === pagination.last_page}
            className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    );
  };

  // Overview Tab
  const renderOverview = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card variant="elevated" padding="md" className="group relative overflow-hidden h-full">
                <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-linear-to-br ${stat.color} shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      {stat.title}
                    </p>
                    {stat.subtitle && (
                      <p className="text-slate-500 text-xs mt-0.5">{stat.subtitle}</p>
                    )}
                    <p className="text-3xl font-bold text-white mt-2 group-hover:scale-105 transition-transform origin-left">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold">Aksi Cepat</h3>
            <p className="text-slate-400 text-sm">Akses cepat ke fitur utama</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Lihat Login Logs', icon: LogIn, color: 'from-blue-500 to-indigo-600', tab: 'login-logs' },
            { label: 'Lihat Aktivitas', icon: Activity, color: 'from-purple-500 to-pink-600', tab: 'activity-logs' },
            { label: 'IP Diblokir', icon: ShieldAlert, color: 'from-orange-500 to-amber-600', tab: 'blocked-ips' },
            { label: 'Alert Keamanan', icon: AlertTriangle, color: 'from-red-500 to-pink-600', tab: 'security-alerts' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.tab}
                onClick={() => setActiveTab(action.tab)}
                className="group flex flex-col items-center gap-2 p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-indigo-500/30 rounded-xl transition-all"
              >
                <div className={`p-3 rounded-xl bg-linear-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-slate-300 font-medium text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* System Info */}
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Informasi Sistem</h3>
            <p className="text-slate-400 text-sm">Status sistem terakhir diperbarui</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-slate-400">Terakhir Diperbarui</p>
              <p className="text-sm text-white font-medium">{formatTime(lastUpdate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Tanggal</p>
              <p className="text-sm text-white font-medium">{formatDate(lastUpdate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
            <User className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-xs text-slate-400">Login Sebagai</p>
              <p className="text-sm text-white font-medium truncate">{user?.name || '-'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Login Logs Tab
  const renderLoginLogs = () => (
    <div className="space-y-4 animate-fadeIn">
      {/* Filters */}
      <Card variant="glass" padding="md">
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
      </Card>

      {/* Table */}
      <Card variant="gradient" padding="none">
        {loginLoading ? (
          <LoadingState message="Memuat log login..." />
        ) : loginLogs.length === 0 ? (
          <EmptyState
            icon={LogIn}
            title="Tidak ada log login"
            description="Belum ada log login yang tercatat"
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
                        onClick={() => handleViewDetail('login', log)}
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

  // Activity Logs Tab
  const renderActivityLogs = () => (
    <div className="space-y-4 animate-fadeIn">
      {/* Filters */}
      <Card variant="glass" padding="md">
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
      </Card>

      {/* Activity List */}
      <Card variant="gradient" padding="md">
        {activityLoading ? (
          <LoadingState message="Memuat log aktivitas..." />
        ) : activityLogs.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="Tidak ada aktivitas"
            description="Belum ada aktivitas yang tercatat"
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
                  onClick={() => handleViewDetail('activity', log)}
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

  // Blocked IPs Tab
  const renderBlockedIps = () => (
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
                        onClick={() => handleViewDetail('blocked', ip)}
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

  // Security Alerts Tab
  const renderSecurityAlerts = () => (
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
                    onClick={() => handleViewDetail('alert', alert)}
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

  // Detail Modal
  const DetailModal = () => {
    if (!selectedLog) return null;

    const getTitle = () => {
      switch (selectedLog.type) {
        case 'login': return 'Detail Log Login';
        case 'activity': return 'Detail Log Aktivitas';
        case 'blocked': return 'Detail IP Diblokir';
        case 'alert': return 'Detail Alert Keamanan';
        default: return 'Detail';
      }
    };

    const getIcon = () => {
      switch (selectedLog.type) {
        case 'login': return LogIn;
        case 'activity': return Activity;
        case 'blocked': return ShieldAlert;
        case 'alert': return AlertTriangle;
        default: return Info;
      }
    };

    const Icon = getIcon();

    const renderField = (key, value) => {
      if (['id', 'type', 'created_at', 'updated_at'].includes(key)) return null;
      if (value === null || value === undefined || value === '') return null;

      const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      if (key === 'user' && typeof value === 'object') {
        return (
          <div key={key} className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-white font-medium">{value.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{value.email}</span>
              </div>
            </div>
          </div>
        );
      }

      if (key === 'payload' || key === 'old_data' || key === 'new_data') {
        return (
          <div key={key} className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
            <pre className="text-slate-300 text-xs whitespace-pre-wrap break-all bg-slate-900/50 p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        );
      }

      if (key === 'status' || key === 'severity' || key === 'block_type' || key === 'resolved') {
        return (
          <div key={key} className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
            <StatusBadge status={typeof value === 'boolean' ? (value ? 'resolved' : 'unresolved') : value} size="md" />
          </div>
        );
      }

      if (key.includes('_at') || key.includes('_date')) {
        return (
          <div key={key} className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-white font-medium">{formatDateTime(value)}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{getTimeAgo(value)}</p>
          </div>
        );
      }

      return (
        <div key={key} className="bg-slate-700/30 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
          <p className="text-white font-medium break-all">{String(value)}</p>
        </div>
      );
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseDetail();
        }}
      >
        <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-700/50 animate-scaleIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{getTitle()}</h3>
                <p className="text-xs text-slate-400">ID: #{selectedLog.id}</p>
              </div>
            </div>
            <button
              onClick={handleCloseDetail}
              className="p-2 hover:bg-slate-700/50 rounded-xl transition-all text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(selectedLog).map(([key, value]) => renderField(key, value))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-slate-700/50 shrink-0">
            <button
              onClick={handleCloseDetail}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl text-sm font-medium text-slate-300 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'login-logs': return renderLoginLogs();
      case 'activity-logs': return renderActivityLogs();
      case 'blocked-ips': return renderBlockedIps();
      case 'security-alerts': return renderSecurityAlerts();
      default: return renderOverview();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Selamat datang, <span className="text-indigo-400 font-medium">{user?.name}</span>
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
          Refresh Semua
        </button>
      </div>

      {/* Tabs */}
      <Card variant="glass" padding="none">
        <div className="flex flex-wrap gap-2 p-4 border-b border-slate-700/50">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'login-logs', label: 'Log Login', icon: LogIn },
            { id: 'activity-logs', label: 'Log Aktivitas', icon: Activity },
            { id: 'blocked-ips', label: 'IP Diblokir', icon: ShieldAlert },
            { id: 'security-alerts', label: 'Alert Keamanan', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {renderContent()}
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && <DetailModal />}
    </div>
  );
};

export default Dashboard;