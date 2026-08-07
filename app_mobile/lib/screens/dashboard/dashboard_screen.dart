import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';

import '../../services/dashboard_service.dart';
import '../../utils/currency_formatter.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = true;
  Map<String, dynamic> _stats = {};
  List<Map<String, dynamic>> _chartData = [];
  List<Map<String, dynamic>> _pieData = [];
  List<Map<String, dynamic>> _topProducts = [];
  List<Map<String, dynamic>> _recentTransactions = [];

  final String _chartPeriod = 'monthly';

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _isLoading = true);
    try {
      final stats = await DashboardService.getStats();
      final chartData =
          await DashboardService.getTransactionChart(period: _chartPeriod);
      final topProducts = await DashboardService.getTopProducts(limit: 5);
      final recentTx = await DashboardService.getRecentTransactions(limit: 5);

      // ✅ Safe parsing untuk mencegah crash tipe data
      final txData = (stats['transactions'] is Map)
          ? stats['transactions'] as Map<String, dynamic>
          : <String, dynamic>{};
      final statusBreakdown = (txData['status_breakdown'] is Map)
          ? txData['status_breakdown'] as Map
          : null;

      final List<Map<String, dynamic>> processedPieData = [];
      final colors = [
        const Color(0xFFF59E0B),
        const Color(0xFF3B82F6),
        const Color(0xFF10B981),
      ];
      int colorIndex = 0;

      if (statusBreakdown != null) {
        statusBreakdown.forEach((key, value) {
          if (value is Map && (value['count'] ?? 0) > 0) {
            processedPieData.add({
              'name': value['label'] ?? key,
              'value': value['count'],
              'color': colors[colorIndex % colors.length],
            });
            colorIndex++;
          }
        });
      }

      if (mounted) {
        setState(() {
          _stats = stats;
          _chartData = chartData;
          _pieData = processedPieData;
          _topProducts = topProducts;
          _recentTransactions = recentTx;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('❌ Dashboard Error: $e');
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Gagal memuat dashboard: $e'),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating),
        );
      }
    }
  }

  Future<void> _showExportDialog() async {
    DateTime startDate = DateTime.now().subtract(const Duration(days: 30));
    DateTime endDate = DateTime.now();

    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            backgroundColor: const Color(0xFF1E293B),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: const Text('Export Laporan Transaksi',
                style: TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Tanggal Mulai',
                      style: TextStyle(color: Colors.white, fontSize: 14)),
                  subtitle: Text(DateFormat('dd MMM yyyy').format(startDate),
                      style: const TextStyle(color: Color(0xFF94A3B8))),
                  trailing: const Icon(Icons.calendar_today,
                      color: Color(0xFF94A3B8), size: 20),
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: startDate,
                      firstDate: DateTime(2020),
                      lastDate: DateTime.now(),
                      builder: (context, child) => Theme(
                        data: Theme.of(context).copyWith(
                            colorScheme: const ColorScheme.dark(
                                primary: Color(0xFF4F46E5))),
                        child: child!,
                      ),
                    );
                    if (picked != null) {
                      setDialogState(() => startDate = picked);
                    }
                  },
                ),
                const Divider(color: Color(0xFF334155), height: 1),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Tanggal Selesai',
                      style: TextStyle(color: Colors.white, fontSize: 14)),
                  subtitle: Text(DateFormat('dd MMM yyyy').format(endDate),
                      style: const TextStyle(color: Color(0xFF94A3B8))),
                  trailing: const Icon(Icons.calendar_today,
                      color: Color(0xFF94A3B8), size: 20),
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: endDate,
                      firstDate: DateTime(2020),
                      lastDate: DateTime.now(),
                      builder: (context, child) => Theme(
                        data: Theme.of(context).copyWith(
                            colorScheme: const ColorScheme.dark(
                                primary: Color(0xFF4F46E5))),
                        child: child!,
                      ),
                    );
                    if (picked != null) setDialogState(() => endDate = picked);
                  },
                ),
              ],
            ),
            actions: [
              TextButton(
                  onPressed: () => Navigator.pop(ctx, false),
                  child: const Text('Batal',
                      style: TextStyle(color: Color(0xFF94A3B8)))),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4F46E5),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8))),
                onPressed: () => Navigator.pop(ctx, true),
                child: const Text('Export Excel',
                    style: TextStyle(
                        color: Colors.white, fontWeight: FontWeight.w600)),
              ),
            ],
          );
        },
      ),
    );

    if (result == true) {
      _exportExcel(
        startDate: DateFormat('yyyy-MM-dd').format(startDate),
        endDate: DateFormat('yyyy-MM-dd').format(endDate),
      );
    }
  }

  Future<void> _exportExcel(
      {required String startDate, required String endDate}) async {
    try {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Sedang menyiapkan file Excel...'),
            behavior: SnackBarBehavior.floating,
            backgroundColor: Color(0xFF334155)),
      );
      await DashboardService.exportTransactionsExcel(
          startDate: startDate, endDate: endDate);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('File Excel berhasil diunduh dan dibuka'),
              behavior: SnackBarBehavior.floating,
              backgroundColor: Color(0xFF10B981)),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Gagal export: $e'),
              behavior: SnackBarBehavior.floating,
              backgroundColor: Colors.red),
        );
      }
    }
  }

  String _formatCurrency(num value) => CurrencyFormatter.formatRupiah(value);

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0F172A),
        body: Center(
            child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)))),
      );
    }

    final txStats = (_stats['transactions'] is Map)
        ? _stats['transactions'] as Map<String, dynamic>
        : <String, dynamic>{};
    final trend = (txStats['trend'] is Map)
        ? txStats['trend'] as Map<String, dynamic>
        : <String, dynamic>{};

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0F172A)],
          ),
        ),
        child: Stack(
          children: [
            CustomScrollView(
              physics: const BouncingScrollPhysics(),
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              slivers: [
                // ✅ HEADER DISAMAKAN DENGAN HALAMAN LAIN
                SliverAppBar(
                  floating: true,
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  leading: IconButton(
                    icon: const Icon(Icons.arrow_back_rounded,
                        color: Colors.white),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  title: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Laporan & Dashboard',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              letterSpacing: -0.3)),
                      SizedBox(height: 2),
                      Text('Ringkasan data dan statistik transaksi',
                          style: TextStyle(
                              color: Color(0xFF94A3B8), fontSize: 12)),
                    ],
                  ),
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.file_download_rounded,
                          color: Color(0xFF10B981)),
                      onPressed: _showExportDialog,
                      tooltip: 'Export Excel',
                    ),
                    IconButton(
                      icon: const Icon(Icons.refresh_rounded,
                          color: Color(0xFFCBD5E1)),
                      onPressed: _loadDashboardData,
                    ),
                    const SizedBox(width: 8),
                  ],
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Statistik Transaksi',
                            style: TextStyle(
                                color: Color(0xFF94A3B8),
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1)),
                        const SizedBox(height: 12),
                        GridView.count(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          childAspectRatio: 1.4,
                          children: [
                            _StatCard(
                                title: 'Total Pendapatan',
                                value: _formatCurrency(
                                    txStats['total_revenue'] ?? 0),
                                icon: Icons.attach_money_rounded,
                                color: const Color(0xFF10B981),
                                trend: trend['revenue_change']),
                            _StatCard(
                                title: 'Total Transaksi',
                                value: (txStats['total_count'] ?? 0).toString(),
                                icon: Icons.shopping_cart_rounded,
                                color: const Color(0xFF4F46E5),
                                trend: trend['transaction_change']),
                            _StatCard(
                                title: 'Total Profit',
                                value: _formatCurrency(
                                    txStats['total_profit'] ?? 0),
                                icon: Icons.trending_up_rounded,
                                color: const Color(0xFF8B5CF6),
                                trend: txStats['profit_margin']),
                            _StatCard(
                                title: 'Pendapatan Hari Ini',
                                value: _formatCurrency(
                                    txStats['today']?['revenue'] ?? 0),
                                icon: Icons.today_rounded,
                                color: const Color(0xFFF59E0B)),
                          ],
                        ),
                        const SizedBox(height: 24),
                        const Text('Grafik & Status',
                            style: TextStyle(
                                color: Color(0xFF94A3B8),
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1)),
                        const SizedBox(height: 12),
                        Column(children: [
                          _ChartCard(
                              title: 'Pendapatan vs Pengeluaran',
                              height: 300,
                              child: _buildAreaChart()),
                          const SizedBox(height: 12),
                          _ChartCard(
                              title: 'Status Transaksi',
                              height: 300,
                              child: _buildPieChart()),
                        ]),
                        const SizedBox(height: 24),
                        const Text('Ringkasan',
                            style: TextStyle(
                                color: Color(0xFF94A3B8),
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1)),
                        const SizedBox(height: 12),
                        Column(children: [
                          _ListCard(
                            title: 'Top 5 Produk Terlaris',
                            icon: Icons.inventory_2_rounded,
                            children: _topProducts
                                .map((p) => _TopProductItem(
                                    rank: _topProducts.indexOf(p) + 1,
                                    name: p['product_name'] ?? 'Produk',
                                    qty:
                                        '${p['total_qty'] ?? 0} ${p['unit'] ?? 'unit'}',
                                    revenue: _formatCurrency(
                                        p['total_revenue'] ?? 0)))
                                .toList(),
                          ),
                          const SizedBox(height: 12),
                          _ListCard(
                            title: 'Transaksi Terbaru',
                            icon: Icons.receipt_long_rounded,
                            children: _recentTransactions
                                .map((tx) => _RecentTxItem(
                                    invoice: tx['invoice'] ?? 'INV-000',
                                    customer: tx['customer_name'] ?? 'Customer',
                                    amount: _formatCurrency(
                                        tx['total_transaction'] ?? 0),
                                    status: tx['status']?['value'] ?? 'dipesan',
                                    statusLabel:
                                        tx['status']?['label'] ?? 'Dipesan'))
                                .toList(),
                          ),
                        ]),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAreaChart() {
    if (_chartData.isEmpty) {
      return const Center(
          child: Text('Belum ada data grafik',
              style: TextStyle(color: Color(0xFF94A3B8))));
    }
    return LineChart(LineChartData(
      gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: 1,
          getDrawingHorizontalLine: (value) =>
              FlLine(color: const Color(0xFF334155), strokeWidth: 1)),
      titlesData: FlTitlesData(
        leftTitles: AxisTitles(
            sideTitles: SideTitles(
                showTitles: true,
                reservedSize: 60,
                getTitlesWidget: (value, meta) => Text(
                    'Rp ${(value / 1000000).toStringAsFixed(0)}M',
                    style: const TextStyle(
                        color: Color(0xFF94A3B8), fontSize: 10)))),
        bottomTitles: AxisTitles(
            sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) {
                  final index = value.toInt();
                  if (index >= 0 && index < _chartData.length) {
                    return Text(_chartData[index]['name'] ?? '',
                        style: const TextStyle(
                            color: Color(0xFF94A3B8), fontSize: 10));
                  }
                  return const Text('');
                })),
        rightTitles:
            const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      ),
      borderData: FlBorderData(show: false),
      lineBarsData: [
        LineChartBarData(
            spots: _chartData
                .asMap()
                .entries
                .map((e) => FlSpot(
                    e.key.toDouble(), (e.value['revenue'] ?? 0).toDouble()))
                .toList(),
            isCurved: true,
            color: const Color(0xFF3B82F6),
            barWidth: 3,
            isStrokeCapRound: true,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
                show: true,
                color: const Color(0xFF3B82F6).withValues(alpha: 0.2))),
        LineChartBarData(
            spots: _chartData
                .asMap()
                .entries
                .map((e) => FlSpot(
                    e.key.toDouble(), (e.value['expense'] ?? 0).toDouble()))
                .toList(),
            isCurved: true,
            color: const Color(0xFFEF4444),
            barWidth: 3,
            isStrokeCapRound: true,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
                show: true,
                color: const Color(0xFFEF4444).withValues(alpha: 0.2))),
      ],
    ));
  }

  Widget _buildPieChart() {
    if (_pieData.isEmpty) {
      return const Center(
          child: Text('Belum ada data status',
              style: TextStyle(color: Color(0xFF94A3B8))));
    }
    return PieChart(PieChartData(
      sections: _pieData
          .map((data) => PieChartSectionData(
              value: (data['value'] as num).toDouble(),
              title: '${data['value']}',
              color: data['color'] as Color,
              radius: 80,
              titleStyle: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold)))
          .toList(),
      sectionsSpace: 2,
      centerSpaceRadius: 40,
    ));
  }
}

