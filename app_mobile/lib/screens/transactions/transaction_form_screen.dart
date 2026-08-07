import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../models/transaction.dart';
import '../../services/transaction_service.dart';
import '../../services/category_service.dart';
import '../../services/supplier_service.dart';
import '../../services/dropdown_service.dart';
import '../../services/product_service.dart';
import '../../services/dio_client.dart';
import '../../config/api_config.dart';
import '../../utils/currency_formatter.dart';

class TransactionFormScreen extends StatefulWidget {
  final Transaction? editingTransaction;
  const TransactionFormScreen({super.key, this.editingTransaction});

  @override
  State<TransactionFormScreen> createState() => _TransactionFormScreenState();
}

class _TransactionFormScreenState extends State<TransactionFormScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isSubmitting = false;
  bool _isLoadingData = true;

  late String _transactionDate;
  late String _customerName;
  late String _projectName;
  late String _projectAddress;
  late String _status;
  late String _notes;
  late List<Map<String, dynamic>> _details;

  List<Map<String, dynamic>> _categories = [];
  List<Map<String, dynamic>> _productTypes = [];
  List<Map<String, dynamic>> _products = [];
  List<Map<String, dynamic>> _suppliers = [];

  @override
  void initState() {
    super.initState();
    _transactionDate = DateFormat('yyyy-MM-dd').format(DateTime.now());
    _customerName = '';
    _projectName = '';
    _projectAddress = '';
    _status = 'dipesan';
    _notes = '';
    _details = [];
    _loadFormData();
  }

  Future<void> _loadFormData() async {
    setState(() => _isLoadingData = true);
    try {
      final catRes = await CategoryService.getAll(perPage: 100);
      _categories = (catRes['categories'] as List)
          .map((c) => {'id': c.id.toString(), 'name': c.name})
          .toList();

      final allTypes = await DropdownService.getProductTypes(categoryId: null);
      _productTypes = allTypes
          .map((t) => {
                'id': t.id.toString(),
                'name': t.name,
                'category_id': t.categoryId?.toString() ?? ''
              })
          .toList();

      final prodRes = await ProductService.getAll(perPage: 1000);
      _products = (prodRes['products'] as List)
          .map((p) => {
                'id': p.id.toString(),
                'name': p.name,
                'code': p.code ?? '',
                'unit': p.unit ?? 'unit',
                'price': p.price,
                'product_type_id': p.productTypeId?.toString() ?? ''
              })
          .toList();

      final suppRes = await SupplierService.getAll(perPage: 100);
      _suppliers = (suppRes['suppliers'] as List)
          .map((s) => {'id': s.id.toString(), 'name': s.name})
          .toList();

      if (widget.editingTransaction != null) {
        final t = widget.editingTransaction!;
        _transactionDate = DateFormat('yyyy-MM-dd').format(t.transactionDate);
        _customerName = t.customerName;
        _projectName = t.projectName ?? '';
        _projectAddress = t.projectAddress ?? '';
        _status = t.status;
        _notes = t.notes ?? '';

        try {
          final response =
              await DioClient.dio.get('${ApiConfig.transactions}/${t.id}');
          final data = response.data['data'] ?? response.data;
          final details = data['details'] as List? ?? [];

          _details = details.map<Map<String, dynamic>>((d) {
            final product = d['product'] as Map<String, dynamic>?;
            return {
              'product_id':
                  (d['product_id'] ?? product?['id'])?.toString() ?? '',
              'unit': d['unit'] ?? product?['unit'] ?? 'unit',
              // ✅ PERBAIKAN: Menggunakan double.tryParse dan .round() agar ".0" tidak dianggap sebagai digit
              'product_price': _formatRupiahInput(d['product_price'] ?? 0),
              'qty': (d['qty'] ?? 1).toString(),
              'supplier_id': d['supplier_id']?.toString() ?? '',
              'expense': _formatRupiahInput(d['expense'] ?? 0),
            };
          }).toList();
        } catch (e) {
          debugPrint('Error fetching transaction details: $e');
        }
      }
    } catch (e) {
      debugPrint('Error loading form data: $e');
      if (mounted) {
        _showError('Gagal Memuat', 'Tidak dapat memuat data form');
      }
    } finally {
      if (mounted) setState(() => _isLoadingData = false);
    }
  }

  // ✅ PERBAIKAN: Menerima dynamic, parse sebagai double, lalu bulatkan ke int sebelum diformat
  String _formatRupiahInput(dynamic value) {
    if (value == null) return '';
    final numVal =
        value is num ? value : (double.tryParse(value.toString()) ?? 0);
    final number = numVal.round();
    if (number == 0) return '';
    return NumberFormat('#,###', 'id_ID').format(number).replaceAll(',', '.');
  }

  void _addDetail() {
    setState(() {
      _details.add({
        'product_id': '',
        'unit': 'unit',
        'product_price': '',
        'qty': '1',
        'supplier_id': '',
        'expense': ''
      });
    });
  }

  void _removeDetail(int index) {
    setState(() => _details.removeAt(index));
  }

  void _updateDetail(int index, String key, dynamic value) {
    setState(() => _details[index][key] = value);
  }

  Map<String, dynamic> _calculateSummary() {
    num totalTransaction = 0;
    num totalExpense = 0;

    for (var detail in _details) {
      final price =
          CurrencyFormatter.parseRupiah(detail['product_price'] ?? '');
      final qty = double.tryParse(detail['qty']?.toString() ?? '0') ?? 0;
      final expense = CurrencyFormatter.parseRupiah(detail['expense'] ?? '');
      totalTransaction += price * qty;
      totalExpense += expense;
    }

    return {
      'totalTransaction': totalTransaction,
      'totalExpense': totalExpense,
      'profit': totalTransaction - totalExpense
    };
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    for (int i = 0; i < _details.length; i++) {
      if (_details[i]['product_id'].toString().isEmpty) {
        _showError('Gagal', 'Produk pada item ke-${i + 1} wajib dipilih');
        return;
      }
      final qty = double.tryParse(_details[i]['qty']?.toString() ?? '0') ?? 0;
      if (qty <= 0) {
        _showError('Gagal', 'Quantity pada item ke-${i + 1} minimal 0.01');
        return;
      }
    }

    setState(() => _isSubmitting = true);

    try {
      final payload = {
        'transaction_date': _transactionDate,
        'customer_name': _customerName.trim(),
        'project_name':
            _projectName.trim().isEmpty ? null : _projectName.trim(),
        'project_address':
            _projectAddress.trim().isEmpty ? null : _projectAddress.trim(),
        'status': _status,
        'notes': _notes.trim().isEmpty ? null : _notes.trim(),
        'details': _details
            .map((d) => {
                  'product_id': int.parse(d['product_id'].toString()),
                  'unit': d['unit'] ?? 'unit',
                  'product_price':
                      CurrencyFormatter.parseRupiah(d['product_price'] ?? ''),
                  'qty': double.parse(d['qty'].toString()),
                  'supplier_id': d['supplier_id']?.toString().isNotEmpty == true
                      ? int.parse(d['supplier_id'].toString())
                      : null,
                  'expense': CurrencyFormatter.parseRupiah(d['expense'] ?? ''),
                })
            .toList(),
      };

      if (widget.editingTransaction == null) {
        await TransactionService.create(payload);
      } else {
        await TransactionService.update(widget.editingTransaction!.id, payload);
      }

      if (!mounted) return;
      context.pop(true);
    } catch (e) {
      if (!mounted) return;
      _showError('Gagal', e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _showError(String title, String message) {
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
              child: const Text('OK', style: TextStyle(color: Colors.white)))
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final summary = _calculateSummary();

    if (_isLoadingData) {
      return const Scaffold(
        backgroundColor: Color(0xFF0F172A),
        body: Center(
            child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)))),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: Text(
            widget.editingTransaction == null
                ? 'Tambah Transaksi'
                : 'Edit Transaksi',
            style: const TextStyle(
                color: Colors.white, fontWeight: FontWeight.bold)),
        leading: IconButton(
            icon: const Icon(Icons.close_rounded, color: Colors.white),
            onPressed: () => context.pop()),
      ),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionTitle('Informasi Dasar'),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                            child: _buildTextField(
                                label: 'Tanggal *',
                                value: _transactionDate,
                                onChanged: (v) =>
                                    setState(() => _transactionDate = v),
                                isDate: true)),
                        const SizedBox(width: 12),
                        Expanded(
                            child: _buildDropdownField(
                                label: 'Status *',
                                value: _status,
                                items: const [
                                  'dipesan',
                                  'dikerjakan',
                                  'selesai'
                                ],
                                onChanged: (v) =>
                                    setState(() => _status = v ?? 'dipesan'))),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                        label: 'Nama Pelanggan *',
                        value: _customerName,
                        onChanged: (v) => setState(() => _customerName = v),
                        maxLength: 150),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                            child: _buildTextField(
                                label: 'Nama Proyek',
                                value: _projectName,
                                onChanged: (v) =>
                                    setState(() => _projectName = v),
                                maxLength: 200)),
                        const SizedBox(width: 12),
                        Expanded(
                            child: _buildTextField(
                                label: 'Alamat Proyek',
                                value: _projectAddress,
                                onChanged: (v) =>
                                    setState(() => _projectAddress = v))),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                        label: 'Catatan',
                        value: _notes,
                        onChanged: (v) => setState(() => _notes = v),
                        maxLines: 2),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildSectionTitle('Detail Transaksi'),
                        TextButton.icon(
                            onPressed: _isSubmitting ? null : _addDetail,
                            icon: const Icon(Icons.add_rounded, size: 18),
                            label: const Text('Tambah Item'),
                            style: TextButton.styleFrom(
                                foregroundColor: const Color(0xFF4F46E5))),
                      ],
                    ),
                    const SizedBox(height: 12),
                    if (_details.isEmpty)
                      Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                              color: const Color(0xFF1E293B),
                              borderRadius: BorderRadius.circular(12),
                              border:
                                  Border.all(color: const Color(0xFF334155))),
                          child: const Center(
                              child: Text(
                                  'Belum ada item. Klik "Tambah Item" untuk menambahkan.',
                                  style: TextStyle(color: Color(0xFF94A3B8)))))
                    else
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _details.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) => _DetailItemCard(
                          key: ValueKey('detail_$index'),
                          index: index,
                          detail: _details[index],
                          onUpdate: _updateDetail,
                          onRemove: _removeDetail,
                          isDisabled: _isSubmitting,
                          categories: _categories,
                          productTypes: _productTypes,
                          products: _products,
                          suppliers: _suppliers,
                          formatInputRupiah: _formatRupiahInput,
                        ),
                      ),
                    if (_details.isNotEmpty) ...[
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFF334155))),
                        child: Column(children: [
                          _buildSummaryRow(
                              'Total Transaksi',
                              CurrencyFormatter.formatRupiah(
                                  summary['totalTransaction']),
                              const Color(0xFF10B981)),
                          const SizedBox(height: 8),
                          _buildSummaryRow(
                              'Total Pengeluaran',
                              CurrencyFormatter.formatRupiah(
                                  summary['totalExpense']),
                              const Color(0xFFEF4444)),
                          const Divider(height: 24, color: Color(0xFF334155)),
                          _buildSummaryRow(
                              'Profit',
                              CurrencyFormatter.formatRupiah(summary['profit']),
                              summary['profit'] >= 0
                                  ? const Color(0xFF4F46E5)
                                  : const Color(0xFFEF4444),
                              isBold: true,
                              fontSize: 18),
                        ]),
                      ),
                    ],
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16).copyWith(top: 12),
              decoration: const BoxDecoration(
                  color: Color(0xFF1E293B),
                  boxShadow: [
                    BoxShadow(
                        color: Colors.black26,
                        blurRadius: 10,
                        offset: Offset(0, -4))
                  ]),
              child: SafeArea(
                top: false,
                child: Row(children: [
                  Expanded(
                      child: OutlinedButton(
                    onPressed: _isSubmitting ? null : () => context.pop(),
                    style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF94A3B8),
                        side: const BorderSide(color: Color(0xFF334155)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12))),
                    child: const Text('Batal'),
                  )),
                  const SizedBox(width: 12),
                  Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: _isSubmitting ? null : _handleSubmit,
                        style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF4F46E5),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12))),
                        child: _isSubmitting
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                    strokeWidth: 2, color: Colors.white))
                            : Text(
                                widget.editingTransaction == null
                                    ? 'Simpan Transaksi'
                                    : 'Update Transaksi',
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600)),
                      )),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title,
        style: const TextStyle(
            color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold));
  }

  Widget _buildTextField(
      {required String label,
      required String value,
      required ValueChanged<String> onChanged,
      bool isDate = false,
      int? maxLength,
      int maxLines = 1}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label,
          style: const TextStyle(
              color: Color(0xFFCBD5E1),
              fontSize: 13,
              fontWeight: FontWeight.w600)),
      const SizedBox(height: 6),
      isDate
          ? TextField(
              controller: TextEditingController(text: value),
              readOnly: true,
              onTap: () async {
                final date = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now(),
                    firstDate: DateTime(2020),
                    lastDate: DateTime(2030),
                    builder: (context, child) => Theme(
                        data: Theme.of(context).copyWith(
                            colorScheme: const ColorScheme.dark(
                                primary: Color(0xFF4F46E5))),
                        child: child!));
                if (date != null) {
                  onChanged(DateFormat('yyyy-MM-dd').format(date));
                }
              },
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: const InputDecoration(
                  filled: true,
                  fillColor: Color(0xFF334155),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(12)),
                      borderSide: BorderSide.none),
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 14, vertical: 14)))
          : TextFormField(
              initialValue: value,
              onChanged: onChanged,
              maxLength: maxLength,
              maxLines: maxLines,
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                  counterText: '',
                  filled: true,
                  fillColor: const Color(0xFF334155).withValues(alpha: 0.5),
                  border: const OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(12)),
                      borderSide: BorderSide.none),
                  contentPadding: EdgeInsets.symmetric(
                      horizontal: 14, vertical: maxLines > 1 ? 14 : 14))),
    ]);
  }

  Widget _buildDropdownField(
      {required String label,
      required String value,
      required List<String> items,
      required ValueChanged<String?> onChanged}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label,
          style: const TextStyle(
              color: Color(0xFFCBD5E1),
              fontSize: 13,
              fontWeight: FontWeight.w600)),
      const SizedBox(height: 6),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 14),
        decoration: BoxDecoration(
            color: const Color(0xFF334155).withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(12)),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: items.contains(value) ? value : items.first,
            isExpanded: true,
            dropdownColor: const Color(0xFF1E293B),
            icon: const Icon(Icons.arrow_drop_down_rounded,
                color: Color(0xFF94A3B8)),
            style: const TextStyle(color: Colors.white, fontSize: 14),
            items: items
                .map((e) => DropdownMenuItem<String>(value: e, child: Text(e)))
                .toList(),
            onChanged: onChanged,
          ),
        ),
      ),
    ]);
  }

  Widget _buildSummaryRow(String label, String amount, Color color,
      {bool isBold = false, double fontSize = 14}) {
    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Flexible(
          child: Text(label,
              style: TextStyle(
                  color: const Color(0xFF94A3B8),
                  fontSize: 13,
                  fontWeight: isBold ? FontWeight.w600 : FontWeight.normal))),
      Flexible(
          child: Text(amount,
              style: TextStyle(
                  color: color,
                  fontSize: fontSize,
                  fontWeight: isBold ? FontWeight.bold : FontWeight.w600),
              textAlign: TextAlign.right)),
    ]);
  }
}

