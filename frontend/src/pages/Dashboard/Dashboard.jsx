// src/pages/dashboard/Dashboard.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  RefreshCw,
  LayoutDashboard,
  LogIn,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
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

  const [activeTab, setActiveTab] = useState('overview');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const lastUpdateRef = useRef(new Date());
  const [lastUpdate, setLastUpdate] = useState(lastUpdateRef.current);

  // Queries
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useStats();
  const loginLogsQuery = useLoginLogs();
  const activityLogsQuery = useActivityLogs();
  const blockedIpsQuery = useBlockedIps();
  const securityAlertsQuery = useSecurityAlerts();

  // Update lastUpdate saat data berubah
  useEffect(() => {
    const now = new Date();
    lastUpdateRef.current = now;
    setLastUpdate(now);
  }, [
    loginLogsQuery.data?.length,
    activityLogsQuery.data?.length,
    blockedIpsQuery.data?.length,
    securityAlertsQuery.data?.length,
    stats?.users_total,
  ]);

  // Handlers
  const handleRefreshAll = useCallback(async () => {
    await Promise.all([
      refetchStats(),
      loginLogsQuery.refetch(),
      activityLogsQuery.refetch(),
      blockedIpsQuery.refetch(),
      securityAlertsQuery.refetch(),
    ]);
  }, [refetchStats, loginLogsQuery, activityLogsQuery, blockedIpsQuery, securityAlertsQuery]);

  const handleViewDetail = useCallback((type, data) => {
    setSelectedLog({ ...data, type });
    setShowDetailModal(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetailModal(false);
    setSelectedLog(null);
  }, []);

  // Tab configuration - MUDAH UNTUK DITAMBAH TAB BARU
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'login-logs', label: 'Log Login', icon: LogIn },
    { id: 'activity-logs', label: 'Log Aktivitas', icon: Activity },
    { id: 'blocked-ips', label: 'IP Diblokir', icon: ShieldAlert },
    { id: 'security-alerts', label: 'Alert Keamanan', icon: AlertTriangle },
    // NANTI TAMBAHKAN:
    // { id: 'products', label: 'Produk', icon: Package },
    // { id: 'sales', label: 'Penjualan', icon: ShoppingCart },
  ];

  // Render tab content
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
      // NANTI TAMBAHKAN:
      // case 'products':
      //   return <ProductsTab />;
      // case 'sales':
      //   return <SalesTab />;
      default:
        return null;
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