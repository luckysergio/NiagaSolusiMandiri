import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../models/product_type.dart';
import '../../models/category.dart';
import '../../services/product_type_service.dart';

class ProductTypeFormDialog extends StatefulWidget {
  final ProductType? editingProductType;
  final List<Category> categories;

  const ProductTypeFormDialog(
      {super.key, this.editingProductType, required this.categories});

  @override
  State<ProductTypeFormDialog> createState() => _ProductTypeFormDialogState();
}

class _ProductTypeFormDialogState extends State<ProductTypeFormDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _slugController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _sortOrderController = TextEditingController();

  int? _selectedCategoryId;
  bool _isActive = true;
  bool _isSubmitting = false;
  bool _isLoadingInit = true;

  File? _imageFile;
  String? _imagePreviewPath; // Bisa berupa path file atau URL existing

  bool get _isEditing => widget.editingProductType != null;

  @override
  void initState() {
    super.initState();
    _initializeForm();
  }

  Future<void> _initializeForm() async {
    if (_isEditing) {
      final pt = widget.editingProductType!;
      _selectedCategoryId = pt.categoryId;
      _nameController.text = pt.name;
      _slugController.text = pt.slug ?? '';
      _descriptionController.text = pt.description ?? '';
      _sortOrderController.text = pt.sortOrder.toString();
      _isActive = pt.isActive;
      _imagePreviewPath = pt.imageUrl;
      if (mounted) setState(() => _isLoadingInit = false);
    } else {
      // Ambil sort order berikutnya berdasarkan kategori yang dipilih (jika ada)
      final nextOrder =
          await ProductTypeService.getNextSortOrder(_selectedCategoryId);
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

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile =
        await picker.pickImage(source: ImageSource.gallery, imageQuality: 80);

    if (pickedFile != null) {
      final file = File(pickedFile.path);
      final fileSize = await file.length();

      if (fileSize > 2 * 1024 * 1024) {
        _showError('Gagal', 'Ukuran gambar maksimal 2MB');
        return;
      }

      setState(() {
        _imageFile = file;
        _imagePreviewPath = file.path;
      });
    }
  }

  void _removeImage() {
    setState(() {
      _imageFile = null;
      _imagePreviewPath = null;
    });
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategoryId == null) {
      _showError('Gagal', 'Kategori wajib dipilih');
      return;
    }

    setState(() => _isSubmitting = true);

    final payload = <String, dynamic>{
      'category_id': _selectedCategoryId,
      'name': _nameController.text.trim(),
      'slug': _slugController.text.trim().isEmpty
          ? null
          : _slugController.text.trim(),
      'description': _descriptionController.text.trim().isEmpty
          ? null
          : _descriptionController.text.trim(),
      'sort_order': int.tryParse(_sortOrderController.text) ?? 0,
      'is_active': _isActive,
    };

    try {
      if (_isEditing) {
        await ProductTypeService.update(
            widget.editingProductType!.id, payload, _imageFile);
      } else {
        await ProductTypeService.create(payload, _imageFile);
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
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF06B6D4))),
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
                        color: const Color(0xFF06B6D4).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.layers_rounded,
                          color: Color(0xFF06B6D4), size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _isEditing
                                ? 'Edit Jenis Produk'
                                : 'Tambah Jenis Produk Baru',
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold),
                          ),
                          Text(
                            _isEditing
                                ? 'Perbarui detail jenis produk'
                                : 'Isi formulir untuk menambahkan jenis produk',
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
                      _buildDropdown(
                        label: 'Kategori *',
                        value: _selectedCategoryId,
                        items: widget.categories
                            .map((c) => DropdownMenuItem(
                                value: c.id, child: Text(c.name)))
                            .toList(),
                        onChanged: (val) async {
                          setState(() => _selectedCategoryId = val);
                          if (!_isEditing && val != null) {
                            final nextOrder =
                                await ProductTypeService.getNextSortOrder(val);
                            if (mounted) {
                              _sortOrderController.text = nextOrder.toString();
                            }
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _nameController,
                        label: 'Nama Jenis Produk *',
                        hint: 'Contoh: Standar, Mini, Longboom',
                        icon: Icons.label_rounded,
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Wajib diisi';
                          }
                          if (value.length > 120) {
                            return 'Maksimal 120 karakter';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _slugController,
                        label: 'Slug',
                        hint: 'standar (kosongkan untuk auto-generate)',
                        icon: Icons.link_rounded,
                        helperText:
                            'Kosongkan untuk generate otomatis dari nama',
                        validator: (value) {
                          if (value != null &&
                              value.isNotEmpty &&
                              value.length > 150) {
                            return 'Maksimal 150 karakter';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _descriptionController,
                        label: 'Deskripsi',
                        hint: 'Deskripsi singkat tentang jenis produk ini',
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
                      const Text('Gambar',
                          style: TextStyle(
                              color: Color(0xFFCBD5E1),
                              fontSize: 13,
                              fontWeight: FontWeight.w600)),
                      const SizedBox(height: 6),
                      if (_imagePreviewPath != null)
                        Stack(
                          children: [
                            Container(
                              height: 160,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                    color: const Color(0xFF334155)
                                        .withValues(alpha: 0.5)),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: _imagePreviewPath!.startsWith('http')
                                    ? Image.network(_imagePreviewPath!,
                                        fit: BoxFit.cover,
                                        width: double.infinity)
                                    : Image.file(File(_imagePreviewPath!),
                                        fit: BoxFit.cover,
                                        width: double.infinity),
                              ),
                            ),
                            Positioned(
                              top: 8,
                              right: 8,
                              child: InkWell(
                                onTap: _isSubmitting ? null : _removeImage,
                                child: Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: const BoxDecoration(
                                      color: Colors.red,
                                      shape: BoxShape.circle),
                                  child: const Icon(Icons.close_rounded,
                                      color: Colors.white, size: 18),
                                ),
                              ),
                            ),
                          ],
                        )
                      else
                        InkWell(
                          onTap: _isSubmitting ? null : _pickImage,
                          child: Container(
                            height: 160,
                            decoration: BoxDecoration(
                              color: const Color(0xFF334155)
                                  .withValues(alpha: 0.3),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                  color: const Color(0xFF475569),
                                  style: BorderStyle.solid),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.cloud_upload_rounded,
                                    color: Color(0xFF94A3B8), size: 32),
                                const SizedBox(height: 8),
                                const Text('Klik untuk upload gambar',
                                    style: TextStyle(
                                        color: Color(0xFFCBD5E1),
                                        fontSize: 13)),
                                const SizedBox(height: 4),
                                const Text('JPG, PNG, WebP (Max. 2MB)',
                                    style: TextStyle(
                                        color: Color(0xFF64748B),
                                        fontSize: 11)),
                              ],
                            ),
                          ),
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
                          backgroundColor: const Color(0xFF06B6D4),
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

  Widget _buildDropdown({
    required String label,
    required int? value,
    required List<DropdownMenuItem<int>> items,
    required ValueChanged<int?> onChanged,
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
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: const Color(0xFF334155).withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(12),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<int>(
              value: value,
              isExpanded: true,
              hint: const Text('Pilih Kategori',
                  style: TextStyle(color: Color(0xFF64748B))),
              dropdownColor: const Color(0xFF1E293B),
              icon: const Icon(Icons.arrow_drop_down_rounded,
                  color: Color(0xFF94A3B8)),
              style: const TextStyle(color: Colors.white, fontSize: 14),
              items: items,
              onChanged: _isSubmitting ? null : onChanged,
            ),
          ),
        ),
      ],
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