// Custom Input Formatter for Rupiah
class _RupiahInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    if (newValue.text.isEmpty) return newValue;

    final digits = newValue.text.replaceAll(RegExp(r'[^\d]'), '');
    if (digits.isEmpty) return const TextEditingValue();

    final number = int.tryParse(digits) ?? 0;
    final formatted =
        NumberFormat('#,###', 'id_ID').format(number).replaceAll(',', '.');

    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

class _DetailItemCard extends StatefulWidget {
  final int index;
  final Map<String, dynamic> detail;
  final Function(int, String, dynamic) onUpdate;
  final Function(int) onRemove;
  final bool isDisabled;
  final List<Map<String, dynamic>> categories;
  final List<Map<String, dynamic>> productTypes;
  final List<Map<String, dynamic>> products;
  final List<Map<String, dynamic>> suppliers;
  final String Function(String) formatInputRupiah;

  const _DetailItemCard({
    super.key,
    required this.index,
    required this.detail,
    required this.onUpdate,
    required this.onRemove,
    required this.isDisabled,
    required this.categories,
    required this.productTypes,
    required this.products,
    required this.suppliers,
    required this.formatInputRupiah,
  });

  @override
  State<_DetailItemCard> createState() => _DetailItemCardState();
}

class _DetailItemCardState extends State<_DetailItemCard> {
  String _categoryFilter = '';
  String _typeFilter = '';

