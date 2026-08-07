import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';

import '../../models/transaction.dart';
import '../../providers/auth_provider.dart';
import '../../services/transaction_service.dart';
import '../../services/invoice_service.dart';

class CompletedTransactionsScreen extends StatefulWidget {
  const CompletedTransactionsScreen({super.key});

  @override
  State<CompletedTransactionsScreen> createState() =>
      _CompletedTransactionsScreenState();
}

class _CompletedTransactionsScreenState
    extends State<CompletedTransactionsScreen> {
  final _searchController = TextEditingController();
  Timer? _debounce;

  List<Transaction> _transactions = [];
  bool _isLoading = true;
  bool _isRefreshing = false;
  bool _isMutating = false;

  int _currentPage = 1;
  int _lastPage = 1;
  int _totalItems = 0;

  String _searchQuery = '';
  String? _startDate;
  String? _endDate;

  String get _currentStatus => 'selesai';

  bool get _isAdmin {
    final role = context.read<AuthProvider>().user?.role?.toLowerCase() ?? '';
    return role == 'admin' || role == 'super_admin' || role == 'superadmin';
  }

  bool get _isSales {
    final role = context.read<AuthProvider>().user?.role?.toLowerCase() ?? '';
    return role == 'sales';
  }

  int? get _currentUserId =>
      _isSales ? context.read<AuthProvider>().user?.id : null;

  bool get _canEdit => _isAdmin || _isSales;
  bool get _canDelete => false;

  bool get _hasActiveFilters =>
      _searchQuery.isNotEmpty || _startDate != null || _endDate != null;

  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  Future<void> _loadTransactions({bool showLoading = true}) async {
    if (showLoading && !mounted) return;
    if (showLoading) setState(() => _isLoading = true);

    try {
      final result = await TransactionService.getAll(
        page: _currentPage,
        perPage: 12,
        search: _searchQuery,
        status: _currentStatus,
        startDate: _startDate,
        endDate: _endDate,
        userId: _currentUserId,
      );

      if (!mounted) return;
      setState(() {
        _transactions = result['transactions'] as List<Transaction>;
        final meta = result['meta'];
        if (meta != null) {
          _currentPage = meta['current_page'] ?? 1;
          _lastPage = meta['last_page'] ?? 1;
          _totalItems = meta['total'] ?? 0;
        }
        _isLoading = false;
        _isRefreshing = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      _showError('Gagal Memuat', e.toString().replaceFirst('Exception: ', ''));
    }
  }

  Future<void> _refresh() async {
    setState(() => _isRefreshing = true);
    await _loadTransactions(showLoading: false);
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      if (!mounted) return;
      setState(() {
        _searchQuery = value;
        _currentPage = 1;
      });
      _loadTransactions();
    });
  }

  Future<void> _selectDate(BuildContext context, bool isStart) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.dark(primary: Color(0xFF4F46E5))),
        child: child!,
      ),
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          _startDate = DateFormat('yyyy-MM-dd').format(picked);
        } else {
          _endDate = DateFormat('yyyy-MM-dd').format(picked);
        }
        _currentPage = 1;
      });
      _loadTransactions();
    }
  }

  void _resetFilters() {
    _searchController.clear();
    setState(() {
      _searchQuery = '';
      _startDate = null;
      _endDate = null;
      _currentPage = 1;
    });
    _loadTransactions();
  }

  Future<void> _handleDelete(Transaction transaction) async {
    final confirmed = await _showConfirmation('Hapus Transaksi',
        'Hapus transaksi "${transaction.invoice}" secara permanen?');
    if (confirmed != true || !mounted) return;

    setState(() => _isMutating = true);
    try {
      await TransactionService.delete(transaction.id);
      if (!mounted) return;
      _showSuccess('Berhasil', 'Transaksi berhasil dihapus');
      _loadTransactions(showLoading: false);
    } catch (e) {
      if (!mounted) return;
      _showError('Gagal', e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isMutating = false);
    }
  }

  Future<bool?> _showConfirmation(String title, String message) {
    return showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(children: [
          const Icon(Icons.warning_amber_rounded, color: Color(0xFFEF4444)),
          const SizedBox(width: 10),
          Text(title,
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.w600)),
        ]),
        content: Text(message,
            style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 14)),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Batal',
                  style: TextStyle(color: Color(0xFF94A3B8)))),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(
                backgroundColor: const Color(0xFFEF4444),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8))),
            child: const Text('Ya', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showSuccess(String title, String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      backgroundColor: const Color(0xFF10B981),
      content: Row(children: [
        const Icon(Icons.check_circle_rounded, color: Colors.white),
        const SizedBox(width: 10),
        Expanded(
            child: Text(message, style: const TextStyle(color: Colors.white)))
      ]),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));
  }

  void _showError(String title, String message) {
    if (!mounted) return;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(children: [
          Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10)),
              child:
                  const Icon(Icons.error_rounded, color: Colors.red, size: 20)),
          const SizedBox(width: 10),
          Text(title,
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.w600)),
        ]),
        content: Text(message,
            style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 14)),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              style: TextButton.styleFrom(
                  backgroundColor: Colors.red,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10))),
              child: const Text('OK', style: TextStyle(color: Colors.white))),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) =>
      DateFormat('d MMM yyyy', 'id_ID').format(date);

  String _formatCurrency(num value) {
    final rounded = value.round();
    return 'Rp ${NumberFormat('#,###', 'id_ID').format(rounded).replaceAll(',', '.')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        decoration: const BoxDecoration(
            gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
              Color(0xFF0F172A),
              Color(0xFF1E293B),
              Color(0xFF0F172A)
            ])),
        child: Stack(
          children: [
            CustomScrollView(
              physics: const BouncingScrollPhysics(),
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              slivers: [
                SliverAppBar(
                  floating: true,
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  title: const Text('Transaksi Selesai',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.3)),
                  actions: [
                    IconButton(
                      onPressed: _isRefreshing ? null : _refresh,
                      icon: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                            color:
                                const Color(0xFF1E293B).withValues(alpha: 0.6),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                                color: const Color(0xFF334155)
                                    .withValues(alpha: 0.5))),
                        child: AnimatedRotation(
                            turns: _isRefreshing ? 1 : 0,
                            duration: const Duration(milliseconds: 800),
                            child: const Icon(Icons.refresh_rounded,
                                color: Color(0xFFCBD5E1), size: 20)),
                      ),
                    ),
                    const SizedBox(width: 8),
                  ],
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                          gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                const Color(0xFF1E293B).withValues(alpha: 0.7),
                                const Color(0xFF0F172A).withValues(alpha: 0.5)
                              ]),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: const Color(0xFF334155)
                                  .withValues(alpha: 0.5))),
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            TextField(
                              controller: _searchController,
                              onChanged: _onSearchChanged,
                              style: const TextStyle(
                                  color: Colors.white, fontSize: 14),
                              decoration: InputDecoration(
                                  hintText:
                                      'Cari invoice, pelanggan, atau proyek...',
                                  hintStyle:
                                      const TextStyle(color: Color(0xFF64748B)),
                                  prefixIcon: const Icon(Icons.search_rounded,
                                      color: Color(0xFF94A3B8)),
                                  filled: true,
                                  fillColor: const Color(0xFF334155)
                                      .withValues(alpha: 0.5),
                                  border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide.none),
                                  contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 14)),
                            ),
                            const SizedBox(height: 12),
                            Wrap(spacing: 8, runSpacing: 8, children: [
                              _DateFilterButton(
                                  label: _startDate ?? 'Mulai',
                                  onTap: () => _selectDate(context, true),
                                  isActive: _startDate != null),
                              _DateFilterButton(
                                  label: _endDate ?? 'Sampai',
                                  onTap: () => _selectDate(context, false),
                                  isActive: _endDate != null),
                              if (_hasActiveFilters)
                                TextButton.icon(
                                    onPressed: _resetFilters,
                                    icon: const Icon(Icons.close_rounded,
                                        size: 16),
                                    label: const Text('Reset',
                                        style: TextStyle(fontSize: 12)),
                                    style: TextButton.styleFrom(
                                        foregroundColor:
                                            const Color(0xFFEF4444),
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 12, vertical: 8))),
                            ]),
                            if (_totalItems > 0) ...[
                              const SizedBox(height: 12),
                              Text(
                                  'Menampilkan ${_transactions.length} dari $_totalItems transaksi',
                                  style: const TextStyle(
                                      color: Color(0xFF64748B), fontSize: 11))
                            ],
                          ]),
                    ),
                  ),
                ),
                if (_isLoading)
                  const SliverFillRemaining(
                      child: Center(
                          child: CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(
                                  Color(0xFF4F46E5)))))
                else if (_transactions.isEmpty)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 32, vertical: 40),
                      child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Container(
                                padding: const EdgeInsets.all(24),
                                decoration: BoxDecoration(
                                    color: const Color(0xFF10B981)
                                        .withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(24)),
                                child: const Icon(Icons.check_circle_rounded,
                                    size: 64, color: Color(0xFF10B981))),
                            const SizedBox(height: 24),
                            Text(
                                _hasActiveFilters
                                    ? 'Tidak Ada Transaksi'
                                    : 'Belum Ada Transaksi Selesai',
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600)),
                            const SizedBox(height: 8),
                            Text(
                                _hasActiveFilters
                                    ? 'Tidak ada transaksi yang cocok dengan filter Anda.'
                                    : 'Transaksi yang telah selesai akan muncul di sini.',
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                    color: Color(0xFF94A3B8), fontSize: 13)),
                          ]),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    sliver: SliverGrid(
                      gridDelegate:
                          const SliverGridDelegateWithMaxCrossAxisExtent(
                              maxCrossAxisExtent: 340,
                              mainAxisSpacing: 12,
                              crossAxisSpacing: 12,
                              childAspectRatio: 0.62),
                      delegate: SliverChildBuilderDelegate((context, index) {
                        final transaction = _transactions[index];
                        return _TransactionCard(
                          transaction: transaction,
                          isMutating: _isMutating,
                          canEdit: _canEdit,
                          canDelete: _canDelete,
                          onChangeStatus: (t, s) {},
                          onDelete: _handleDelete,
                          formatCurrency: _formatCurrency,
                          formatDate: _formatDate,
                          onPrint: () =>
                              InvoiceService.generateAndSharePdf(transaction),
                        );
                      }, childCount: _transactions.length),
                    ),
                  ),
                if (!_isLoading && _transactions.isNotEmpty && _lastPage > 1)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: _Pagination(
                        currentPage: _currentPage,
                        lastPage: _lastPage,
                        onPageChanged: (page) {
                          setState(() => _currentPage = page);
                          _loadTransactions();
                        },
                      ),
                    ),
                  ),
                const SliverToBoxAdapter(child: SizedBox(height: 100)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DateFilterButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final bool isActive;
  const _DateFilterButton(
      {required this.label, required this.onTap, required this.isActive});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
            gradient: isActive
                ? const LinearGradient(
                    colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)])
                : null,
            color: isActive
                ? null
                : const Color(0xFF334155).withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
                color: const Color(0xFF475569).withValues(alpha: 0.5))),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.calendar_today_rounded,
              size: 14,
              color: isActive ? Colors.white : const Color(0xFF94A3B8)),
          const SizedBox(width: 6),
          Text(label,
              style: TextStyle(
                  color: isActive ? Colors.white : const Color(0xFF94A3B8),
                  fontSize: 12))
        ]),
      ),
    );
  }
}

