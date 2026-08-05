import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../models/product.dart';
import '../../providers/auth_provider.dart';
import '../../services/dropdown_service.dart';
import '../../services/product_service.dart';
import '../../utils/currency_formatter.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final _searchController = TextEditingController();
  Timer? _debounce;

  List<Product> _products = [];
  List<Category> _categories = [];
  List<ProductType> _productTypes = [];

  bool _isLoading = true;
  bool _isRefreshing = false;
  bool _isMutating = false;

  int _currentPage = 1;
  int _lastPage = 1;
  int _totalItems = 0;

  String _searchQuery = '';
  int? _selectedCategoryId;
  int? _selectedProductTypeId;

  bool get _isAdmin {
    final role = context.read<AuthProvider>().user?.role?.toLowerCase() ?? '';
    return role == 'admin' || role == 'super_admin' || role == 'superadmin';
  }

  bool get _hasActiveFilters =>
      _searchQuery.isNotEmpty ||
      _selectedCategoryId != null ||
      _selectedProductTypeId != null;

  @override
  void initState() {
    super.initState();
    _loadCategories();
    _loadProducts();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    final categories = await DropdownService.getCategories();
    if (mounted) setState(() => _categories = categories);
  }

  Future<void> _loadProductTypes({int? categoryId}) async {
    final types = await DropdownService.getProductTypes(categoryId: categoryId);
    if (mounted) setState(() => _productTypes = types);
  }

  Future<void> _loadProducts({bool showLoading = true}) async {
    if (showLoading && !mounted) return;
    if (showLoading) setState(() => _isLoading = true);

    try {
      final result = await ProductService.getAll(
        page: _currentPage,
        perPage: 12,
        search: _searchQuery,
        categoryId: _selectedCategoryId,
        productTypeId: _selectedProductTypeId,
      );

      if (!mounted) return;
      setState(() {
        _products = result['products'] as List<Product>;
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
    await _loadProducts(showLoading: false);
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      if (!mounted) return;
      setState(() {
        _searchQuery = value;
        _currentPage = 1;
      });
      _loadProducts();
    });
  }

  void _onCategoryChanged(int? id) {
    setState(() {
      _selectedCategoryId = id;
      _selectedProductTypeId = null;
      _currentPage = 1;
      _productTypes = [];
    });
    if (id != null) {
      _loadProductTypes(categoryId: id);
    }
    _loadProducts();
  }

  void _onProductTypeChanged(int? id) {
    setState(() {
      _selectedProductTypeId = id;
      _currentPage = 1;
    });
    _loadProducts();
  }

  void _resetFilters() {
    _searchController.clear();
    setState(() {
      _searchQuery = '';
      _selectedCategoryId = null;
      _selectedProductTypeId = null;
      _currentPage = 1;
      _productTypes = [];
    });
    _loadProducts();
  }

  Future<void> _handleToggleFeatured(Product product) async {
    if (!_isAdmin) return;
    setState(() => _isMutating = true);
    try {
      await ProductService.toggleFeatured(product.id);
      if (!mounted) return;
      _showSuccess('Berhasil', 'Status featured berhasil diubah');
      _loadProducts(showLoading: false);
    } catch (e) {
      if (!mounted) return;
      _showError('Gagal', e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isMutating = false);
    }
  }

  Future<void> _handleToggleActive(Product product) async {
    if (!_isAdmin) return;
    setState(() => _isMutating = true);
    try {
      await ProductService.toggleActive(product.id);
      if (!mounted) return;
      _showSuccess('Berhasil', 'Status produk berhasil diubah');
      _loadProducts(showLoading: false);
    } catch (e) {
      if (!mounted) return;
      _showError('Gagal', e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isMutating = false);
    }
  }

  Future<void> _handleDelete(Product product) async {
    if (!_isAdmin) return;
    final confirmed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Color(0xFFEF4444)),
            SizedBox(width: 10),
            Text(
              'Konfirmasi Hapus',
              style:
                  TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ],
        ),
        content: Text(
          'Apakah Anda yakin ingin menghapus produk "${product.name}" (${product.code ?? '-'})?',
          style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child:
                const Text('Batal', style: TextStyle(color: Color(0xFF94A3B8))),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Hapus', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;

    setState(() => _isMutating = true);
    try {
      await ProductService.delete(product.id);
      if (!mounted) return;
      _showSuccess('Berhasil', 'Produk berhasil dihapus');
      _loadProducts(showLoading: false);
    } catch (e) {
      if (!mounted) return;
      _showError('Gagal', e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isMutating = false);
    }
  }

  Future<void> _openForm({Product? product}) async {
    final result = await context.push(
      product == null ? '/products/create' : '/products/edit/${product.id}',
      extra: product,
    );
    if (result == true && mounted) {
      _loadProducts(showLoading: false);
    }
  }

  void _showSuccess(String title, String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF10B981),
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.white),
            const SizedBox(width: 10),
            Expanded(
                child:
                    Text(message, style: const TextStyle(color: Colors.white))),
          ],
        ),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _showError(String title, String message) {
    if (!mounted) return;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.red.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child:
                  const Icon(Icons.error_rounded, color: Colors.red, size: 20),
            ),
            const SizedBox(width: 10),
            Text(title,
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.w600)),
          ],
        ),
        content: Text(message,
            style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 14)),
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
    return Scaffold(
      backgroundColor: Colors.transparent,
      // ✅ resizeToAvoidBottomInset: true (default) membiarkan UI menyesuaikan saat keyboard muncul
      body: Stack(
        children: [
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            slivers: [
              SliverAppBar(
                floating: true,
                backgroundColor: Colors.transparent,
                elevation: 0,
                title: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Produk',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.3,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Kelola katalog produk Anda',
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                    ),
                  ],
                ),
                actions: [
                  IconButton(
                    onPressed: _isRefreshing ? null : _refresh,
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B).withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                            color:
                                const Color(0xFF334155).withValues(alpha: 0.5)),
                      ),
                      child: AnimatedRotation(
                        turns: _isRefreshing ? 1 : 0,
                        duration: const Duration(milliseconds: 800),
                        child: const Icon(Icons.refresh_rounded,
                            color: Color(0xFFCBD5E1), size: 20),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
              ),

              // Search & Filters
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          const Color(0xFF1E293B).withValues(alpha: 0.7),
                          const Color(0xFF0F172A).withValues(alpha: 0.5),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                          color:
                              const Color(0xFF334155).withValues(alpha: 0.5)),
                    ),
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
                                'Cari produk berdasarkan nama, kode, atau deskripsi...',
                            hintStyle:
                                const TextStyle(color: Color(0xFF64748B)),
                            prefixIcon: const Icon(Icons.search_rounded,
                                color: Color(0xFF94A3B8)),
                            filled: true,
                            fillColor:
                                const Color(0xFF334155).withValues(alpha: 0.5),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 14),
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Row(
                          children: [
                            Icon(Icons.filter_list_rounded,
                                color: Color(0xFF94A3B8), size: 16),
                            SizedBox(width: 6),
                            Text(
                              'Filter:',
                              style: TextStyle(
                                  color: Color(0xFF94A3B8),
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _FilterDropdown<int?>(
                              label: 'Kategori',
                              value: _selectedCategoryId,
                              items: _categories
                                  .map((c) => DropdownMenuItem(
                                      value: c.id, child: Text(c.name)))
                                  .toList(),
                              onChanged: _onCategoryChanged,
                            ),
                            _FilterDropdown<int?>(
                              label: 'Jenis',
                              value: _selectedProductTypeId,
                              enabled: _selectedCategoryId != null,
                              items: _productTypes
                                  .map((t) => DropdownMenuItem(
                                      value: t.id, child: Text(t.name)))
                                  .toList(),
                              onChanged: _onProductTypeChanged,
                            ),
                            if (_hasActiveFilters)
                              TextButton.icon(
                                onPressed: _resetFilters,
                                icon: const Icon(Icons.close_rounded, size: 16),
                                label: const Text('Reset',
                                    style: TextStyle(fontSize: 12)),
                                style: TextButton.styleFrom(
                                  foregroundColor: const Color(0xFFEF4444),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 8),
                                ),
                              ),
                          ],
                        ),
                        if (_totalItems > 0) ...[
                          const SizedBox(height: 12),
                          Text(
                            'Menampilkan ${_products.length} dari $_totalItems produk',
                            style: const TextStyle(
                                color: Color(0xFF64748B), fontSize: 11),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),

              // Products Grid or Empty State
              if (_isLoading)
                const SliverFillRemaining(
                  child: Center(
                    child: CircularProgressIndicator(
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5))),
                  ),
                )
              else if (_products.isEmpty)
                // ✅ PERBAIKAN OVERFLOW: Menggunakan SliverToBoxAdapter agar tidak memaksa tinggi minimum
                // saat keyboard terbuka dan sisa layar mengecil.
                SliverToBoxAdapter(
                  child: _EmptyState(
                    hasFilters: _hasActiveFilters,
                    isAdmin: _isAdmin,
                    onCreate: _openForm,
                  ),
                )
              else
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverGrid(
                    gridDelegate:
                        const SliverGridDelegateWithMaxCrossAxisExtent(
                      maxCrossAxisExtent: 320,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 0.65,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final product = _products[index];
                        return _ProductCard(
                          product: product,
                          isAdmin: _isAdmin,
                          isMutating: _isMutating,
                          onToggleFeatured: () =>
                              _handleToggleFeatured(product),
                          onToggleActive: () => _handleToggleActive(product),
                          onEdit: () => _openForm(product: product),
                          onDelete: () => _handleDelete(product),
                        );
                      },
                      childCount: _products.length,
                    ),
                  ),
                ),

              // Pagination
              if (!_isLoading && _products.isNotEmpty && _lastPage > 1)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: _Pagination(
                      currentPage: _currentPage,
                      lastPage: _lastPage,
                      onPageChanged: (page) {
                        setState(() => _currentPage = page);
                        _loadProducts();
                      },
                    ),
                  ),
                ),

              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),

          // FAB for Admin only
          if (_isAdmin)
            Positioned(
              right: 16,
              bottom: 80,
              child: FloatingActionButton(
                onPressed: () => _openForm(),
                backgroundColor: const Color(0xFF4F46E5),
                child: const Icon(Icons.add_rounded,
                    color: Colors.white, size: 28),
              ),
            ),
        ],
      ),
    );
  }
}

