// src/pages/dashboard/components/DetailModal.jsx
import React from 'react';
import {
  X,
  Info,
  LogIn,
  Activity,
  ShieldAlert,
  AlertTriangle,
  User,
  Mail,
  Clock,
} from 'lucide-react';
import StatusBadge from './common/StatusBadge';

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

const DetailModal = ({ selectedLog, onClose }) => {
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
          <StatusBadge
            status={typeof value === 'boolean' ? (value ? 'resolved' : 'unresolved') : value}
            size="md"
          />
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
        if (e.target === e.currentTarget) onClose();
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
            onClick={onClose}
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
            onClick={onClose}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl text-sm font-medium text-slate-300 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;