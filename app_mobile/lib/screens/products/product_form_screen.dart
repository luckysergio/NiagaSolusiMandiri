import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../models/product.dart';
import '../../services/dropdown_service.dart';
import '../../services/product_service.dart';
import '../../utils/currency_formatter.dart';

class ProductFormScreen extends StatefulWidget {
  final Product? editingProduct;

  const ProductFormScreen({super.key, this.editingProduct});

  @override
  State<ProductFormScreen> createState() => _ProductFormScreenState();
}

class _ProductFormScreenState extends State<ProductFormScreen> {
  final _formKey = GlobalKey<FormState>();

  final _codeController = TextEditingController();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _unitController = TextEditingController(text: 'unit');
  final _minOrderController = TextEditingController(text: '1');
  final _sortOrderController = TextEditingController(text: '0');

  List<Category> _categories = [];
  List<ProductType> _productTypes = [];
  Category? _selectedCategory;
  ProductType? _selectedProductType;

  bool _featured = false;
  bool _isActive = true;
  bool _isSubmitting = false;
  bool _isGeneratingCode = false;
  bool _isLoadingInit = true;

  bool get _isEditing => widget.editingProduct != null;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  @override
  void dispose() {
    _codeController.dispose();
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _unitController.dispose();
    _minOrderController.dispose();
    _sortOrderController.dispose();
    super.dispose();
  }

  Future<void> _initialize() async {
    setState(() => _isLoadingInit = true);
    await _loadCategories();

    if (_isEditing) {
      final p = widget.editingProduct!;
      _codeController.text = p.code ?? '';
      _nameController.text = p.name;
      _descriptionController.text = p.description ?? '';
      _priceController.text = CurrencyFormatter.formatInput(p.price.toString());
      _unitController.text = p.unit;
      _minOrderController.text = p.minimumOrder.toString();
      _sortOrderController.text = p.sortOrder.toString();
      _featured = p.featured;
      _isActive = p.isActive;

      if (p.productType != null) {
        _selectedProductType = p.productType;
        if (p.productType!.category != null) {
          _selectedCategory = p.productType!.category;
          await _loadProductTypes(categoryId: _selectedCategory!.id);
        }
      }
    } else {
      // Auto-fill sort order for new product
      final nextSort = await ProductService.getNextSortOrder();
      if (mounted) _sortOrderController.text = nextSort.toString();
    }

    if (mounted) setState(() => _isLoadingInit = false);
  }

  Future<void> _loadCategories() async {
    final cats = await DropdownService.getCategories();
    if (mounted) setState(() => _categories = cats);
  }

  Future<void> _loadProductTypes({required int categoryId}) async {
    final types = await DropdownService.getProductTypes(categoryId: categoryId);
    if (mounted) setState(() => _productTypes = types);
  }

  Future<void> _handleCategoryChanged(Category? category) async {
    setState(() {
      _selectedCategory = category;
      _selectedProductType = null;
      _productTypes = [];
      _codeController.clear();
    });
    if (category != null) {
      await _loadProductTypes(categoryId: category.id);
    }
  }

  Future<void> _handleGenerateCode() async {
    if (_selectedProductType == null) {
      _showError('Pilih jenis produk terlebih dahulu');
      return;
    }
    if (_nameController.text.trim().isEmpty) {
      _showError('Nama produk wajib diisi untuk generate kode');
      return;
    }
    setState(() => _isGeneratingCode = true);
    final code = await ProductService.generateCode(
      _selectedProductType!.id,
      _nameController.text.trim(),
    );
    if (mounted) {
      setState(() {
        _codeController.text = code;
        _isGeneratingCode = false;
      });
    }
  }

  void _onPriceChanged(String value) {
    final digits = value.replaceAll(RegExp(r'[^\d]'), '');
    final formatted = CurrencyFormatter.formatInput(digits);
    _priceController.value = TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedProductType == null) {
      _showError('Jenis produk wajib dipilih');
      return;
    }

    setState(() => _isSubmitting = true);

