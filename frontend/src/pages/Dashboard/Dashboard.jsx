// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  LogIn,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { useRealTimeDashboard } from '../../hooks/useRealTimeDashboard';
import { echo } from '../../lib/echo';
import Card from '../../common/Card';

import OverviewTab from './components/OverviewTab';
import LoginLogsTab from './components/LoginLogsTab';
import ActivityLogsTab from './components/ActivityLogsTab';
import BlockedIpsTab from './components/BlockedIpsTab';
import SecurityAlertsTab from './components/SecurityAlertsTab';
import DetailModal from './components/DetailModal';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    useStats,
    useLoginLogs,
    useActivityLogs,
    useBlockedIps,
    useSecurityAlerts,
  } = useDashboard();

  useRealTimeDashboard();

  const [activeTab, setActiveTab] = useState('overview');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);

  const { data: stats } = useStats();
  const loginLogsQuery = useLoginLogs();
  const activityLogsQuery = useActivityLogs();
  const blockedIpsQuery = useBlockedIps();
  const securityAlertsQuery = useSecurityAlerts();

  useEffect(() => {
    if (!echo || !echo.connector || !echo.connector.pusher) return;

    const pusher = echo.connector.pusher;

    const updateConnectionStatus = () => {
      setIsConnected(pusher.connection.state === 'connected');
    };

    pusher.connection.bind('connected', updateConnectionStatus);
    pusher.connection.bind('disconnected', updateConnectionStatus);
    pusher.connection.bind('unavailable', updateConnectionStatus);

    updateConnectionStatus();

    return () => {
      pusher.connection.unbind('connected', updateConnectionStatus);
      pusher.connection.unbind('disconnected', updateConnectionStatus);
      pusher.connection.unbind('unavailable', updateConnectionStatus);
    };
  }, []);

  useEffect(() => {
    setLastUpdate(new Date());
  }, [
    stats,
    loginLogsQuery.data,
    activityLogsQuery.data,
    blockedIpsQuery.data,
    securityAlertsQuery.data,
  ]);

  const handleViewDetail = (type, data) => {
    setSelectedLog({ ...data, type });
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedLog(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'login-logs', label: 'Log Login', icon: LogIn },
    { id: 'activity-logs', label: 'Log Aktivitas', icon: Activity },
    { id: 'blocked-ips', label: 'IP Diblokir', icon: ShieldAlert },
    { id: 'security-alerts', label: 'Alert Keamanan', icon: AlertTriangle },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            stats={stats}
            lastUpdate={lastUpdate}
            onTabChange={setActiveTab}
          />
        );
      case 'login-logs':
        return (
          <LoginLogsTab
            query={loginLogsQuery}
            onViewDetail={handleViewDetail}
          />
        );
      case 'activity-logs':
        return (
          <ActivityLogsTab
            query={activityLogsQuery}
            onViewDetail={handleViewDetail}
          />
        );
      case 'blocked-ips':
        return (
          <BlockedIpsTab
            query={blockedIpsQuery}
            onViewDetail={handleViewDetail}
          />
        );
      case 'security-alerts':
        return (
          <SecurityAlertsTab
            query={securityAlertsQuery}
            onViewDetail={handleViewDetail}
          />
        );
      default:
        return null;
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);

    if (diff < 10) return 'Baru saja';
    if (diff < 60) return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    return lastUpdate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Tabs */}
      <Card variant="glass" padding="none">
        <div className="flex flex-wrap gap-2 p-4 border-b border-slate-700/50">
          {tabs.map((tab) => {
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
          {renderTabContent()}
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && (
        <DetailModal
          selectedLog={selectedLog}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default Dashboard;