// ✅ PERBAIKAN 3: StatefulWidget untuk state loading invoice per-kartu
class _TransactionCard extends StatefulWidget {
  final Transaction transaction;
  final bool isMutating;
  final bool canEdit;
  final bool canDelete;
  final Function(Transaction, String) onChangeStatus;
  final Function(Transaction) onDelete;
  final String Function(num) formatCurrency;
  final String Function(DateTime) formatDate;
  final Future<void> Function() onPrint;

  const _TransactionCard({
    required this.transaction,
    required this.isMutating,
    required this.canEdit,
    required this.canDelete,
    required this.onChangeStatus,
    required this.onDelete,
    required this.formatCurrency,
    required this.formatDate,
    required this.onPrint,
  });

  @override
  State<_TransactionCard> createState() => _TransactionCardState();
}

class _TransactionCardState extends State<_TransactionCard> {
  bool _isPrinting = false;

  Future<void> _handlePrint() async {
    if (_isPrinting) return;
    setState(() => _isPrinting = true);
    try {
      await widget.onPrint();
    } finally {
      if (mounted) setState(() => _isPrinting = false);
    }
  }

  Map<String, dynamic> _getStatusConfig(String status) {
    switch (status.toLowerCase()) {
      case 'dipesan':
        return {
          'label': 'Dipesan',
          'color': const Color(0xFFF59E0B),
          'bg': const Color(0xFFF59E0B).withValues(alpha: 0.15),
          'next': 'dikerjakan',
          'nextLabel': 'Kerjakan'
        };
      case 'dikerjakan':
        return {
          'label': 'Dikerjakan',
          'color': const Color(0xFF3B82F6),
          'bg': const Color(0xFF3B82F6).withValues(alpha: 0.15),
          'next': 'selesai',
          'nextLabel': 'Selesaikan'
        };
      case 'selesai':
        return {
          'label': 'Selesai',
          'color': const Color(0xFF10B981),
          'bg': const Color(0xFF10B981).withValues(alpha: 0.15),
          'next': null,
          'nextLabel': null
        };
      default:
        return {
          'label': status,
          'color': const Color(0xFF94A3B8),
          'bg': const Color(0xFF94A3B8).withValues(alpha: 0.15),
          'next': null,
          'nextLabel': null
        };
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusConfig = _getStatusConfig(widget.transaction.status);

    return Container(
      decoration: BoxDecoration(
          gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF1E293B).withValues(alpha: 0.7),
                const Color(0xFF0F172A).withValues(alpha: 0.5)
              ]),
          borderRadius: BorderRadius.circular(16),
          border:
              Border.all(color: const Color(0xFF334155).withValues(alpha: 0.5)),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 12,
                offset: const Offset(0, 4))
          ]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
          child:
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                    color: statusConfig['bg'],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                        color: (statusConfig['color'] as Color)
                            .withValues(alpha: 0.3))),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                          color: statusConfig['color'],
                          shape: BoxShape.circle)),
                  const SizedBox(width: 4),
                  Text(statusConfig['label'],
                      style: TextStyle(
                          color: statusConfig['color'],
                          fontSize: 10,
                          fontWeight: FontWeight.w600))
                ])),
            Row(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.calendar_today_rounded,
                  color: Color(0xFF64748B), size: 12),
              const SizedBox(width: 4),
              Text(widget.formatDate(widget.transaction.transactionDate),
                  style:
                      const TextStyle(color: Color(0xFF94A3B8), fontSize: 11))
            ]),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Column(children: [
            Text(widget.transaction.invoice,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    height: 1.3)),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: InkWell(
                onTap:
                    _handlePrint, // ✅ Menggunakan handler dengan state loading
                borderRadius: BorderRadius.circular(8),
                child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                            color: const Color(0xFFF59E0B)
                                .withValues(alpha: 0.3))),
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (_isPrinting)
                            const SizedBox(
                                width: 14,
                                height: 14,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2, color: Color(0xFFF59E0B)))
                          else ...[
                            const Icon(Icons.receipt_long_rounded,
                                color: Color(0xFFF59E0B), size: 14),
                            const SizedBox(width: 6),
                            const Text('Cetak Invoice',
                                style: TextStyle(
                                    color: Color(0xFFF59E0B),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600))
                          ],
                        ])),
              ),
            ),
          ]),
        ),
        const Padding(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Divider(height: 1, color: Color(0xFF334155))),
        Flexible(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Padding(
                    padding: EdgeInsets.only(top: 2),
                    child: Icon(Icons.person_rounded,
                        color: Color(0xFF3B82F6), size: 16)),
                const SizedBox(width: 8),
                Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                      const Text('Pelanggan',
                          style: TextStyle(
                              color: Color(0xFF64748B),
                              fontSize: 10,
                              fontWeight: FontWeight.w600)),
                      Text(widget.transaction.customerName,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              color: Color(0xFFE2E8F0), fontSize: 12))
                    ])),
              ]),
              if (widget.transaction.projectName != null) ...[
                const SizedBox(height: 6),
                Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Padding(
                      padding: EdgeInsets.only(top: 2),
                      child: Icon(Icons.business_rounded,
                          color: Color(0xFF818CF8), size: 16)),
                  const SizedBox(width: 8),
                  Expanded(
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                        const Text('Proyek',
                            style: TextStyle(
                                color: Color(0xFF64748B),
                                fontSize: 10,
                                fontWeight: FontWeight.w600)),
                        Text(widget.transaction.projectName!,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                                color: Color(0xFFE2E8F0), fontSize: 12))
                      ])),
                ]),
              ],
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                        color: const Color(0xFF334155).withValues(alpha: 0.4))),
                child: Column(children: [
                  Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(mainAxisSize: MainAxisSize.min, children: [
                          Icon(Icons.shopping_bag_rounded,
                              color: Color(0xFF10B981), size: 14),
                          SizedBox(width: 6),
                          Text('Total',
                              style: TextStyle(
                                  color: Color(0xFF94A3B8), fontSize: 11))
                        ]),
                        Flexible(
                            child: Text(
                                widget.formatCurrency(
                                    widget.transaction.totalTransaction),
                                style: const TextStyle(
                                    color: Color(0xFF10B981),
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold),
                                textAlign: TextAlign.right,
                                overflow: TextOverflow.ellipsis)),
                      ]),
                  const SizedBox(height: 2),
                  Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(mainAxisSize: MainAxisSize.min, children: [
                          Icon(Icons.trending_down_rounded,
                              color: Color(0xFFEF4444), size: 14),
                          SizedBox(width: 6),
                          Text('Pengeluaran',
                              style: TextStyle(
                                  color: Color(0xFF94A3B8), fontSize: 11))
                        ]),
                        Flexible(
                            child: Text(
                                widget.formatCurrency(
                                    widget.transaction.totalExpense),
                                style: const TextStyle(
                                    color: Color(0xFFEF4444), fontSize: 11),
                                textAlign: TextAlign.right,
                                overflow: TextOverflow.ellipsis)),
                      ]),
                ]),
              ),
            ]),
          ),
        ),
        const Padding(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Divider(height: 1, color: Color(0xFF334155))),
        Padding(
          padding: const EdgeInsets.fromLTRB(6, 0, 6, 6),
          child: Row(children: [
            if (widget.canEdit) ...[
              Expanded(
                  child: _ActionBtn(
                      icon: Icons.edit_rounded,
                      label: 'Edit',
                      color: const Color(0xFF818CF8),
                      onTap: widget.isMutating
                          ? null
                          : () => context.push(
                              '/transactions/edit/${widget.transaction.id}',
                              extra: widget.transaction))),
              const SizedBox(width: 4),
            ],
            if (widget.canDelete)
              Expanded(
                  child: _ActionBtn(
                      icon: Icons.delete_rounded,
                      label: 'Hapus',
                      color: const Color(0xFFEF4444),
                      onTap: widget.isMutating
                          ? null
                          : () => widget.onDelete(widget.transaction))),
          ]),
        ),
      ]),
    );
  }
}

