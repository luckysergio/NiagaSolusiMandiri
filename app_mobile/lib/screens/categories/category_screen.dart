import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/category.dart';
import '../../providers/auth_provider.dart';
import '../../services/category_service.dart';
import 'category_form_dialog.dart';

class CategoryScreen extends StatefulWidget {
  const CategoryScreen({super.key});

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  final _searchController = TextEditingController();
  Timer? _debounce;

  List<Category> _categories = [];
  bool _isLoading = true;
  bool _isRefreshing = false;
  bool _isMutating = false;

  int _currentPage = 1;
  int _lastPage = 1;
  int _totalItems = 0;

  String _searchQuery = '';
  String? _selectedActiveFilter;

  bool get _isAdmin {
    final role = context.read<AuthProvider>().user?.role?.toLowerCase() ?? '';
    return role == 'admin' || role == 'super_admin' || role == 'superadmin';
  }

  bool get _hasActiveFilters =>
      _searchQuery.isNotEmpty || _selectedActiveFilter != null;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  Future<void> _loadCategories({bool showLoading = true}) async {
    if (showLoading && !mounted) return;
    if (showLoading) setState(() => _isLoading = true);

    try {
      final result = await CategoryService.getAll(
        page: _currentPage,
        perPage: 12,
        search: _searchQuery,
        isActive: _selectedActiveFilter,
      );

      if (!mounted) return;
      setState(() {
        _categories = result['categories'] as List<Category>;
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
    await _loadCategories(showLoading: false);
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      if (!mounted) return;
      setState(() {
        _searchQuery = value;
        _currentPage = 1;
      });
      _loadCategories();
    });
  }

  void _onActiveFilterChanged(String? value) {
    setState(() {
      _selectedActiveFilter = value;
      _currentPage = 1;
    });
    _loadCategories();
  }

  void _resetFilters() {
    _searchController.clear();
    setState(() {
      _searchQuery = '';
      _selectedActiveFilter = null;
      _currentPage = 1;
    });
    _loadCategories();
  }

  Future<void> _handleToggleActive(Category category) async {
    if (!_isAdmin) return;
    setState(() => _isMutating = true);
    try {
      await CategoryService.toggleActive(category.id);
      if (!mounted) return;
      _showSuccess('Berhasil', 'Status kategori berhasil diubah');
      _loadCategories(showLoading: false);
    } catch (e) {
      if (!mounted) return;
      _showError('Gagal', e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _isMutating = false);
    }
  }

  Future<void> _handleDelete(Category category) async {
    if (!_isAdmin) return;
    final confirmed = await _showConfirmation(
      'Hapus Kategori',
      'Hapus kategori "${category.name}" secara permanen?',
    );
    if (confirmed != true || !mounted) return;

    setState(() => _isMutating = true);
    try {
      await CategoryService.delete(category.id);
      if (!mounted) return;
      _showSuccess('Berhasil', 'Kategori berhasil dihapus');
      _loadCategories(showLoading: false);
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
        title: Row(
          children: [
            const Icon(Icons.warning_amber_rounded, color: Color(0xFFEF4444)),
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
            child: const Text('Ya', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Future<void> _openForm({Category? category}) async {
    final result = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => CategoryFormDialog(editingCategory: category),
    );
    if (result == true && mounted) {
      _loadCategories(showLoading: false);
    }
  }

  void _showSuccess(String title, String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF10B981),
        content: Row(children: [
          const Icon(Icons.check_circle_rounded, color: Colors.white),
          const SizedBox(width: 10),
          Expanded(
              child:
                  Text(message, style: const TextStyle(color: Colors.white))),
        ]),
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
        title: Row(children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.red.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.error_rounded, color: Colors.red, size: 20),
          ),
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
                      Text('Kategori Produk',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              letterSpacing: -0.3)),
                      SizedBox(height: 2),
                      Text('Kelola pengelompokan jenis produk',
                          style: TextStyle(
                              color: Color(0xFF94A3B8), fontSize: 12)),
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
                              color: const Color(0xFF334155)
                                  .withValues(alpha: 0.5)),
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
                                  'Cari berdasarkan nama atau deskripsi...',
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
                                  horizontal: 16, vertical: 14),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              _FilterDropdown<String?>(
                                label: 'Status',
                                value: _selectedActiveFilter,
                                items: const [
                                  DropdownMenuItem(
                                      value: '1', child: Text('Aktif')),
                                  DropdownMenuItem(
                                      value: '0', child: Text('Nonaktif')),
                                ],
                                onChanged: _onActiveFilterChanged,
                              ),
                              if (_hasActiveFilters)
                                TextButton.icon(
                                  onPressed: _resetFilters,
                                  icon:
                                      const Icon(Icons.close_rounded, size: 16),
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
                                'Menampilkan ${_categories.length} dari $_totalItems kategori',
                                style: const TextStyle(
                                    color: Color(0xFF64748B), fontSize: 11)),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
                if (_isLoading)
                  const SliverFillRemaining(
                    child: Center(
                      child: CircularProgressIndicator(
                          valueColor:
                              AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5))),
                    ),
                  )
                else if (_categories.isEmpty)
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
                              color: const Color(0xFFF59E0B)
                                  .withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(24),
                            ),
                            child: const Icon(Icons.category_rounded,
                                size: 64, color: Color(0xFFF59E0B)),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            _hasActiveFilters
                                ? 'Tidak Ada Kategori'
                                : 'Belum Ada Kategori',
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _hasActiveFilters
                                ? 'Tidak ada kategori yang cocok dengan filter Anda.'
                                : 'Klik tombol + untuk menambah kategori pertama.',
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                color: Color(0xFF94A3B8), fontSize: 13),
                          ),
                          if (!_hasActiveFilters && _isAdmin) ...[
                            const SizedBox(height: 24),
                            ElevatedButton.icon(
                              onPressed: () => _openForm(),
                              icon: const Icon(Icons.add_rounded),
                              label: const Text('Tambah Kategori Pertama'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF4F46E5),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 20, vertical: 12),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    sliver: SliverGrid(
                      // ✅ PERBAIKAN: Mengubah aspect ratio menjadi 0.65 agar kartu lebih tinggi dan tidak overflow
                      gridDelegate:
                          const SliverGridDelegateWithMaxCrossAxisExtent(
                        maxCrossAxisExtent: 320,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        childAspectRatio: 0.65,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final category = _categories[index];
                          return _CategoryCard(
                            category: category,
                            isAdmin: _isAdmin,
                            isMutating: _isMutating,
                            onToggleActive: () => _handleToggleActive(category),
                            onEdit: () => _openForm(category: category),
                            onDelete: () => _handleDelete(category),
                          );
                        },
                        childCount: _categories.length,
                      ),
                    ),
                  ),
                if (!_isLoading && _categories.isNotEmpty && _lastPage > 1)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: _Pagination(
                        currentPage: _currentPage,
                        lastPage: _lastPage,
                        onPageChanged: (page) {
                          setState(() => _currentPage = page);
                          _loadCategories();
                        },
                      ),
                    ),
                  ),
                const SliverToBoxAdapter(child: SizedBox(height: 100)),
              ],
            ),
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
      ),
    );
  }
}

