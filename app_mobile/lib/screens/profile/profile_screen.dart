import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../models/user.dart';
import '../../providers/auth_provider.dart';
import '../../services/profile_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _profileFormKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _isLoadingProfile = true;
  bool _isSavingProfile = false;
  bool _isRefreshing = false;
  bool _isLoggingOut = false;

  User? _profileData;

  bool _obscureProfilePassword = true;
  bool _obscureProfileConfirm = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoadingProfile = true);

    try {
      final profile = await ProfileService.getProfile();
      if (!mounted) return;
      setState(() {
        _profileData = profile;
        _nameController.text = profile.name;
        _emailController.text = profile.email;
        _isLoadingProfile = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoadingProfile = false);
      if (!mounted) return;
      _showError(
        'Gagal Memuat Profile',
        e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> _refreshProfile() async {
    setState(() => _isRefreshing = true);
    await _loadProfile();
    if (!mounted) return;
    setState(() => _isRefreshing = false);
  }

  String? _validateName(String? value) {
    if (value != null && value.isNotEmpty && value.length > 150) {
      return 'Nama maksimal 150 karakter';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    if (value != null && value.isNotEmpty) {
      final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
      if (!emailRegex.hasMatch(value)) {
        return 'Format email tidak valid';
      }
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value != null && value.isNotEmpty && value.length < 6) {
      return 'Password minimal 6 karakter';
    }
    return null;
  }

  String? _validateConfirmPassword(String? value) {
    if (value != null &&
        value.isNotEmpty &&
        value != _newPasswordController.text) {
      return 'Konfirmasi password tidak cocok';
    }
    return null;
  }

  Future<void> _handleUpdateProfile() async {
    if (!_profileFormKey.currentState!.validate()) return;

    final payload = <String, dynamic>{};

    if (_nameController.text.trim() != _profileData?.name) {
      payload['name'] = _nameController.text.trim();
    }
    if (_emailController.text.trim() != _profileData?.email) {
      payload['email'] = _emailController.text.trim();
    }
    if (_newPasswordController.text.isNotEmpty) {
      payload['password'] = _newPasswordController.text;
      payload['password_confirmation'] = _confirmPasswordController.text;
    }

    if (payload.isEmpty) {
      _showError('Gagal', 'Tidak ada perubahan yang disimpan');
      return;
    }

    setState(() => _isSavingProfile = true);

    try {
      final updatedUser = await ProfileService.updateProfile(payload);
      if (!mounted) return;

      context.read<AuthProvider>().updateUser(updatedUser);

      setState(() {
        _profileData = updatedUser;
        _nameController.text = updatedUser.name;
        _emailController.text = updatedUser.email;
        _newPasswordController.clear();
        _confirmPasswordController.clear();
        _isSavingProfile = false;
      });

      if (!mounted) return;
      _showSuccess('Berhasil', 'Profile berhasil diperbarui');
    } catch (e) {
      if (!mounted) return;
      setState(() => _isSavingProfile = false);
      if (!mounted) return;
      _showError('Gagal', e.toString().replaceFirst('Exception: ', ''));
    }
  }

  Future<void> _handleLogout() async {
    final confirmed = await _showLogoutConfirmation();
    if (!mounted) return;
    if (confirmed != true) return;

    setState(() => _isLoggingOut = true);

    try {
      if (!mounted) return;
      final authProvider = context.read<AuthProvider>();
      await authProvider.logout();

      if (!mounted) return;
      context.go('/login');
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoggingOut = false);
      if (!mounted) return;
      _showError('Gagal', 'Tidak dapat logout. Silakan coba lagi.');
    }
  }

  void _resetProfileForm() {
    _nameController.text = _profileData?.name ?? '';
    _emailController.text = _profileData?.email ?? '';
    _newPasswordController.clear();
    _confirmPasswordController.clear();
    _profileFormKey.currentState?.reset();
  }

  Future<bool?> _showLogoutConfirmation() {
    return showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(
              Icons.logout_rounded,
              color: Color(0xFFEF4444),
              size: 24,
            ),
            SizedBox(width: 10),
            Text(
              'Konfirmasi Logout',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        content: const Text(
          'Apakah Anda yakin ingin keluar dari aplikasi?\n\nAnda harus login kembali untuk mengakses akun Anda.',
          style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 14, height: 1.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: const Text(
              'Batal',
              style: TextStyle(
                  color: Color(0xFF94A3B8), fontWeight: FontWeight.w500),
            ),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: TextButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: const Text(
              'Ya, Logout',
              style:
                  TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  void _showSuccess(String title, String message) {
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.check_circle_rounded,
                color: Color(0xFF10B981),
                size: 20,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        content: Text(
          message,
          style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            style: TextButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: const Text(
              'OK',
              style:
                  TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  void _showError(String title, String message) {
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
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
              child: const Icon(
                Icons.error_rounded,
                color: Colors.red,
                size: 20,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        content: Text(
          message,
          style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            style: TextButton.styleFrom(
              backgroundColor: Colors.red,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: const Text(
              'OK',
              style:
                  TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoadingProfile) {
      return const Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 50,
                height: 50,
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)),
                  strokeWidth: 3,
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Memuat profile...',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            floating: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            title: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Pengaturan Akun',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.3,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Kelola informasi akun Anda',
                  style: TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            actions: [
              IconButton(
                onPressed: _isRefreshing ? null : _refreshProfile,
                icon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B).withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF334155).withValues(alpha: 0.5),
                    ),
                  ),
                  child: AnimatedRotation(
                    turns: _isRefreshing ? 1 : 0,
                    duration: const Duration(milliseconds: 800),
                    child: const Icon(
                      Icons.refresh_rounded,
                      color: Color(0xFFCBD5E1),
                      size: 20,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
            ],
          ),

          // Form Profile
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                padding: const EdgeInsets.all(20),
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
                    color: const Color(0xFF334155).withValues(alpha: 0.5),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: _buildProfileForm(),
              ),
            ),
          ),

          // Logout Button
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Container(
                padding: const EdgeInsets.all(20),
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
                    color: const Color(0xFFEF4444).withValues(alpha: 0.2),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(
                          Icons.info_outline_rounded,
                          color: Color(0xFFEF4444),
                          size: 18,
                        ),
                        SizedBox(width: 10),
                        Text(
                          'Sesi Aktif',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Anda saat ini sedang login. Klik tombol di bawah untuk mengakhiri sesi dan keluar dari aplikasi.',
                      style: TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 12,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: _isLoggingOut ? null : _handleLogout,
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            decoration: BoxDecoration(
                              gradient: _isLoggingOut
                                  ? null
                                  : const LinearGradient(
                                      colors: [
                                        Color(0xFFEF4444),
                                        Color(0xFFDC2626),
                                      ],
                                    ),
                              color: _isLoggingOut
                                  ? const Color(0xFF475569)
                                  : null,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: _isLoggingOut
                                  ? null
                                  : [
                                      BoxShadow(
                                        color: const Color(0xFFEF4444)
                                            .withValues(alpha: 0.3),
                                        blurRadius: 12,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (_isLoggingOut)
                                  const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        Colors.white,
                                      ),
                                      strokeWidth: 2,
                                    ),
                                  )
                                else
                                  const Icon(
                                    Icons.logout_rounded,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                const SizedBox(width: 10),
                                Text(
                                  _isLoggingOut
                                      ? 'Sedang Logout...'
                                      : 'Keluar dari Aplikasi',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: 0.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }

  Widget _buildProfileForm() {
    return Form(
      key: _profileFormKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.person_rounded, color: Color(0xFF4F46E5), size: 20),
              SizedBox(width: 10),
              Text(
                'Informasi Profile',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildTextField(
            controller: _nameController,
            label: 'Nama',
            hint: 'Nama lengkap',
            icon: Icons.person_outline_rounded,
            validator: _validateName,
            enabled: !_isSavingProfile,
          ),
          const SizedBox(height: 16),
          _buildTextField(
            controller: _emailController,
            label: 'Email',
            hint: 'email@domain.com',
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
            validator: _validateEmail,
            enabled: !_isSavingProfile,
          ),
          const SizedBox(height: 24),
          Container(
            height: 1,
            color: const Color(0xFF334155).withValues(alpha: 0.5),
          ),
          const SizedBox(height: 24),
          const Row(
            children: [
              Icon(Icons.lock_rounded, color: Color(0xFF4F46E5), size: 20),
              SizedBox(width: 10),
              Text(
                'Ubah Password',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF4F46E5).withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFF4F46E5).withValues(alpha: 0.2),
              ),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline_rounded,
                    color: Color(0xFF818CF8), size: 18),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Ubah password bersifat opsional. Kosongkan jika tidak ingin mengubah.',
                    style: TextStyle(
                      color: Color(0xFFA5B4FC),
                      fontSize: 12,
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          _buildTextField(
            controller: _newPasswordController,
            label: 'Password Baru',
            hint: 'Minimal 6 karakter',
            icon: Icons.lock_outline_rounded,
            obscureText: _obscureProfilePassword,
            onToggleObscure: () {
              setState(
                  () => _obscureProfilePassword = !_obscureProfilePassword);
            },
            validator: _validatePassword,
            enabled: !_isSavingProfile,
          ),
          const SizedBox(height: 16),
          _buildTextField(
            controller: _confirmPasswordController,
            label: 'Konfirmasi Password',
            hint: 'Konfirmasi password',
            icon: Icons.lock_outline_rounded,
            obscureText: _obscureProfileConfirm,
            onToggleObscure: () {
              setState(() => _obscureProfileConfirm = !_obscureProfileConfirm);
            },
            validator: _validateConfirmPassword,
            enabled: !_isSavingProfile,
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: _ActionButton(
                  label: 'Reset',
                  icon: Icons.refresh_rounded,
                  color: const Color(0xFF64748B),
                  onPressed: _isSavingProfile ? null : _resetProfileForm,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: _ActionButton(
                  label: _isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan',
                  icon: Icons.save_rounded,
                  color: const Color(0xFF4F46E5),
                  isLoading: _isSavingProfile,
                  onPressed: _isSavingProfile ? null : _handleUpdateProfile,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    bool obscureText = false,
    VoidCallback? onToggleObscure,
    String? Function(String?)? validator,
    bool enabled = true,
    TextInputType? keyboardType,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Color(0xFFCBD5E1),
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          enabled: enabled,
          keyboardType: keyboardType,
          validator: validator,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(
              color: Color(0xFF64748B),
              fontWeight: FontWeight.w400,
            ),
            prefixIcon: Icon(icon, color: const Color(0xFF94A3B8), size: 20),
            suffixIcon: onToggleObscure != null
                ? IconButton(
                    icon: Icon(
                      obscureText
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: const Color(0xFF94A3B8),
                      size: 20,
                    ),
                    onPressed: onToggleObscure,
                  )
                : null,
            filled: true,
            fillColor: const Color(0xFF334155).withValues(alpha: 0.5),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF475569)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF475569)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF4F46E5), width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.red, width: 1.5),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.red, width: 2),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF334155)),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 14,
            ),
          ),
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback? onPressed;
  final bool isLoading;

  const _ActionButton({
    required this.label,
    required this.icon,
    required this.color,
    this.onPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = onPressed == null;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: isDisabled ? null : onPressed,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            gradient: isDisabled
                ? null
                : LinearGradient(
                    colors: [color, color.withValues(alpha: 0.8)],
                  ),
            color: isDisabled ? const Color(0xFF475569) : null,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isDisabled
                ? null
                : [
                    BoxShadow(
                      color: color.withValues(alpha: 0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (isLoading)
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    strokeWidth: 2,
                  ),
                )
              else
                Icon(icon, color: Colors.white, size: 18),
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
