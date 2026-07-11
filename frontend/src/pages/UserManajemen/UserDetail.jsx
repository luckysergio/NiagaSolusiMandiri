// src/pages/admin/UserDetail.jsx
import React from 'react';
import { User, Mail, Shield, Calendar, Clock, Lock, AlertCircle } from 'lucide-react';
import { useUserManagement } from '../../hooks/useUserManagement';
import Card from '../../common/Card';

const UserDetail = ({ userId }) => {
  const { useUser } = useUserManagement();
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <Card variant="gradient" padding="lg" className="max-w-2xl">
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card variant="gradient" padding="lg" className="max-w-2xl">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>Gagal memuat data user</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="gradient" padding="lg" className="max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-slate-400">{user.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
            <Mail className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm text-white font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Role</p>
              <p className="text-sm text-white font-medium">
                {user.role?.display_name || '-'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xs text-slate-400">Terdaftar</p>
              <p className="text-sm text-white font-medium">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString('id-ID')
                  : '-'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-slate-400">Last Login</p>
              <p className="text-sm text-white font-medium">
                {user.last_login_at
                  ? new Date(user.last_login_at).toLocaleString('id-ID')
                  : 'Belum pernah'}
              </p>
            </div>
          </div>
        </div>

        {/* Status & Lock Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
            <span className="text-sm text-slate-400">Status</span>
            {user.is_active ? (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Aktif
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Nonaktif
              </span>
            )}
          </div>

          {user.is_locked && (
            <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-amber-400">Akun Terkunci</span>
              </div>
              {user.locked_until && (
                <span className="text-xs text-amber-300">
                  Sampai: {new Date(user.locked_until).toLocaleString('id-ID')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserDetail;