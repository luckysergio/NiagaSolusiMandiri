import 'package:flutter/material.dart';

class ModernBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const ModernBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final items = [
      _NavItem(
        icon: Icons.pending_actions_rounded,
        activeIcon: Icons.pending_actions_rounded,
        label: 'Aktif',
      ),
      _NavItem(
        icon: Icons.check_circle_outline_rounded,
        activeIcon: Icons.check_circle_rounded,
        label: 'Selesai',
      ),
      _NavItem(
        icon: Icons.home_rounded,
        activeIcon: Icons.home_rounded,
        label: 'Beranda',
        isCenter: true,
      ),
      _NavItem(
        icon: Icons.inventory_2_outlined,
        activeIcon: Icons.inventory_2_rounded,
        label: 'Produk',
      ),
      _NavItem(
        icon: Icons.person_outline_rounded,
        activeIcon: Icons.person_rounded,
        label: 'Profil',
      ),
    ];

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A).withValues(alpha: 0.95),
        border: Border(
          top: BorderSide(
            color: const Color(0xFF334155).withValues(alpha: 0.5),
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Stack(
          alignment: Alignment.bottomCenter,
          clipBehavior: Clip.none,
          children: [
            // Background Row dengan 4 item (skip index 2 yang floating)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  // Item 0: Transaksi Aktif
                  _buildNavButton(items[0], 0),
                  // Item 1: Transaksi Selesai
                  _buildNavButton(items[1], 1),
                  // Spacer untuk floating center button
                  const SizedBox(width: 70),
                  // Item 3: Product
                  _buildNavButton(items[3], 3),
                  // Item 4: Profile
                  _buildNavButton(items[4], 4),
                ],
              ),
            ),

            // Floating Center Button: Beranda
            Positioned(
              top: -28,
              child: _CenterNavButton(
                item: items[2],
                isSelected: currentIndex == 2,
                onTap: () => onTap(2),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavButton(_NavItem item, int index) {
    return Expanded(
      child: _NavButton(
        item: item,
        isSelected: currentIndex == index,
        onTap: () => onTap(index),
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isCenter;

  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    this.isCenter = false,
  });
}

// Button untuk item biasa (4 item samping)
class _NavButton extends StatelessWidget {
  final _NavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavButton({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutCubic,
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          gradient: isSelected
              ? const LinearGradient(
                  colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                )
              : null,
          color: isSelected ? null : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isSelected ? item.activeIcon : item.icon,
                key: ValueKey('$isSelected-${item.label}'),
                color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                size: 20,
              ),
            ),
            if (isSelected) ...[
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  item.label,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// Floating Center Button: Beranda
class _CenterNavButton extends StatelessWidget {
  final _NavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  const _CenterNavButton({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutBack,
        width: isSelected ? 68 : 60,
        height: isSelected ? 68 : 60,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
          ),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF4F46E5).withValues(alpha: 0.5),
              blurRadius: isSelected ? 24 : 16,
              offset: const Offset(0, 6),
              spreadRadius: isSelected ? 2 : 0,
            ),
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
          border: Border.all(
            color: Colors.white.withValues(alpha: isSelected ? 0.3 : 0.1),
            width: 2,
          ),
        ),
        child: Icon(
          item.icon,
          color: Colors.white,
          size: isSelected ? 32 : 28,
        ),
      ),
    );
  }
}
