class Category {
  final int id;
  final String name;
  final String? slug;
  final String? description;
  final int sortOrder;
  final bool isActive;
  final int productTypesCount;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Category({
    required this.id,
    required this.name,
    this.slug,
    this.description,
    required this.sortOrder,
    required this.isActive,
    this.productTypesCount = 0,
    this.createdAt,
    this.updatedAt,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'],
      description: json['description'],
      sortOrder: json['sort_order'] is int
          ? json['sort_order']
          : int.tryParse(json['sort_order']?.toString() ?? '0') ?? 0,
      isActive: json['is_active'] == true ||
          json['is_active'] == 1 ||
          json['is_active'] == '1',
      productTypesCount: json['product_types_count'] is int
          ? json['product_types_count']
          : int.tryParse(json['product_types_count']?.toString() ?? '0') ?? 0,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'description': description,
      'sort_order': sortOrder,
      'is_active': isActive,
    };
  }
}