  late TextEditingController _qtyController;
  late TextEditingController _unitController;
  late TextEditingController _priceController;
  late TextEditingController _expenseController;

  @override
  void initState() {
    super.initState();
    _initializeFilters();
    _qtyController =
        TextEditingController(text: widget.detail['qty']?.toString() ?? '1');
    _unitController =
        TextEditingController(text: widget.detail['unit'] ?? 'unit');
    _priceController =
        TextEditingController(text: widget.detail['product_price'] ?? '');
    _expenseController =
        TextEditingController(text: widget.detail['expense'] ?? '');
  }

  @override
  void dispose() {
    _qtyController.dispose();
    _unitController.dispose();
    _priceController.dispose();
    _expenseController.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(covariant _DetailItemCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.detail['qty'] != widget.detail['qty']) {
      _qtyController.text = widget.detail['qty']?.toString() ?? '1';
    }
    if (oldWidget.detail['unit'] != widget.detail['unit']) {
      _unitController.text = widget.detail['unit'] ?? 'unit';
    }
    if (oldWidget.detail['product_price'] != widget.detail['product_price']) {
      if (_priceController.text != widget.detail['product_price']) {
        _priceController.text = widget.detail['product_price'] ?? '';
      }
    }
    if (oldWidget.detail['expense'] != widget.detail['expense']) {
      if (_expenseController.text != widget.detail['expense']) {
        _expenseController.text = widget.detail['expense'] ?? '';
      }
    }
  }