// --- UI COMPONENTS ---

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final num? trend;
  const _StatCard(
      {required this.title,
      required this.value,
      required this.icon,
      required this.color,
      this.trend});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: const Color(0xFF334155).withValues(alpha: 0.5))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                  gradient: LinearGradient(
                      colors: [color, color.withValues(alpha: 0.7)]),
                  borderRadius: BorderRadius.circular(10)),
              child: Icon(icon, color: Colors.white, size: 20)),
          if (trend != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
              decoration: BoxDecoration(
                  color: (trend! >= 0
                          ? const Color(0xFF10B981)
                          : const Color(0xFFEF4444))
                      .withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8)),
              child: Row(children: [
                Icon(
                    trend! >= 0
                        ? Icons.arrow_upward_rounded
                        : Icons.arrow_downward_rounded,
                    color: trend! >= 0
                        ? const Color(0xFF10B981)
                        : const Color(0xFFEF4444),
                    size: 12),
                const SizedBox(width: 2),
                Text('${trend!.abs()}%',
                    style: TextStyle(
                        color: trend! >= 0
                            ? const Color(0xFF10B981)
                            : const Color(0xFFEF4444),
                        fontSize: 10,
                        fontWeight: FontWeight.bold)),
              ]),
            ),
        ]),
        const SizedBox(height: 12),
        Text(title,
            style: const TextStyle(
                color: Color(0xFF94A3B8),
                fontSize: 11,
                fontWeight: FontWeight.w600)),
        const SizedBox(height: 4),
        Text(value,
            style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold)),
      ]),
    );
  }
}

