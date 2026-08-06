import 'package:flutter/material.dart';

import '../../models/category.dart';
import '../../services/category_service.dart';

class CategoryFormDialog extends StatefulWidget {
  final Category? editingCategory;

  const CategoryFormDialog({super.key, this.editingCategory});

  @override
  State<CategoryFormDialog> createState() => _CategoryFormDialogState();
}

class _CategoryFormDialogState extends State<CategoryFormDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _slugController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _sortOrderController = TextEditingController();

  bool _isActive = true;
  bool _isSubmitting = false;
  bool _isLoadingInit = true;

  bool get _isEditing => widget.editingCategory != null;

  @override
  void initState() {
    super.initState();
    _initializeForm();
  }

  Future<void> _initializeForm() async {
    if (_isEditing) {
      final c = widget.editingCategory!;
      _nameController.text = c.name;
      _slugController.text = c.slug ?? '';
      _descriptionController.text = c.description ?? '';
      _sortOrderController.text = c.sortOrder.toString();
      _isActive = c.isActive;
      if (mounted) setState(() => _isLoadingInit = false);
    } else {
      // Ambil sort order berikutnya untuk kategori baru
      final nextOrder = await CategoryService.getNextSortOrder();
      if (mounted) {
        _sortOrderController.text = nextOrder.toString();
        setState(() => _isLoadingInit = false);
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _slugController.dispose();
    _descriptionController.dispose();
    _sortOrderController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final payload = <String, dynamic>{
      'name': _nameController.text.trim(),
      'slug': _slugController.text.trim().isEmpty
          ? null
          : _slugController.text.trim(),
      'description': _descriptionController.text.trim().isEmpty
          ? null
          : _descriptionController.text.trim(),
      'sort_order': int.tryParse(_sortOrderController.text) ?? 0,
      'is_active': _isActive ? '1' : '0',
    };

    try {
      if (_isEditing) {
        await CategoryService.update(widget.editingCategory!.id, payload);
      } else {
        await CategoryService.create(payload);
      }
      if (!mounted) return;
      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;
      setState(() => _isSubmitting = false);
      _showError('Gagal', e.toString().replaceFirst('Exception: ', ''));
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
    if (_isLoadingInit) {
      return const AlertDialog(
        backgroundColor: Color(0xFF1E293B),
        content: Center(
          child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5))),
        ),
      );
    }

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(20),
          border:
              Border.all(color: const Color(0xFF334155).withValues(alpha: 0.5)),
        ),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.category_rounded,
                          color: Color(0xFFF59E0B), size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _isEditing
                                ? 'Edit Kategori'
                                : 'Tambah Kategori Baru',
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold),
                          ),
                          Text(
                            _isEditing
                                ? 'Perbarui detail kategori'
                                : 'Isi formulir untuk menambahkan kategori',
                            style: const TextStyle(
                                color: Color(0xFF94A3B8), fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded,
                          color: Color(0xFF94A3B8)),
                      onPressed:
                          _isSubmitting ? null : () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1, color: Color(0xFF334155)),
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildTextField(
                        controller: _nameController,
                        label: 'Nama Kategori *',
                        hint: 'Contoh: Pompa Beton',
                        icon: Icons.label_rounded,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Wajib diisi';
                          }
                          if (value.length > 100) {
                            return 'Maksimal 100 karakter';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _slugController,
                        label: 'Slug',
                        hint: 'pompa-beton',
                        icon: Icons.link_rounded,
                        helperText: 'Kosongkan untuk generate otomatis',
                        validator: (value) {
                          if (value != null &&
                              value.isNotEmpty &&
                              value.length > 120) {
                            return 'Maksimal 120 karakter';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _descriptionController,
                        label: 'Deskripsi',
                        hint: 'Deskripsi singkat tentang kategori ini',
                        icon: Icons.description_rounded,
                        maxLines: 3,
                        validator: (value) {
                          if (value != null &&
                              value.isNotEmpty &&
                              value.length > 500) {
                            return 'Maksimal 500 karakter';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildTextField(
                              controller: _sortOrderController,
                              label: 'Sort Order',
                              hint: '0',
                              icon: Icons.sort_rounded,
                              keyboardType: TextInputType.number,
                              validator: (value) {
                                final val = int.tryParse(value ?? '0') ?? 0;
                                if (val < 0) return 'Minimal 0';
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Status *',
                                    style: TextStyle(
                                        color: Color(0xFFCBD5E1),
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600)),
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 14),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF334155)
                                        .withValues(alpha: 0.5),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton<bool>(
                                      value: _isActive,
                                      isExpanded: true,
                                      dropdownColor: const Color(0xFF1E293B),
                                      icon: const Icon(
                                          Icons.arrow_drop_down_rounded,
                                          color: Color(0xFF94A3B8)),
                                      style: const TextStyle(
                                          color: Colors.white, fontSize: 14),
                                      items: const [
                                        DropdownMenuItem(
                                            value: true, child: Text('Aktif')),
                                        DropdownMenuItem(
                                            value: false,
                                            child: Text('Nonaktif')),
                                      ],
                                      onChanged: _isSubmitting
                                          ? null
                                          : (val) => setState(
                                              () => _isActive = val ?? true),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const Divider(height: 1, color: Color(0xFF334155)),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
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
                              ? 'Menyimpan...'
                              : (_isEditing ? 'Update' : 'Simpan'),
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
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    bool obscureText = false,
    TextInputType? keyboardType,
    int maxLines = 1,
    String? helperText,
    String? Function(String?)? validator,
  }) {
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
          obscureText: obscureText,
          enabled: !_isSubmitting,
          keyboardType: keyboardType,
          maxLines: maxLines,
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF64748B)),
            prefixIcon: Icon(icon, color: const Color(0xFF94A3B8), size: 20),
            filled: true,
            fillColor: const Color(0xFF334155).withValues(alpha: 0.5),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          ),
          validator: validator,
        ),
        if (helperText != null) ...[
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.info_outline_rounded,
                  color: Color(0xFF64748B), size: 12),
              const SizedBox(width: 4),
              Text(helperText,
                  style:
                      const TextStyle(color: Color(0xFF64748B), fontSize: 11)),
            ],
          ),
        ],
      ],
    );
  }
}