    final payload = {
      'product_type_id': _selectedProductType!.id,
      'code': _codeController.text.trim().isEmpty
          ? null
          : _codeController.text.trim(),
      'name': _nameController.text.trim(),
      'description': _descriptionController.text.trim().isEmpty
          ? null
          : _descriptionController.text.trim(),
      'price': CurrencyFormatter.parseRupiah(_priceController.text),
      'unit': _unitController.text.trim().isEmpty
          ? 'unit'
          : _unitController.text.trim(),
      'minimum_order': num.tryParse(_minOrderController.text) ?? 1,
      'sort_order': int.tryParse(_sortOrderController.text) ?? 0,
      'featured': _featured ? '1' : '0',
      'is_active': _isActive ? '1' : '0',
    };

    try {
      if (_isEditing) {
        await ProductService.update(widget.editingProduct!.id, payload);
      } else {
        await ProductService.create(payload);
      }
      if (!mounted) return;
      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;
      setState(() => _isSubmitting = false);
      _showError(e.toString().replaceFirst('Exception: ', ''));
    }
  }

  void _showError(String message) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.error_rounded, color: Colors.red),
            SizedBox(width: 10),
            Text('Gagal',
                style: TextStyle(
                    color: Colors.white, fontWeight: FontWeight.w600)),
          ],
        ),
        content:
            Text(message, style: const TextStyle(color: Color(0xFFCBD5E1))),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            style: TextButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('OK', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoadingInit) {
      return Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        body: const Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          _isEditing ? 'Edit Produk' : 'Tambah Produk',
          style:
              const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Kategori
            _SectionLabel(text: 'Kategori & Jenis'),
            const SizedBox(height: 8),
            _DropdownField<Category>(
              label: 'Kategori *',
              value: _selectedCategory,
              items: _categories,
              itemLabel: (c) => c.name,
              onChanged: _isSubmitting ? null : _handleCategoryChanged,
            ),
            const SizedBox(height: 12),
            _DropdownField<ProductType>(
              label: 'Jenis Produk *',
              value: _selectedProductType,
              items: _productTypes,
              itemLabel: (t) => t.name,
              enabled: _selectedCategory != null && !_isSubmitting,
              onChanged: (t) => setState(() => _selectedProductType = t),
            ),

            const SizedBox(height: 20),
            _SectionLabel(text: 'Informasi Produk'),
            const SizedBox(height: 8),

            // Code + Generate
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: _TextField(
                    controller: _codeController,
                    label: 'Kode Produk',
                    hint: 'Auto-generated',
                    enabled: !_isSubmitting,
                  ),
                ),
                const SizedBox(width: 8),
                Padding(
                  padding: const EdgeInsets.only(top: 28),
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton.icon(
                      onPressed: (_isSubmitting || _isGeneratingCode)
                          ? null
                          : _handleGenerateCode,
                      icon: _isGeneratingCode
                          ? const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2, color: Colors.white),
                            )
                          : const Icon(Icons.auto_awesome_rounded, size: 16),
                      label: const Text('Generate',
                          style: TextStyle(fontSize: 12)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            _TextField(
              controller: _nameController,
              label: 'Nama Produk *',
              hint: 'Contoh: Beton Readymix K-300',
              enabled: !_isSubmitting,
              validator: (v) {
                if (v == null || v.isEmpty) return 'Nama wajib diisi';
                if (v.length > 150) return 'Maksimal 150 karakter';
                return null;
              },
            ),
            const SizedBox(height: 12),

            _TextField(
              controller: _descriptionController,
              label: 'Deskripsi',
              hint: 'Deskripsi singkat produk',
              enabled: !_isSubmitting,
              maxLines: 3,
            ),

            const SizedBox(height: 20),
            _SectionLabel(text: 'Harga & Inventori'),
            const SizedBox(height: 8),

            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: _TextField(
                    controller: _priceController,
                    label: 'Harga (Rp) *',
                    hint: '0',
                    enabled: !_isSubmitting,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    onChanged: _onPriceChanged,
                    validator: (v) {
                      final val = CurrencyFormatter.parseRupiah(v ?? '');
                      if (val < 0) return 'Minimal 0';
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _TextField(
                    controller: _unitController,
                    label: 'Unit',
                    hint: 'unit',
                    enabled: !_isSubmitting,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _TextField(
                    controller: _minOrderController,
                    label: 'Min. Order',
                    hint: '1',
                    enabled: !_isSubmitting,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _TextField(
                    controller: _sortOrderController,
                    label: 'Sort Order',
                    hint: '0',
                    enabled: !_isSubmitting,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),
            _SectionLabel(text: 'Status'),
            const SizedBox(height: 8),

            Row(
              children: [
                Expanded(
                  child: _SwitchField(
                    label: 'Featured',
                    value: _featured,
                    onChanged: _isSubmitting
                        ? null
                        : (v) => setState(() => _featured = v),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _SwitchField(
                    label: 'Aktif',
                    value: _isActive,
                    onChanged: _isSubmitting
                        ? null
                        : (v) => setState(() => _isActive = v),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 32),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed:
                        _isSubmitting ? null : () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF94A3B8),
                      side: const BorderSide(color: Color(0xFF334155)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Batal'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    onPressed: _isSubmitting ? null : _handleSubmit,
                    icon: _isSubmitting
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.white),
                          )
                        : const Icon(Icons.save_rounded, size: 18),
                    label: Text(
                      _isSubmitting
                          ? (_isEditing ? 'Memperbarui...' : 'Menyimpan...')
                          : (_isEditing ? 'Update Produk' : 'Simpan Produk'),
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel({required this.text});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: Color(0xFF94A3B8),
        fontSize: 12,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
      ),
    );
  }
}

class _TextField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String hint;
  final bool enabled;
  final int maxLines;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final ValueChanged<String>? onChanged;
  final String? Function(String?)? validator;

  const _TextField({
    required this.controller,
    required this.label,
    required this.hint,
    this.enabled = true,
    this.maxLines = 1,
    this.keyboardType,
    this.inputFormatters,
    this.onChanged,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                color: Color(0xFFCBD5E1),
                fontSize: 13,
                fontWeight: FontWeight.w600)),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          enabled: enabled,
          maxLines: maxLines,
          keyboardType: keyboardType,
          inputFormatters: inputFormatters,
          onChanged: onChanged,
          validator: validator,
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF64748B)),
            filled: true,
            fillColor: const Color(0xFF334155).withValues(alpha: 0.5),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          ),
        ),
      ],
    );
  }
}

