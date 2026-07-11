// src/pages/admin/RoleCard.jsx
import React from 'react';
import { Users, Edit, Trash2, Shield, Calendar } from 'lucide-react';
import Card from '../../common/Card';

const RoleCard = ({ role, onEdit, onDelete, isMutating }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
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

  const getUserCount = () => {
    return role.users_count ?? 0;
  };

  const hasUsers = getUserCount() > 0;

  return (
    <Card variant="elevated" className="group relative overflow-hidden h-full flex flex-col">
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex-1 flex flex-col space-y-3 p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg bg-linear-to-br from-purple-500 to-indigo-500">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Role Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-purple-300 transition-colors">
              {role.display_name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-slate-400 text-xs sm:text-sm font-mono bg-slate-700/50 px-2 py-0.5 rounded">
                {role.name}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 pt-1">
          {/* User Count */}
          <div className="flex items-center gap-2">
            <Users className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${hasUsers ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className={`text-xs sm:text-sm ${hasUsers ? 'text-slate-300' : 'text-slate-500'}`}>
              {getUserCount()} {getUserCount() === 1 ? 'User' : 'Users'}
            </span>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-400 truncate">
              Dibuat: {formatDate(role.created_at)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 mt-auto border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onEdit(role)}
              disabled={isMutating}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(role)}
              disabled={isMutating || hasUsers}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                hasUsers
                  ? 'bg-slate-700/30 text-slate-500 border-slate-600/30 cursor-not-allowed'
                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
              }`}
              title={hasUsers ? 'Tidak dapat dihapus - masih ada user' : 'Hapus'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{hasUsers ? 'Terpakai' : 'Hapus'}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RoleCard;