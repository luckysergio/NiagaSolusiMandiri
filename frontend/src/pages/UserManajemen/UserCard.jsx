import React from 'react';
import {
  Mail,
  Shield,
  Clock,
  Check,
  XCircle,
  LogOut,
  Unlock,
  Edit,
  Trash2,
} from 'lucide-react';
import Card from '../../common/Card';

const UserCard = ({ 
  user, 
  onToggleActive, 
  onForceLogout, 
  onResetLock, 
  onEdit, 
  onDelete,
  isMutating 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Belum pernah';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card variant="elevated" className="group relative overflow-hidden h-full flex flex-col">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex-1 flex flex-col space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg ${
              user.is_active 
                ? 'bg-linear-to-br from-indigo-500 to-purple-500' 
                : 'bg-linear-to-br from-slate-600 to-slate-700'
            }`}>
              {getInitials(user.name)}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-slate-800 ${
              user.is_active ? 'bg-emerald-500' : 'bg-slate-500'
            }`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-indigo-300 transition-colors">
              {user.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
              <p className="text-slate-400 text-xs sm:text-sm truncate">{user.email}</p>
            </div>
          </div>

          <div className={`shrink-0 px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${
            user.is_active 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {user.is_active ? 'Aktif' : 'Nonaktif'}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-300 truncate">
              {user.role?.display_name || 'No Role'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-400 truncate">
              {formatDate(user.last_login_at)}
            </span>
          </div>
        </div>

        <div className="pt-2 mt-auto border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <button
              onClick={() => onToggleActive(user)}
              disabled={isMutating}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                user.is_active
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
              }`}
              title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
            >
              {user.is_active ? <XCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              <span>{user.is_active ? 'Nonaktif' : 'Aktif'}</span>
            </button>

            <button
              onClick={() => onEdit(user)}
              disabled={isMutating}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => onForceLogout(user)}
              disabled={isMutating}
              className="flex-1 p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Force Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-xs hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={() => onResetLock(user)}
              disabled={isMutating}
              className="flex-1 p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Reset Lock"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span className="text-xs hidden sm:inline">Unlock</span>
            </button>

            <button
              onClick={() => onDelete(user)}
              disabled={isMutating}
              className="flex-1 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-xs hidden sm:inline">Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;