  void _initializeFilters() {
    final productId = widget.detail['product_id']?.toString();
    if (productId != null && productId.isNotEmpty) {
      final matchedProducts = widget.products
          .where((p) => p['id'].toString() == productId)
          .toList();
      final product = matchedProducts.isNotEmpty
          ? matchedProducts.first
          : <String, dynamic>{};

      if (product.isNotEmpty) {
        _typeFilter = product['product_type_id']?.toString() ?? '';

        if (_typeFilter.isNotEmpty) {
          final matchedTypes = widget.productTypes
              .where((t) => t['id'].toString() == _typeFilter)
              .toList();
          final type = matchedTypes.isNotEmpty
              ? matchedTypes.first
              : <String, dynamic>{};

          if (type.isNotEmpty) {
            _categoryFilter = type['category_id']?.toString() ?? '';
          }
        }
      }
    }
  }

  List<Map<String, dynamic>> get _filteredTypes {
    if (_categoryFilter.isEmpty) return widget.productTypes;
    return widget.productTypes
        .where((t) => t['category_id']?.toString() == _categoryFilter)
        .toList();
  }

  List<Map<String, dynamic>> get _filteredProducts {
    return widget.products.where((p) {
      final matchCategory = _categoryFilter.isEmpty ||
          widget.productTypes.any((t) =>
              t['id'].toString() == p['product_type_id']?.toString() &&
              t['category_id']?.toString() == _categoryFilter);
      final matchType = _typeFilter.isEmpty ||
          p['product_type_id']?.toString() == _typeFilter;
      return matchCategory && matchType;
    }).toList();
  }