class _ActionBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;
  const _ActionBtn(
      {required this.icon,
      required this.label,
      required this.color,
      this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
          decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: color.withValues(alpha: 0.3))),
          child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, color: color, size: 14),
                const SizedBox(width: 4),
                Flexible(
                    child: Text(label,
                        style: TextStyle(
                            color: color,
                            fontSize: 10,
                            fontWeight: FontWeight.w600),
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis))
              ]),
        ),
      ),
    );
  }
}

class _Pagination extends StatelessWidget {
  final int currentPage;
  final int lastPage;
  final ValueChanged<int> onPageChanged;
  const _Pagination(
      {required this.currentPage,
      required this.lastPage,
      required this.onPageChanged});

  @override
  Widget build(BuildContext context) {
    return Row(mainAxisAlignment: MainAxisAlignment.center, children: [
      IconButton(
          onPressed:
              currentPage > 1 ? () => onPageChanged(currentPage - 1) : null,
          icon: const Icon(Icons.chevron_left_rounded, color: Colors.white)),
      ...List.generate(lastPage > 5 ? 5 : lastPage, (i) {
        int page;
        if (lastPage <= 5) {
          page = i + 1;
        } else if (currentPage <= 3) {
          page = i + 1;
        } else if (currentPage >= lastPage - 2) {
          page = lastPage - 4 + i;
        } else {
          page = currentPage - 2 + i;
        }
        final isActive = page == currentPage;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () => onPageChanged(page),
              borderRadius: BorderRadius.circular(8),
              child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                      gradient: isActive
                          ? const LinearGradient(
                              colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)])
                          : null,
                      color: isActive ? null : const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                          color: isActive
                              ? Colors.transparent
                              : const Color(0xFF334155)
                                  .withValues(alpha: 0.5))),
                  child: Center(
                      child: Text('$page',
                          style: TextStyle(
                              color: isActive
                                  ? Colors.white
                                  : const Color(0xFF94A3B8),
                              fontWeight: FontWeight.w600,
                              fontSize: 13)))),
            ),
          ),
        );
      }),
      IconButton(
          onPressed: currentPage < lastPage
              ? () => onPageChanged(currentPage + 1)
              : null,
          icon: const Icon(Icons.chevron_right_rounded, color: Colors.white)),
    ]);
  }
}