class _DropdownField<T> extends StatelessWidget {
  final String label;
  final T? value;
  final List<T> items;
  final String Function(T) itemLabel;
  final ValueChanged<T?>? onChanged;
  final bool enabled;

  const _DropdownField({
    required this.label,
    required this.value,
    required this.items,
    required this.itemLabel,
    required this.onChanged,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
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
            borderRadius: BorderRadius.circular(12),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<T>(
              value: value,
              isExpanded: true,
              hint: Text('Pilih ${label.replaceAll(' *', '')}',
                  style: const TextStyle(color: Color(0xFF64748B))),
              dropdownColor: const Color(0xFF1E293B),
              icon: const Icon(Icons.arrow_drop_down_rounded,
                  color: Color(0xFF94A3B8)),
              style: const TextStyle(color: Colors.white, fontSize: 14),
              items: items
                  .map((item) => DropdownMenuItem(
                      value: item, child: Text(itemLabel(item))))
                  .toList(),
              onChanged: enabled ? onChanged : null,
            ),
          ),
        ),
      ],
    );
  }
}

class _SwitchField extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool>? onChanged;

  const _SwitchField(
      {required this.label, required this.value, this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF334155).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(label,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500)),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            // ignore: deprecated_member_use
            activeColor: const Color(0xFF4F46E5),
          ),
        ],
      ),
    );
  }
}