class _ChartCard extends StatelessWidget {
  final String title;
  final Widget child;
  final double height;
  const _ChartCard(
      {required this.title, required this.height, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: const Color(0xFF334155).withValues(alpha: 0.5))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title,
            style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600)),
        const SizedBox(height: 16),
        SizedBox(height: height, child: child),
      ]),
    );
  }
}

class _ListCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List<Widget> children;
  const _ListCard(
      {required this.title, required this.icon, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
              color: const Color(0xFF334155).withValues(alpha: 0.5))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Icon(icon, color: const Color(0xFF4F46E5), size: 18),
          const SizedBox(width: 8),
          Text(title,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600))
        ]),
        const SizedBox(height: 16),
        if (children.isEmpty)
          const Center(
              child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('Belum ada data',
                      style: TextStyle(color: Color(0xFF94A3B8)))))
        else
          Column(children: children),
      ]),
    );
  }
}

class _TopProductItem extends StatelessWidget {
  final int rank;
  final String name;
  final String qty;
  final String revenue;
  const _TopProductItem(
      {required this.rank,
      required this.name,
      required this.qty,
      required this.revenue});

  @override
  Widget build(BuildContext context) {
    final rankColors = [
      const Color(0xFFF59E0B),
      const Color(0xFF94A3B8),
      const Color(0xFFB45309),
      const Color(0xFF64748B)
    ];
    final color = rank <= 3 ? rankColors[rank - 1] : rankColors[3];
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(children: [
        Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
                color: color.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12)),
            child: Center(
                child: Text('$rank',
                    style: TextStyle(
                        color: color,
                        fontSize: 10,
                        fontWeight: FontWeight.bold)))),
        const SizedBox(width: 12),
        Expanded(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w500)),
          Text(qty,
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10))
        ])),
        Text(revenue,
            style: const TextStyle(
                color: Color(0xFF10B981),
                fontSize: 12,
                fontWeight: FontWeight.bold)),
      ]),
    );
  }
}

class _RecentTxItem extends StatelessWidget {
  final String invoice;
  final String customer;
  final String amount;
  final String status;
  final String statusLabel;
  const _RecentTxItem(
      {required this.invoice,
      required this.customer,
      required this.amount,
      required this.status,
      required this.statusLabel});

  Color _getStatusColor() {
    switch (status) {
      case 'selesai':
        return const Color(0xFF10B981);
      case 'dikerjakan':
        return const Color(0xFF3B82F6);
      default:
        return const Color(0xFFF59E0B);
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor();
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(children: [
        Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
                color: const Color(0xFF4F46E5).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(18)),
            child: const Icon(Icons.shopping_cart_rounded,
                color: Color(0xFF4F46E5), size: 18)),
        const SizedBox(width: 12),
        Expanded(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(invoice,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w500)),
          Text(customer,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10))
        ])),
        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text(amount,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6)),
              child: Text(statusLabel,
                  style: TextStyle(
                      color: statusColor,
                      fontSize: 9,
                      fontWeight: FontWeight.bold))),
        ]),
      ]),
    );
  }
}