class _FilterDropdown<T> extends StatelessWidget {
  final String label;
  final T value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?> onChanged;
  final bool enabled;

  const _FilterDropdown({
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    final isActive = value != null;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        gradient: isActive
            ? const LinearGradient(
                colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)])
            : null,
        color: isActive ? null : const Color(0xFF334155).withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(10),
        border:
            Border.all(color: const Color(0xFF475569).withValues(alpha: 0.5)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<T>(
          value: value,
          hint: Text(label,
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
          dropdownColor: const Color(0xFF1E293B),
          icon: Icon(Icons.arrow_drop_down_rounded,
              color: isActive ? Colors.white : const Color(0xFF94A3B8)),
          isDense: true,
          style: TextStyle(
              color: isActive ? Colors.white : const Color(0xFFCBD5E1),
              fontSize: 12),
          items: items,
          onChanged: enabled ? onChanged : null,
        ),
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Product product;
  final bool isAdmin;
  final bool isMutating;
  final VoidCallback onToggleFeatured;
  final VoidCallback onToggleActive;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _ProductCard({
    required this.product,
    required this.isAdmin,
    required this.isMutating,
    required this.onToggleFeatured,
    required this.onToggleActive,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF1E293B).withValues(alpha: 0.7),
            const Color(0xFF0F172A).withValues(alpha: 0.5),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: product.featured
              ? const Color(0xFFF59E0B).withValues(alpha: 0.4)
              : const Color(0xFF334155).withValues(alpha: 0.5),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (isAdmin)
                  GestureDetector(
                    onTap: isMutating ? null : onToggleFeatured,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: product.featured
                            ? const Color(0xFFF59E0B).withValues(alpha: 0.15)
                            : const Color(0xFF334155).withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.star_rounded,
                        color: product.featured
                            ? const Color(0xFFF59E0B)
                            : const Color(0xFF64748B),
                        size: 18,
                      ),
                    ),
                  )
                else
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: product.featured
                          ? const Color(0xFFF59E0B).withValues(alpha: 0.15)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      Icons.star_rounded,
                      color: product.featured
                          ? const Color(0xFFF59E0B)
                          : Colors.transparent,
                      size: 18,
                    ),
                  ),
                GestureDetector(
                  onTap: isAdmin && !isMutating ? onToggleActive : null,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: product.isActive
                          ? const Color(0xFF10B981).withValues(alpha: 0.15)
                          : const Color(0xFFEF4444).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: product.isActive
                            ? const Color(0xFF10B981).withValues(alpha: 0.3)
                            : const Color(0xFFEF4444).withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: product.isActive
                                ? const Color(0xFF10B981)
                                : const Color(0xFFEF4444),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          product.isActive ? 'Aktif' : 'Nonaktif',
                          style: TextStyle(
                            color: product.isActive
                                ? const Color(0xFF10B981)
                                : const Color(0xFFEF4444),
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Column(
              children: [
                Text(
                  product.name,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 6),
                if (product.code != null && product.code!.isNotEmpty)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A).withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                          color:
                              const Color(0xFF334155).withValues(alpha: 0.5)),
                    ),
                    child: Text(
                      product.code!,
                      style: const TextStyle(
                          color: Color(0xFF94A3B8),
                          fontSize: 10,
                          fontFamily: 'monospace'),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Container(
              height: 1, color: const Color(0xFF334155).withValues(alpha: 0.5)),
          const SizedBox(height: 10),
          Flexible(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  _InfoRow(
                    icon: Icons.layers_rounded,
                    color: const Color(0xFF3B82F6),
                    label: 'Jenis',
                    value: product.productType?.name ?? '-',
                  ),
                  const SizedBox(height: 6),
                  _InfoRow(
                    icon: Icons.folder_rounded,
                    color: const Color(0xFF818CF8),
                    label: 'Kategori',
                    value: product.productType?.category?.name ?? '-',
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A).withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                          color:
                              const Color(0xFF334155).withValues(alpha: 0.4)),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          CurrencyFormatter.formatRupiah(product.price),
                          style: const TextStyle(
                              color: Color(0xFF10B981),
                              fontSize: 14,
                              fontWeight: FontWeight.bold),
                        ),
                        if (product.minimumOrder > 1) ...[
                          const SizedBox(height: 2),
                          Text(
                            'Min: ${product.minimumOrder} ${product.unit}',
                            style: const TextStyle(
                                color: Color(0xFF94A3B8), fontSize: 10),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isAdmin) ...[
            Container(
                height: 1,
                color: const Color(0xFF334155).withValues(alpha: 0.5)),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Row(
                children: [
                  Expanded(
                    child: _ActionButton(
                      icon: Icons.edit_rounded,
                      label: 'Edit',
                      color: const Color(0xFF3B82F6),
                      onTap: isMutating ? null : onEdit,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _ActionButton(
                      icon: Icons.delete_rounded,
                      label: 'Hapus',
                      color: const Color(0xFFEF4444),
                      onTap: isMutating ? null : onDelete,
                    ),
                  ),
                ],
              ),
            ),
          ] else
            const SizedBox(height: 12),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String label;
  final String value;

  const _InfoRow(
      {required this.icon,
      required this.color,
      required this.label,
      required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(6)),
          child: Icon(icon, color: color, size: 12),
        ),
        const SizedBox(width: 6),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label.toUpperCase(),
                style: const TextStyle(
                    color: Color(0xFF64748B),
                    fontSize: 8,
                    fontWeight: FontWeight.w600),
              ),
              Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                    color: Color(0xFFE2E8F0),
                    fontSize: 11,
                    fontWeight: FontWeight.w500),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  const _ActionButton(
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
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: color.withValues(alpha: 0.3)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 14),
              const SizedBox(width: 4),
              Text(label,
                  style: TextStyle(
                      color: color, fontSize: 11, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final bool hasFilters;
  final bool isAdmin;
  final Function({Product? product}) onCreate;

  const _EmptyState(
      {required this.hasFilters,
      required this.isAdmin,
      required this.onCreate});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
      child: Column(
        mainAxisAlignment:
            MainAxisAlignment.start, // ✅ Mencegah overflow saat keyboard muncul
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF4F46E5).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(24),
            ),
            child: const Icon(Icons.inventory_2_rounded,
                size: 64, color: Color(0xFF4F46E5)),
          ),
          const SizedBox(height: 24),
          Text(
            hasFilters ? 'Tidak Ada Produk' : 'Belum Ada Produk',
            style: const TextStyle(
                color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Text(
            hasFilters
                ? 'Tidak ada produk yang cocok dengan filter Anda.'
                : (isAdmin
                    ? 'Klik tombol + untuk menambah produk pertama.'
                    : 'Belum ada produk yang tersedia.'),
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
          ),
          if (!hasFilters && isAdmin) ...[
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => onCreate(),
              icon: const Icon(Icons.add_rounded),
              label: const Text('Tambah Produk Pertama'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ],
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
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          onPressed:
              currentPage > 1 ? () => onPageChanged(currentPage - 1) : null,
          icon: const Icon(Icons.chevron_left_rounded, color: Colors.white),
        ),
        ...List.generate(
          lastPage > 5 ? 5 : lastPage,
          (i) {
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
                            : const Color(0xFF334155).withValues(alpha: 0.5),
                      ),
                    ),
                    child: Center(
                      child: Text(
                        '$page',
                        style: TextStyle(
                            color: isActive
                                ? Colors.white
                                : const Color(0xFF94A3B8),
                            fontWeight: FontWeight.w600,
                            fontSize: 13),
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
        IconButton(
          onPressed: currentPage < lastPage
              ? () => onPageChanged(currentPage + 1)
              : null,
          icon: const Icon(Icons.chevron_right_rounded, color: Colors.white),
        ),
      ],
    );
  }
}
