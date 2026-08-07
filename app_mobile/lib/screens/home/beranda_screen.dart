import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';

class BerandaScreen extends StatelessWidget {
  const BerandaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final bool isAdmin = user?.isAdmin ?? false;

    // Daftar menu dinamis berdasarkan role
    final List<Widget> menuItems = [
      // ✅ Menu umum untuk semua user
      _MenuItem(
        icon: Icons.add_shopping_cart_rounded,
        label: 'Order Baru',
        color: const Color(0xFF4F46E5),
        onTap: () => context.push('/transactions/create'),
      ),

      // ✅ MENU KHUSUS ADMIN
      if (isAdmin) ...[
        _MenuItem(
          icon: Icons.bar_chart_rounded,
          label: 'Laporan',
          color: const Color(0xFFF59E0B),
          onTap: () => context.push('/reports'), // Route akan dibuat nanti
        ),
        _MenuItem(
          icon: Icons.admin_panel_settings_rounded,
          label: 'Manajemen User',
          color: const Color(0xFF8B5CF6),
          onTap: () => context.push('/users'),
        ),
        _MenuItem(
          icon: Icons.store_rounded,
          label: 'Manajemen Supplier',
          color: const Color(0xFF10B981),
          onTap: () => context.push('/suppliers'),
        ),
        _MenuItem(
          icon: Icons.category_rounded,
          label: 'Kategori Produk',
          color: const Color(0xFFF59E0B),
          onTap: () => context.push('/product-categories'),
        ),
        _MenuItem(
          icon: Icons.label_rounded,
          label: 'Jenis Produk',
          color: const Color(0xFF06B6D4),
          onTap: () => context.push('/product-types'),
        ),
      ],
    ];

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // App Bar dengan greeting
          SliverAppBar(
            floating: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Halo, ${user?.name ?? 'User'} 👋',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Selamat datang di NSM System',
                  style: TextStyle(
                    color: const Color(0xFF94A3B8).withValues(alpha: 0.9),
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
                    Icons.notifications_outlined,
                    color: Color(0xFFCBD5E1),
                    size: 20,
                  ),
                ),
                onPressed: () {},
              ),
              const SizedBox(width: 8),
            ],
          ),

          // Menu Grid
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 3,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 0.9,
                    children: menuItems,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  const _MenuItem({
    required this.icon,
    required this.label,
    required this.color,
    this.onTap,
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
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(height: 8),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