class _FilterDropdown<T> extends StatelessWidget {
  final String label;
  final T value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?> onChanged;

  const _FilterDropdown(
      {required this.label,
      required this.value,
      required this.items,
      required this.onChanged});

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
          onChanged: onChanged,
        ),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final Category category;
  final bool isAdmin;
  final bool isMutating;
  final VoidCallback onToggleActive;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _CategoryCard({
    required this.category,
    required this.isAdmin,
    required this.isMutating,
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
          color: category.isActive
              ? const Color(0xFF334155).withValues(alpha: 0.5)
              : const Color(0xFFEF4444).withValues(alpha: 0.3),
        ),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 12,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        // ✅ PERBAIKAN: mainAxisSize.min dihapus agar tidak konflik dengan layout grid
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (isAdmin)
                  GestureDetector(
                    onTap: isMutating ? null : onToggleActive,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: category.isActive
                            ? const Color(0xFF10B981).withValues(alpha: 0.15)
                            : const Color(0xFFEF4444).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: category.isActive
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
                              color: category.isActive
                                  ? const Color(0xFF10B981)
                                  : const Color(0xFFEF4444),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            category.isActive ? 'Aktif' : 'Nonaktif',
                            style: TextStyle(
                              color: category.isActive
                                  ? const Color(0xFF10B981)
                                  : const Color(0xFFEF4444),
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: category.isActive
                          ? const Color(0xFF10B981).withValues(alpha: 0.15)
                          : const Color(0xFFEF4444).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: category.isActive
                                ? const Color(0xFF10B981)
                                : const Color(0xFFEF4444),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          category.isActive ? 'Aktif' : 'Nonaktif',
                          style: TextStyle(
                            color: category.isActive
                                ? const Color(0xFF10B981)
                                : const Color(0xFFEF4444),
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
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
                  category.name,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      height: 1.3),
                ),
                if (category.slug != null && category.slug!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A).withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                          color:
                              const Color(0xFF334155).withValues(alpha: 0.5)),
                    ),
                    child: Text(
                      category.slug!,
                      style: const TextStyle(
                          color: Color(0xFF94A3B8),
                          fontSize: 11,
                          fontFamily: 'monospace'),
                    ),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 12),
          Container(
              height: 1, color: const Color(0xFF334155).withValues(alpha: 0.5)),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.only(top: 2),
                      child: Icon(Icons.description_rounded,
                          color: Color(0xFF818CF8), size: 16),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        category.description ?? 'Tidak ada deskripsi',
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            color: Color(0xFFE2E8F0),
                            fontSize: 12,
                            height: 1.4),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                        color: const Color(0xFF334155).withValues(alpha: 0.4)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.inventory_2_rounded,
                              color: Color(0xFF818CF8), size: 16),
                          const SizedBox(width: 6),
                          const Text('Jenis Produk',
                              style: TextStyle(
                                  color: Color(0xFF94A3B8), fontSize: 11)),
                        ],
                      ),
                      Text(
                        '${category.productTypesCount}',
                        style: const TextStyle(
                            color: Color(0xFF818CF8),
                            fontSize: 16,
                            fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // ✅ PERBAIKAN: Mengganti Spacer() dengan SizedBox tetap agar tidak memaksa tinggi berlebih
          const SizedBox(height: 12),
          Container(
              height: 1, color: const Color(0xFF334155).withValues(alpha: 0.5)),
          if (isAdmin)
            Padding(
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  Expanded(
                    child: _ActionBtn(
                      icon: Icons.edit_rounded,
                      label: 'Edit',
                      color: const Color(0xFF3B82F6),
                      onTap: isMutating ? null : onEdit,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _ActionBtn(
                      icon: Icons.delete_rounded,
                      label: 'Hapus',
                      color: const Color(0xFFEF4444),
                      onTap: isMutating ? null : onDelete,
                    ),
                  ),
                ],
              ),
            )
          else
            const SizedBox(height: 8),
        ],
      ),
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
          padding: const EdgeInsets.symmetric(vertical: 6),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: color.withValues(alpha: 0.3)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 14),
              const SizedBox(width: 4),
              Text(label,
                  style: TextStyle(
                      color: color, fontSize: 10, fontWeight: FontWeight.w600)),
            ],
          ),
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
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          onPressed:
              currentPage > 1 ? () => onPageChanged(currentPage - 1) : null,
          icon: const Icon(Icons.chevron_left_rounded, color: Colors.white),
        ),
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
                          : const Color(0xFF334155).withValues(alpha: 0.5),
                    ),
                  ),
                  child: Center(
                    child: Text(
                      '$page',
                      style: TextStyle(
                        color:
                            isActive ? Colors.white : const Color(0xFF94A3B8),
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        }),
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
