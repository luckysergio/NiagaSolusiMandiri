import React, { useMemo, useState } from 'react';
import {
  Users, UserCheck, LogIn, AlertTriangle, Info, Clock, Calendar, User,
  DollarSign, ShoppingCart, TrendingUp, TrendingDown, Package, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Card from '../../../common/Card';
import { formatRupiah } from '../../../utils/currency';
import { useDashboard } from '../../../hooks/useDashboard';

const OverviewTab = ({ stats, lastUpdate, user, onTabChange }) => {
  const [chartPeriod, setChartPeriod] = useState('monthly');
  
  // Fetch data transaksi spesifik untuk dashboard
  const { data: chartData } = useDashboard().useTransactionChart(chartPeriod);
  const { data: topProducts } = useDashboard().useTopProducts(5);
  const { data: recentTransactions } = useDashboard().useRecentTransactions(5);

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // 1. Statistik Sistem (Existing)
  const systemStatsCards = useMemo(() => {
    if (!stats) return [];
    return [
      { id: 'users_total', title: 'Total User', value: stats.users_total || 0, icon: Users, color: 'from-blue-500 to-indigo-600' },
      { id: 'users_active', title: 'User Aktif', value: stats.users_active || 0, icon: UserCheck, color: 'from-emerald-500 to-teal-600' },
      { id: 'login_success', title: 'Login Sukses', subtitle: 'Hari ini', value: stats.login_success_today || 0, icon: LogIn, color: 'from-emerald-500 to-green-600' },
      { id: 'security_alerts', title: 'Alert Keamanan', value: stats.security_alerts_open || 0, icon: AlertTriangle, color: 'from-red-500 to-pink-600' },
    ];
  }, [stats]);

  // 2. Statistik Transaksi (Baru)
  const txStats = stats?.transactions || {};
  const trend = txStats?.trend || {};

  const transactionStatsCards = useMemo(() => {
    if (!stats) return [];
    return [
      { id: 'total_revenue', title: 'Total Pendapatan', value: txStats.total_revenue || 0, icon: DollarSign, color: 'from-emerald-500 to-teal-600', isCurrency: true, trend: trend.revenue_change },
      { id: 'total_tx', title: 'Total Transaksi', value: txStats.total_count || 0, icon: ShoppingCart, color: 'from-blue-500 to-indigo-600', isCurrency: false, trend: trend.transaction_change },
      { id: 'total_profit', title: 'Total Profit', value: txStats.total_profit || 0, icon: TrendingUp, color: 'from-violet-500 to-purple-600', isCurrency: true, trend: txStats.profit_margin },
      { id: 'today_revenue', title: 'Pendapatan Hari Ini', value: txStats.today?.revenue || 0, icon: TrendingDown, color: 'from-amber-500 to-orange-600', isCurrency: true },
    ];
  }, [stats, txStats, trend]);

  // Komponen Kartu Statistik Reusable
  const StatCard = ({ title, value, icon: Icon, color, isCurrency = true, trend: trendValue, subtitle }) => {
    const isPositive = trendValue >= 0;
    return (
      <Card variant="elevated" className="p-5 group relative overflow-hidden h-full">
        {/* ✅ Perbaikan: bg-gradient-to-br (bukan bg-linear-to-br) */}
        <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-xl bg-linear-to-br ${color} shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            {trendValue !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{Math.abs(trendValue)}%</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</p>
            {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
            <p className="text-2xl font-bold text-white mt-2 group-hover:scale-105 transition-transform origin-left">
              {isCurrency ? formatRupiah(value) : value}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  // Data untuk Pie Chart
  const statusPieData = txStats?.status_breakdown 
    ? Object.entries(txStats.status_breakdown).map(([key, value]) => ({
        name: value.label,
        value: value.count,
        color: key === 'dipesan' ? '#f59e0b' : key === 'dikerjakan' ? '#3b82f6' : '#10b981'
      }))
    : [];

  // Data untuk Area Chart
  const areaChartData = chartData?.data?.map(item => ({
    name: item.label,
    revenue: item.revenue,
    expense: item.expense,
  })) || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. System Stats Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Statistik Sistem</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStatsCards.map((stat, index) => (
            <div key={stat.id} className="animate-slideUp" style={{ animationDelay: `${index * 50}ms` }}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Transaction Stats Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Statistik Transaksi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {transactionStatsCards.map((stat, index) => (
            <div key={stat.id} className="animate-slideUp" style={{ animationDelay: `${(index + 4) * 50}ms` }}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <Card variant="elevated" className="lg:col-span-2 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-base font-semibold text-white">Grafik Pendapatan vs Pengeluaran</h3>
            <div className="flex items-center gap-2 bg-slate-700/50 p-1 rounded-lg">
              <button
                onClick={() => setChartPeriod('weekly')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartPeriod === 'weekly' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Mingguan
              </button>
              <button
                onClick={() => setChartPeriod('monthly')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartPeriod === 'monthly' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Bulanan
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
              <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(value) => `Rp ${(value/1000000).toFixed(0)}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => formatRupiah(value)}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Pendapatan" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Pengeluaran" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card variant="elevated" className="p-5">
          <h3 className="text-base font-semibold text-white mb-4">Status Transaksi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 4. Bottom Row: Top Products & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Top 5 Produk Terlaris (Bulan Ini)</h3>
            <Package className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-3">
            {topProducts?.length > 0 ? topProducts.map((product, index) => (
              <div key={product.product_id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-slate-400/20 text-slate-300' :
                    index === 2 ? 'bg-orange-600/20 text-orange-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{product.product_name}</p>
                    <p className="text-slate-400 text-xs">{product.total_qty} {product.unit} terjual</p>
                  </div>
                </div>
                <p className="text-emerald-400 font-semibold text-sm">{formatRupiah(product.total_revenue)}</p>
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center py-4">Belum ada data produk</p>
            )}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Transaksi Terbaru</h3>
            <RefreshCw className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-3">
            {recentTransactions?.length > 0 ? recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{tx.invoice}</p>
                    <p className="text-slate-400 text-xs">{tx.customer_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">{formatRupiah(tx.total_transaction)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    tx.status.value === 'selesai' ? 'bg-emerald-500/20 text-emerald-400' :
                    tx.status.value === 'dikerjakan' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {tx.status.label}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center py-4">Belum ada transaksi</p>
            )}
          </div>
        </Card>
      </div>

      {/* 5. System Info Footer */}
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
              <p className="text-sm text-white font-medium truncate">{user?.name || 'Administrator'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OverviewTab;