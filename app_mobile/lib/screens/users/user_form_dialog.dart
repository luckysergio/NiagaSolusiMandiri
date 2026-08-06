import 'package:flutter/material.dart';

import '../../models/user.dart';
import '../../services/user_service.dart';

class UserFormDialog extends StatefulWidget {
  final User? editingUser;

  const UserFormDialog({super.key, this.editingUser});

  @override
  State<UserFormDialog> createState() => _UserFormDialogState();
}

class _UserFormDialogState extends State<UserFormDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  int? _selectedRoleId;
  List<RoleDropdown> _roles = [];
  bool _isLoadingRoles = true;
  bool _isSubmitting = false;
  bool _obscurePassword = true;
  bool _obscureConfirm = true;

  bool get _isEditing => widget.editingUser != null;

  @override
  void initState() {
    super.initState();
    _loadRoles();
    if (_isEditing) {
      _nameController.text = widget.editingUser!.name;
      _emailController.text = widget.editingUser!.email;
      _selectedRoleId = widget.editingUser!.roleId;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _loadRoles() async {
    final allRoles = await UserService.getRolesDropdown();
    if (mounted) {
      // ✅ PERBAIKAN: Filter role "super admin" dari dropdown agar tidak bisa dipilih/ditambahkan
      final filteredRoles = allRoles.where((role) {
        final name = role.displayName.toLowerCase();
        return !name.contains('super admin') && name != 'super_admin';
      }).toList();

      setState(() {
        _roles = filteredRoles;
        _isLoadingRoles = false;
      });
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedRoleId == null) {
      _showError('Gagal', 'Role wajib dipilih');
      return;
    }

    setState(() => _isSubmitting = true);

    final payload = <String, dynamic>{
      'role_id': _selectedRoleId,
      'name': _nameController.text.trim(),
      'email': _emailController.text.trim(),
    };

    if (_passwordController.text.isNotEmpty) {
      payload['password'] = _passwordController.text;
      payload['password_confirmation'] = _confirmPasswordController.text;
    }

    try {
      if (_isEditing) {
        await UserService.updateUser(widget.editingUser!.id, payload);
      } else {
        await UserService.createUser(payload);
      }
      if (!mounted) return;
      Navigator.pop(context, true); // Return true to trigger refresh
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
                  borderRadius: BorderRadius.circular(10)),
              child:
                  const Icon(Icons.error_rounded, color: Colors.red, size: 20)),
          const SizedBox(width: 10),
          Text(title,
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.w600))
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
    if (_isLoadingRoles) {
      return const AlertDialog(
          backgroundColor: Color(0xFF1E293B),
          content: Center(
              child: CircularProgressIndicator(
                  valueColor:
                      AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)))));
    }

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500),
        decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
                color: const Color(0xFF334155).withValues(alpha: 0.5))),
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
                            color:
                                const Color(0xFF4F46E5).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10)),
                        child: const Icon(Icons.person_add_rounded,
                            color: Color(0xFF4F46E5), size: 24)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(_isEditing ? 'Edit User' : 'Tambah User Baru',
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold)),
                          Text(
                              _isEditing
                                  ? 'Perbarui detail user'
                                  : 'Isi formulir untuk menambahkan user',
                              style: const TextStyle(
                                  color: Color(0xFF94A3B8), fontSize: 12)),
                        ],
                      ),
                    ),
                    IconButton(
                        icon: const Icon(Icons.close_rounded,
                            color: Color(0xFF94A3B8)),
                        onPressed: _isSubmitting
                            ? null
                            : () => Navigator.pop(context)),
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
                      _buildDropdown(),
                      const SizedBox(height: 16),
                      _buildTextField(
                          controller: _nameController,
                          label: 'Nama Lengkap *',
                          hint: 'Masukkan nama lengkap'),
                      const SizedBox(height: 16),
                      _buildTextField(
                          controller: _emailController,
                          label: 'Email *',
                          hint: 'email@domain.com',
                          keyboardType: TextInputType.emailAddress),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _passwordController,
                        label:
                            'Password ${_isEditing ? '(Kosongkan jika tidak diubah)' : '*'}',
                        hint: _isEditing
                            ? 'Kosongkan jika tidak diubah'
                            : 'Minimal 6 karakter',
                        obscureText: _obscurePassword,
                        onToggleObscure: () => setState(
                            () => _obscurePassword = !_obscurePassword),
                        isRequired: !_isEditing,
                      ),
                      const SizedBox(height: 16),
                      _buildTextField(
                        controller: _confirmPasswordController,
                        label:
                            'Konfirmasi Password ${_isEditing ? '(Kosongkan jika tidak diubah)' : '*'}',
                        hint: _isEditing
                            ? 'Kosongkan jika tidak diubah'
                            : 'Konfirmasi password',
                        obscureText: _obscureConfirm,
                        onToggleObscure: () =>
                            setState(() => _obscureConfirm = !_obscureConfirm),
                        isRequired: !_isEditing,
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
                            onPressed: _isSubmitting
                                ? null
                                : () => Navigator.pop(context),
                            style: OutlinedButton.styleFrom(
                                foregroundColor: const Color(0xFF94A3B8),
                                side:
                                    const BorderSide(color: Color(0xFF334155)),
                                padding:
                                    const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12))),
                            child: const Text('Batal'))),
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
                                    strokeWidth: 2, color: Colors.white))
                            : const Icon(Icons.save_rounded, size: 18),
                        label: Text(
                            _isSubmitting
                                ? 'Menyimpan...'
                                : (_isEditing ? 'Update' : 'Simpan'),
                            style:
                                const TextStyle(fontWeight: FontWeight.w600)),
                        style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF4F46E5),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12))),
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

  Widget _buildDropdown() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Role *',
            style: TextStyle(
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
            child: DropdownButton<int>(
              value: _selectedRoleId,
              isExpanded: true,
              hint: const Text('Pilih Role',
                  style: TextStyle(color: Color(0xFF64748B))),
              dropdownColor: const Color(0xFF1E293B),
              icon: const Icon(Icons.arrow_drop_down_rounded,
                  color: Color(0xFF94A3B8)),
              style: const TextStyle(color: Colors.white, fontSize: 14),
              items: _roles
                  .map((r) =>
                      DropdownMenuItem(value: r.id, child: Text(r.displayName)))
                  .toList(),
              onChanged: _isSubmitting
                  ? null
                  : (val) => setState(() => _selectedRoleId = val),
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
    bool obscureText = false,
    VoidCallback? onToggleObscure,
    TextInputType? keyboardType,
    bool isRequired = true,
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
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF64748B)),
            suffixIcon: onToggleObscure != null
                ? IconButton(
                    icon: Icon(
                        obscureText
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        color: const Color(0xFF94A3B8),
                        size: 20),
                    onPressed: onToggleObscure)
                : null,
            filled: true,
            fillColor: const Color(0xFF334155).withValues(alpha: 0.5),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          ),
          validator: (value) {
            if (isRequired && (value == null || value.trim().isEmpty)) {
              return 'Wajib diisi';
            }
            if (label.contains('Email') &&
                value != null &&
                !RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
              return 'Format email tidak valid';
            }
            if (label.contains('Password') &&
                value != null &&
                value.isNotEmpty &&
                value.length < 6) {
              return 'Minimal 6 karakter';
            }
            if (label.contains('Konfirmasi') &&
                value != _passwordController.text) {
              return 'Password tidak cocok';
            }
            return null;
          },
        ),
      ],
    );
  }
}