  void _onProductSelected(Map<String, dynamic> product) {
    widget.onUpdate(widget.index, 'product_id', product['id'].toString());
    widget.onUpdate(widget.index, 'unit', product['unit'] ?? 'unit');

    final formattedPrice =
        widget.formatInputRupiah((product['price'] ?? 0).round().toString());
    widget.onUpdate(widget.index, 'product_price', formattedPrice);
    _priceController.text = formattedPrice;

    final typeId = product['product_type_id']?.toString() ?? '';
    setState(() {
      _typeFilter = typeId;
      final matchedTypes = widget.productTypes
          .where((t) => t['id'].toString() == typeId)
          .toList();
      final type =
          matchedTypes.isNotEmpty ? matchedTypes.first : <String, dynamic>{};

      if (type.isNotEmpty) {
        _categoryFilter = type['category_id']?.toString() ?? '';
      }
    });
  }

  void _showProductSelectionModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF1E293B),
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (modalContext) => _ProductSelectionModal(
        products: _filteredProducts,
        onSelected: (product) {
          _onProductSelected(product);
          Navigator.of(modalContext, rootNavigator: false).pop();
        },
      ),
    );
  }

  String _calculateItemTotal() {
    final price =
        CurrencyFormatter.parseRupiah(widget.detail['product_price'] ?? '');
    final qty = double.tryParse(widget.detail['qty']?.toString() ?? '0') ?? 0;
    return CurrencyFormatter.formatRupiah(price * qty);
  }

  @override
  Widget build(BuildContext context) {
    final productId = widget.detail['product_id']?.toString();

    Map<String, dynamic> product = {};
    if (productId != null && productId.isNotEmpty) {
      final matched = widget.products
          .where((p) => p['id'].toString() == productId)
          .toList();
      if (matched.isNotEmpty) {
        product = matched.first;
      }
    }

    final displayText = product.isNotEmpty
        ? '${product['name']} (${product['code']})'
        : 'Pilih Produk';

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF334155))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Item #${widget.index + 1}',
              style: const TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 12,
                  fontWeight: FontWeight.w600)),
          IconButton(
              icon: const Icon(Icons.delete_rounded,
                  color: Color(0xFFEF4444), size: 20),
              onPressed: widget.isDisabled
                  ? null
                  : () => widget.onRemove(widget.index),
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints()),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(
              child: _buildSmallDropdown(
                  label: 'Kategori',
                  value: _categoryFilter,
                  items: widget.categories
                      .map((c) => {'id': c['id'].toString(), 'name': c['name']})
                      .toList(),
                  onChanged: (val) {
                    setState(() {
                      _categoryFilter = val ?? '';
                      _typeFilter = '';
                      widget.onUpdate(widget.index, 'product_id', '');
                    });
                  },
                  hint: 'Pilih Kategori')),
          const SizedBox(width: 8),
          Expanded(
              child: _buildSmallDropdown(
                  label: 'Jenis',
                  value: _typeFilter,
                  items: _filteredTypes
                      .map((t) => {'id': t['id'].toString(), 'name': t['name']})
                      .toList(),
                  onChanged: (val) {
                    setState(() {
                      _typeFilter = val ?? '';
                      widget.onUpdate(widget.index, 'product_id', '');
                    });
                  },
                  hint: 'Pilih Jenis',
                  isEnabled: _categoryFilter.isNotEmpty)),
        ]),
        const SizedBox(height: 12),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Produk *',
              style: TextStyle(
                  color: Color(0xFFCBD5E1),
                  fontSize: 11,
                  fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          InkWell(
            onTap: widget.isDisabled ? null : _showProductSelectionModal,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF334155))),
              child: Row(children: [
                Expanded(
                    child: Text(displayText,
                        style: TextStyle(
                            color: product.isNotEmpty
                                ? Colors.white
                                : const Color(0xFF64748B),
                            fontSize: 13),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis)),
                const Icon(Icons.arrow_drop_down_rounded,
                    color: Color(0xFF94A3B8)),
              ]),
            ),
          ),
        ]),
        const SizedBox(height: 12),
        _buildSmallDropdown(
            label: 'Supplier (Opsional)',
            value: widget.detail['supplier_id']?.toString() ?? '',
            items: widget.suppliers
                .map((s) => {'id': s['id'].toString(), 'name': s['name']})
                .toList(),
            onChanged: (val) =>
                widget.onUpdate(widget.index, 'supplier_id', val ?? ''),
            hint: 'Pilih Supplier'),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(
              flex: 1,
              child: _buildSmallTextField(
                  label: 'Satuan',
                  controller: _unitController,
                  onChanged: (v) => widget.onUpdate(widget.index, 'unit', v))),
          const SizedBox(width: 8),
          Expanded(
              flex: 1,
              child: _buildSmallTextField(
                  label: 'Qty *',
                  controller: _qtyController,
                  onChanged: (v) => widget.onUpdate(widget.index, 'qty', v),
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly])),
          const SizedBox(width: 8),
          Expanded(
              flex: 2,
              child: _buildSmallTextField(
                  label: 'Harga',
                  controller: _priceController,
                  onChanged: (v) =>
                      widget.onUpdate(widget.index, 'product_price', v),
                  hint: '0',
                  keyboardType: TextInputType.number,
                  inputFormatters: [_RupiahInputFormatter()])),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(
              child: _buildSmallTextField(
                  label: 'Pengeluaran',
                  controller: _expenseController,
                  onChanged: (v) => widget.onUpdate(widget.index, 'expense', v),
                  hint: '0',
                  keyboardType: TextInputType.number,
                  inputFormatters: [_RupiahInputFormatter()])),
          const SizedBox(width: 8),
          Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                const Text('Total',
                    style: TextStyle(
                        color: Color(0xFFCBD5E1),
                        fontSize: 11,
                        fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 10),
                    decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(8)),
                    child: Text(_calculateItemTotal(),
                        style: const TextStyle(
                            color: Color(0xFF10B981),
                            fontSize: 13,
                            fontWeight: FontWeight.w600))),
              ])),
        ]),
      ]),
    );
  }

  Widget _buildSmallDropdown(
      {required String label,
      required String value,
      required List<Map<String, dynamic>> items,
      required ValueChanged<String?> onChanged,
      required String hint,
      bool isEnabled = true}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label,
          style: const TextStyle(
              color: Color(0xFFCBD5E1),
              fontSize: 11,
              fontWeight: FontWeight.w600)),
      const SizedBox(height: 4),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 10),
        decoration: BoxDecoration(
            color: const Color(0xFF0F172A),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFF334155))),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: items.any((i) => i['id'].toString() == value) ? value : null,
            isExpanded: true,
            dropdownColor: const Color(0xFF1E293B),
            icon: const Icon(Icons.arrow_drop_down_rounded,
                color: Color(0xFF94A3B8), size: 20),
            style: const TextStyle(color: Colors.white, fontSize: 13),
            hint: Text(hint,
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 13)),
            items: items
                .map((e) => DropdownMenuItem<String>(
                    value: e['id'].toString(),
                    child: Text(e['name'].toString())))
                .toList(),
            onChanged: isEnabled ? onChanged : null,
          ),
        ),
      ),
    ]);
  }

  Widget _buildSmallTextField(
      {required String label,
      required TextEditingController controller,
      required ValueChanged<String> onChanged,
      String? hint,
      TextInputType? keyboardType,
      List<TextInputFormatter>? inputFormatters}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label,
          style: const TextStyle(
              color: Color(0xFFCBD5E1),
              fontSize: 11,
              fontWeight: FontWeight.w600)),
      const SizedBox(height: 4),
      TextFormField(
        controller: controller,
        onChanged: onChanged,
        keyboardType: keyboardType,
        inputFormatters: inputFormatters,
        style: const TextStyle(color: Colors.white, fontSize: 13),
        decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
            filled: true,
            fillColor: const Color(0xFF0F172A),
            border: const OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(8)),
                borderSide: BorderSide.none),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 10, vertical: 10)),
      ),
    ]);
  }
}

