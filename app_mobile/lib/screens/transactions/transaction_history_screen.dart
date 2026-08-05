import 'package:flutter/material.dart';

class TransactionHistoryScreen extends StatefulWidget {
  final int initialTab; // 0 = Aktif, 1 = Selesai

  const TransactionHistoryScreen({super.key, this.initialTab = 0});

  @override
  State<TransactionHistoryScreen> createState() =>
      _TransactionHistoryScreenState();
}

class _TransactionHistoryScreenState extends State<TransactionHistoryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 2,
      vsync: this,
      initialIndex: widget.initialTab,
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            floating: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.initialTab == 0
                      ? 'Transaksi Aktif'
                      : 'Transaksi Selesai',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  widget.initialTab == 0
                      ? 'Transaksi yang sedang diproses'
                      : 'Riwayat transaksi selesai',
                  style: const TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            actions: [
              IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B).withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF334155).withValues(alpha: 0.5),
                    ),
                  ),
                  child: const Icon(
                    Icons.filter_list_rounded,
                    color: Color(0xFFCBD5E1),
                    size: 20,
                  ),
                ),
                onPressed: () {},
              ),
              const SizedBox(width: 8),
            ],
          ),
          SliverFillRemaining(
            hasScrollBody: false,
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xFF4F46E5).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: Icon(
                        widget.initialTab == 0
                            ? Icons.pending_actions_rounded
                            : Icons.check_circle_rounded,
                        size: 64,
                        color: const Color(0xFF4F46E5),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      widget.initialTab == 0
                          ? 'Belum Ada Transaksi Aktif'
                          : 'Belum Ada Transaksi Selesai',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Data transaksi akan tampil di sini',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
