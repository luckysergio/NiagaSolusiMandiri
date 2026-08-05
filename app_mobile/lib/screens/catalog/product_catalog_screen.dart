import 'package:flutter/material.dart';

class ProductCatalogScreen extends StatelessWidget {
  const ProductCatalogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = [
      {
        'name': 'Beton Cor',
        'icon': Icons.layers_rounded,
        'color': const Color(0xFF4F46E5)
      },
      {
        'name': 'Pompa Beton',
        'icon': Icons.build_rounded,
        'color': const Color(0xFF10B981)
      },
      {
        'name': 'Semen',
        'icon': Icons.foundation_rounded,
        'color': const Color(0xFFF59E0B)
      },
      {
        'name': 'Pasir',
        'icon': Icons.landscape_rounded,
        'color': const Color(0xFFEC4899)
      },
      {
        'name': 'Batu Split',
        'icon': Icons.diamond_rounded,
        'color': const Color(0xFF06B6D4)
      },
      {
        'name': 'Lainnya',
        'icon': Icons.more_horiz_rounded,
        'color': const Color(0xFF64748B)
      },
    ];

    final products = [
      {
        'name': 'Beton Cor K-225',
        'price': 'Rp 950.000/m³',
        'stock': 'Tersedia',
        'icon': Icons.layers_rounded,
      },
      {
        'name': 'Beton Cor K-300',
        'price': 'Rp 1.050.000/m³',
        'stock': 'Tersedia',
        'icon': Icons.layers_rounded,
      },
      {
        'name': 'Pompa Beton Standard',
        'price': 'Rp 3.500.000/hari',
        'stock': '2 unit',
        'icon': Icons.build_rounded,
      },
      {
        'name': 'Pompa Beton Long Boom',
        'price': 'Rp 5.000.000/hari',
        'stock': '1 unit',
        'icon': Icons.build_rounded,
      },
    ];

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
                  'Katalog Produk',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.3,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Jelajahi produk & layanan kami',
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
                    Icons.search_rounded,
                    color: Color(0xFFCBD5E1),
                    size: 20,
                  ),
                ),
                onPressed: () {},
              ),
              const SizedBox(width: 8),
            ],
          ),

          // Search Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B).withValues(alpha: 0.6),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: const Color(0xFF334155).withValues(alpha: 0.5),
                  ),
                ),
                child: const TextField(
                  style: TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Cari produk atau layanan...',
                    hintStyle: TextStyle(color: Color(0xFF64748B)),
                    icon: Icon(Icons.search_rounded, color: Color(0xFF94A3B8)),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),
          ),

          // Categories
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    'Kategori',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 110,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: categories.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 10),
                    itemBuilder: (context, index) {
                      final cat = categories[index];
                      return Container(
                        width: 85,
                        padding: const EdgeInsets.all(12),
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
                            color:
                                const Color(0xFF334155).withValues(alpha: 0.5),
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: (cat['color'] as Color)
                                    .withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                cat['icon'] as IconData,
                                color: cat['color'] as Color,
                                size: 22,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              cat['name'] as String,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Products Header
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(16, 24, 16, 12),
              child: Text(
                'Produk Populer',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),

          // Products List
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final product = products[index];
                return Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
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
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: const Color(0xFF334155).withValues(alpha: 0.5),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color:
                                const Color(0xFF4F46E5).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Icon(
                            product['icon'] as IconData,
                            color: const Color(0xFF4F46E5),
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product['name'] as String,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                product['price'] as String,
                                style: const TextStyle(
                                  color: Color(0xFF4F46E5),
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Stok: ${product['stock']}',
                                style: const TextStyle(
                                  color: Color(0xFF94A3B8),
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF4F46E5),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.arrow_forward_ios_rounded,
                            color: Colors.white,
                            size: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
              childCount: products.length,
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }
}
