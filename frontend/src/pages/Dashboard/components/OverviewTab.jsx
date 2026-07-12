// src/pages/dashboard/components/OverviewTab.jsx
import React, { useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  LogIn,
  LogOut,
  ShieldAlert,
  Activity,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  User,
  Lock,
  Zap,
} from 'lucide-react';
import Card from '../../../common/Card';

const OverviewTab = ({ stats, lastUpdate, onTabChange }) => {
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', {
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

  const statsCards = useMemo(() => {
    if (!stats) return [];

    return [
      { id: 'users_total', title: 'Total User', value: stats.users_total || 0, icon: Users, color: 'from-blue-500 to-indigo-600' },
      { id: 'users_active', title: 'User Aktif', value: stats.users_active || 0, icon: UserCheck, color: 'from-emerald-500 to-teal-600' },
      { id: 'users_inactive', title: 'User Nonaktif', value: stats.users_inactive || 0, icon: UserX, color: 'from-red-500 to-rose-600' },
      { id: 'users_locked', title: 'User Terkunci', value: stats.users_locked || 0, icon: Lock, color: 'from-orange-500 to-amber-600' },
      { id: 'login_success', title: 'Login Sukses', subtitle: 'Hari ini', value: stats.login_success_today || 0, icon: LogIn, color: 'from-emerald-500 to-green-600' },
      { id: 'login_failed', title: 'Login Gagal', subtitle: 'Hari ini', value: stats.login_failed_today || 0, icon: LogOut, color: 'from-red-500 to-rose-600' },
      { id: 'blocked_ips', title: 'IP Diblokir', value: stats.blocked_ips || 0, icon: ShieldAlert, color: 'from-orange-500 to-amber-600' },
      { id: 'security_alerts', title: 'Alert Keamanan', value: stats.security_alerts_open || 0, icon: AlertTriangle, color: 'from-red-500 to-pink-600' },
      { id: 'security_critical', title: 'Alert Kritis', value: stats.security_alerts_critical || 0, icon: Zap, color: 'from-red-600 to-red-700' },
      { id: 'activity_today', title: 'Aktivitas', subtitle: 'Hari ini', value: stats.activity_today || 0, icon: Activity, color: 'from-purple-500 to-pink-600' },
    ];
  }, [stats]);

  return (
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
                onClick={() => onTabChange(action.tab)}
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
              <p className="text-sm text-white font-medium truncate">Admin</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OverviewTab;