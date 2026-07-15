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

  const getUserCount = () => {
    return role.users_count ?? 0;
  };

  const hasUsers = getUserCount() > 0;

  return (
    <Card className="group relative overflow-hidden h-full flex flex-col border border-slate-700/50 bg-slate-800/40 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex-1 flex flex-col p-4 sm:p-5">
        
        <div className="flex items-center justify-end mb-3 h-6" />

        <div className="space-y-3 mb-4">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-linear-to-br from-purple-500 to-indigo-500">
              <Shield className="w-7 h-7" />
            </div>
          </div>
          <h3 className="text-white font-bold text-base sm:text-lg text-center wrap-break-word leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
            {role.display_name}
          </h3>
          
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/60 rounded-md border border-slate-700/50">
              <span className="text-slate-300 text-xs font-mono tracking-wide">
                {role.name}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent mb-4" />

        {/* Details Section */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${hasUsers ? 'bg-emerald-500/10' : 'bg-slate-500/10'}`}>
              <Users className={`w-3.5 h-3.5 ${hasUsers ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total User</span>
              <span className={`text-sm font-medium ${hasUsers ? 'text-slate-200' : 'text-slate-500'}`}>
                {getUserCount()} {getUserCount() === 1 ? 'User' : 'Users'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Dibuat</span>
              <span className="text-sm text-slate-200 font-medium">
                {formatDate(role.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions: Grid 2 Kolom */}
        <div className="mt-5 pt-4 border-t border-slate-700/40">
          <div className="grid grid-cols-2 gap-2">
            {/* Edit */}
            <button
              onClick={() => onEdit(role)}
              disabled={isMutating}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2.5 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">Edit</span>
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(role)}
              disabled={isMutating || hasUsers}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${
                hasUsers
                  ? 'bg-slate-700/30 text-slate-500 border-slate-600/30 cursor-not-allowed'
                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-500/40'
              }`}
              title={hasUsers ? 'Tidak dapat dihapus - masih ada user' : 'Hapus'}
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">{hasUsers ? 'Terpakai' : 'Hapus'}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RoleCard;