import React, { useState, useEffect } from 'react';
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
  Filter,
  Download,
  Lock,
  Unlock,
  Server,
  Globe,
  Mail,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../contexts/ModalContext';
import { dashboardApi } from '../api/dashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const { showError, showSuccess, showLoading, closeLoading } = useModal();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    users_total: 0,
    users_active: 0,
    users_inactive: 0,
    login_success_today: 0,
    login_failed_today: 0,
    blocked_ips: 0,
    security_alerts_open: 0,
    activity_today: 0,
  });
  const [loginLogs, setLoginLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [blockedIps, setBlockedIps] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loginPage, setLoginPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [blockedPage, setBlockedPage] = useState(1);
  const [alertPage, setAlertPage] = useState(1);
  const [loginPagination, setLoginPagination] = useState({});
  const [activityPagination, setActivityPagination] = useState({});
  const [blockedPagination, setBlockedPagination] = useState({});
  const [alertPagination, setAlertPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [statsData, loginData, activityData, blockedData, alertData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getLoginLogs(loginPage, { search: searchTerm }),
        dashboardApi.getActivityLogs(activityPage, { search: searchTerm }),
        dashboardApi.getBlockedIps(blockedPage, { active_only: true }),
        dashboardApi.getSecurityAlerts(alertPage, { unresolved_only: true }),
      ]);

      setStats(statsData.data || statsData);
      setLoginLogs(loginData.data?.data || []);
      setLoginPagination(loginData.data || {});
      setActivityLogs(activityData.data?.data || []);
      setActivityPagination(activityData.data || {});
      setBlockedIps(blockedData.data?.data || []);
      setBlockedPagination(blockedData.data || {});
      setSecurityAlerts(alertData.data?.data || []);
      setAlertPagination(alertData.data || {});
    } catch {
      showError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      showLoading('Memperbarui Data...', 'Mohon tunggu sebentar');
      await fetchAllData();
      closeLoading();
      showSuccess('Berhasil', 'Data dashboard berhasil diperbarui');
    } catch {
      closeLoading();
      showError('Gagal memperbarui data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [loginPage, activityPage, blockedPage, alertPage, searchTerm]);

  const viewDetail = async (type, id) => {
    try {
      showLoading('Memuat Detail...', 'Mohon tunggu sebentar');
      let detail;
      
      if (type === 'login') {
        const response = await dashboardApi.getLoginLogDetail(id);
        detail = response.data;
      } else if (type === 'activity') {
        const response = await dashboardApi.getActivityLogDetail(id);
        detail = response.data;
      } else if (type === 'blocked') {
        const response = await dashboardApi.getBlockedIpDetail(id);
        detail = response.data;
      } else if (type === 'alert') {
        const response = await dashboardApi.getSecurityAlertDetail(id);
        detail = response.data;
      }
      
      closeLoading();
      setSelectedLog({ ...detail, type });
      setShowDetailModal(true);
    } catch {
      closeLoading();
      showError('Gagal memuat detail');
    }
  };

  const StatusBadge = ({ status }) => {
    const statusMap = {
      success: { label: 'Sukses', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      failed: { label: 'Gagal', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
      logout: { label: 'Logout', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
      refresh: { label: 'Refresh', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      blocked: { label: 'Diblokir', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
      active: { label: 'Aktif', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      expired: { label: 'Kadaluarsa', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
      permanent: { label: 'Permanen', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
      temporary: { label: 'Sementara', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      manual: { label: 'Manual', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      auto: { label: 'Otomatis', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
      low: { label: 'Rendah', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      medium: { label: 'Sedang', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
      high: { label: 'Tinggi', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
      critical: { label: 'Kritis', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };

    const info = statusMap[status] || statusMap.failed;
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${info.color}`}>
        {info.label}
      </span>
    );
  };

  const statsCards = [
    { id: 'users_total', title: 'Total User', value: stats.users_total, icon: Users, color: 'from-blue-600 to-indigo-600' },
    { id: 'users_active', title: 'User Aktif', value: stats.users_active, icon: UserCheck, color: 'from-emerald-600 to-teal-600' },
    { id: 'users_inactive', title: 'User Tidak Aktif', value: stats.users_inactive, icon: UserX, color: 'from-red-600 to-rose-600' },
    { id: 'login_success', title: 'Login Berhasil (Hari Ini)', value: stats.login_success_today, icon: LogIn, color: 'from-emerald-600 to-green-600' },
    { id: 'login_failed', title: 'Login Gagal (Hari Ini)', value: stats.login_failed_today, icon: LogOut, color: 'from-red-600 to-rose-600' },
    { id: 'blocked_ips', title: 'IP Diblokir', value: stats.blocked_ips, icon: ShieldAlert, color: 'from-orange-600 to-amber-600' },
    { id: 'security_alerts', title: 'Alert Keamanan', value: stats.security_alerts_open || 0, icon: AlertTriangle, color: 'from-red-600 to-pink-600' },
    { id: 'activity_today', title: 'Aktivitas Hari Ini', value: stats.activity_today, icon: Activity, color: 'from-purple-600 to-pink-600' },
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLoginLogs = () => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-semibold">Log Login</h3>
          <p className="text-slate-400 text-sm">Riwayat login semua user</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari email/IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="p-2 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b border-slate-700/50">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">IP Address</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Waktu</th>
              <th className="pb-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loginLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">Tidak ada data log</td>
              </tr>
            ) : (
              loginLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3 text-white text-sm">{log.user?.name || '-'}</td>
                  <td className="py-3 text-slate-300 text-sm">{log.email}</td>
                  <td className="py-3 text-slate-300 text-sm font-mono">{log.ip_address}</td>
                  <td className="py-3"><StatusBadge status={log.status} /></td>
                  <td className="py-3 text-slate-400 text-sm">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => viewDetail('login', log.id)} className="p-1.5 hover:bg-indigo-500/20 rounded-lg transition text-slate-400 hover:text-indigo-400">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {loginPagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">
            Menampilkan {loginPagination.from || 0} - {loginPagination.to || 0} dari {loginPagination.total || 0}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setLoginPage(p => Math.max(1, p - 1))} disabled={loginPagination.current_page === 1} className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-sm text-slate-400">{loginPagination.current_page} / {loginPagination.last_page}</span>
            <button onClick={() => setLoginPage(p => Math.min(loginPagination.last_page, p + 1))} disabled={loginPagination.current_page === loginPagination.last_page} className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderActivityLogs = () => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-semibold">Log Aktivitas</h3>
          <p className="text-slate-400 text-sm">Riwayat aktivitas semua user</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari aktivitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="space-y-3">
        {activityLogs.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">Tidak ada data aktivitas</p>
        ) : (
          activityLogs.map((log) => (
            <div key={log.id} className="flex items-start justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition group">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{log.user?.name || 'System'}</span>
                    <span className="text-slate-400"> {log.module || ''} - {log.action || 'Melakukan aktivitas'}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{log.ip_address || '-'}</span>
                    {log.reference_id && <span className="text-xs text-slate-500">Ref: #{log.reference_id}</span>}
                    <span className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => viewDetail('activity', log.id)} className="p-1.5 hover:bg-indigo-500/20 rounded-lg transition text-slate-400 hover:text-indigo-400 opacity-0 group-hover:opacity-100">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {activityPagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">Menampilkan {activityPagination.from || 0} - {activityPagination.to || 0} dari {activityPagination.total || 0}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setActivityPage(p => Math.max(1, p - 1))} disabled={activityPagination.current_page === 1} className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-sm text-slate-400">{activityPagination.current_page} / {activityPagination.last_page}</span>
            <button onClick={() => setActivityPage(p => Math.min(activityPagination.last_page, p + 1))} disabled={activityPagination.current_page === activityPagination.last_page} className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderBlockedIps = () => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-semibold">IP Diblokir</h3>
          <p className="text-slate-400 text-sm">Daftar IP yang diblokir</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b border-slate-700/50">
              <th className="pb-3 font-medium">IP Address</th>
              <th className="pb-3 font-medium">Attempts</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Blocked Until</th>
              <th className="pb-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {blockedIps.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">Tidak ada IP yang diblokir</td>
              </tr>
            ) : (
              blockedIps.map((ip) => (
                <tr key={ip.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3">
                    <p className="text-white text-sm font-mono">{ip.ip_address}</p>
                  </td>
                  <td className="py-3 text-slate-300 text-sm">{ip.attempts}</td>
                  <td className="py-3"><StatusBadge status={ip.block_type} /></td>
                  <td className="py-3"><StatusBadge status={ip.is_active ? 'active' : 'expired'} /></td>
                  <td className="py-3 text-slate-400 text-sm">
                    {ip.blocked_until ? new Date(ip.blocked_until).toLocaleString('id-ID') : 'Permanen'}
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => viewDetail('blocked', ip.id)} className="p-1.5 hover:bg-indigo-500/20 rounded-lg transition text-slate-400 hover:text-indigo-400">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {blockedPagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">Menampilkan {blockedPagination.from || 0} - {blockedPagination.to || 0} dari {blockedPagination.total || 0}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setBlockedPage(p => Math.max(1, p - 1))} disabled={blockedPagination.current_page === 1} className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-sm text-slate-400">{blockedPagination.current_page} / {blockedPagination.last_page}</span>
            <button onClick={() => setBlockedPage(p => Math.min(blockedPagination.last_page, p + 1))} disabled={blockedPagination.current_page === blockedPagination.last_page} className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityAlerts = () => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-semibold">Alert Keamanan</h3>
          <p className="text-slate-400 text-sm">Daftar alert keamanan</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari alert..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="space-y-3">
        {securityAlerts.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">Tidak ada alert keamanan</p>
        ) : (
          securityAlerts.map((alert) => (
            <div key={alert.id} className="flex items-start justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition group">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-500/20' :
                  alert.severity === 'high' ? 'bg-orange-500/20' :
                  alert.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    alert.severity === 'critical' ? 'text-red-400' :
                    alert.severity === 'high' ? 'text-orange-400' :
                    alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium">{alert.type}</p>
                    <StatusBadge status={alert.severity} />
                  </div>
                  <p className="text-xs text-slate-400">User: {alert.user?.name || '-'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{alert.ip_address || '-'}</span>
                    <span className="text-xs text-slate-500">
                      {alert.resolved ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Terselesaikan
                        </span>
                      ) : (
                        <span className="text-orange-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Belum terselesaikan
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(alert.created_at).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => viewDetail('alert', alert.id)} className="p-1.5 hover:bg-indigo-500/20 rounded-lg transition text-slate-400 hover:text-indigo-400 opacity-0 group-hover:opacity-100">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {alertPagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">Menampilkan {alertPagination.from || 0} - {alertPagination.to || 0} dari {alertPagination.total || 0}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setAlertPage(p => Math.max(1, p - 1))} disabled={alertPagination.current_page === 1} className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-sm text-slate-400">{alertPagination.current_page} / {alertPagination.last_page}</span>
            <button onClick={() => setAlertPage(p => Math.min(alertPagination.last_page, p + 1))} disabled={alertPagination.current_page === alertPagination.last_page} className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

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

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-700/50">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Info className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{getTitle()}</h3>
                <p className="text-xs text-slate-400">ID: #{selectedLog.id}</p>
              </div>
            </div>
            <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-slate-700/50 rounded-xl transition text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {Object.entries(selectedLog).map(([key, value]) => {
                if (['id', 'type', 'user', 'blocker', 'created_at', 'updated_at'].includes(key)) return null;
                if (value === null || value === undefined || value === '') return null;
                if (typeof value === 'object') {
                  return (
                    <div key={key} className="bg-slate-700/30 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-2">{key.replace(/_/g, ' ').toUpperCase()}</p>
                      <pre className="text-slate-300 text-xs whitespace-pre-wrap break-all">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  );
                }
                return (
                  <div key={key} className="bg-slate-700/30 rounded-xl p-3">
                    <p className="text-xs text-slate-400">{key.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-white font-medium">{String(value)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end p-4 border-t border-slate-700/50">
            <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 transition">
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap gap-2 border-b border-slate-700/50 pb-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'login-logs', label: 'Log Login' },
          { id: 'activity-logs', label: 'Log Aktivitas' },
          { id: 'blocked-ips', label: 'IP Diblokir' },
          { id: 'security-alerts', label: 'Alert Keamanan' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
      {showDetailModal && <DetailModal />}
    </div>
  );
};

export default Dashboard;