class _ProductSelectionModal extends StatefulWidget {
  final List<Map<String, dynamic>> products;
  final Function(Map<String, dynamic>) onSelected;

  const _ProductSelectionModal(
      {required this.products, required this.onSelected});

  @override
  State<_ProductSelectionModal> createState() => _ProductSelectionModalState();
}

class _ProductSelectionModalState extends State<_ProductSelectionModal> {
  final _searchController = TextEditingController();
  List<Map<String, dynamic>> _filtered = [];

  @override
  void initState() {
    super.initState();
    _filtered = widget.products;
    _searchController.addListener(_filterProducts);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterProducts() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filtered = widget.products.where((p) {
        final name = p['name']?.toString().toLowerCase() ?? '';
        final code = p['code']?.toString().toLowerCase() ?? '';
        return name.contains(query) || code.contains(query);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 16,
          right: 16,
          top: 16),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
                color: const Color(0xFF334155),
                borderRadius: BorderRadius.circular(2))),
        const Text('Pilih Produk',
            style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        TextField(
          controller: _searchController,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Cari nama atau kode produk...',
            hintStyle: const TextStyle(color: Color(0xFF64748B)),
            prefixIcon:
                const Icon(Icons.search_rounded, color: Color(0xFF94A3B8)),
            filled: true,
            fillColor: const Color(0xFF0F172A),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none),
            suffixIcon: _searchController.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear_rounded,
                        color: Color(0xFF94A3B8)),
                    onPressed: () {
                      _searchController.clear();
                      _filterProducts();
                    })
                : null,
          ),
        ),
        const SizedBox(height: 16),
        Flexible(
            child: ConstrainedBox(
          constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.5),
          child: _filtered.isEmpty
              ? const Center(
                  child: Padding(
                      padding: EdgeInsets.all(24),
                      child: Text('Tidak ada produk ditemukan',
                          style: TextStyle(color: Color(0xFF94A3B8)))))
              : ListView.builder(
                  shrinkWrap: true,
                  itemCount: _filtered.length,
                  itemBuilder: (context, index) {
                    final product = _filtered[index];
                    return ListTile(
                      title: Text(product['name'] ?? '',
                          style: const TextStyle(color: Colors.white)),
                      subtitle: Text(
                          'Kode: ${product['code'] ?? '-'} | Harga: ${CurrencyFormatter.formatRupiah(product['price'] ?? 0)}',
                          style: const TextStyle(
                              color: Color(0xFF94A3B8), fontSize: 12)),
                      onTap: () => widget.onSelected(product),
                    );
                  },
                ),
        )),
        const SizedBox(height: 16),
      ]),
    );
  }
}
