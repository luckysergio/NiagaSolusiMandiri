class ProductType {
  final int id;
  final int? categoryId;
  final String? categoryName;
  final String name;
  final String? slug;
  final String? description;
  final String? imageUrl;
  final int sortOrder;
  final bool isActive;
  final int productsCount;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  ProductType({
    required this.id,
    this.categoryId,
    this.categoryName,
    required this.name,
    this.slug,
    this.description,
    this.imageUrl,
    required this.sortOrder,
    required this.isActive,
    this.productsCount = 0,
    this.createdAt,
    this.updatedAt,
  });

  factory ProductType.fromJson(Map<String, dynamic> json) {
    return ProductType(
      id: json['id'] ?? 0,
      categoryId: json['category_id'] is int
          ? json['category_id']
          : int.tryParse(json['category_id']?.toString() ?? ''),
      categoryName: json['category'] != null
          ? json['category']['name']
          : json['category_name'],
      name: json['name'] ?? '',
      slug: json['slug'],
      description: json['description'],
      imageUrl: json['image_url'] ?? json['image'],
      sortOrder: json['sort_order'] is int
          ? json['sort_order']
          : int.tryParse(json['sort_order']?.toString() ?? '0') ?? 0,
      isActive: json['is_active'] == true ||
          json['is_active'] == 1 ||
          json['is_active'] == '1',
      productsCount: json['products_count'] is int
          ? json['products_count']
          : int.tryParse(json['products_count']?.toString() ?? '0') ?? 0,
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
      'category_id': categoryId,
      'name': name,
      'slug': slug,
      'description': description,
      'sort_order': sortOrder,
      'is_active': isActive,
    };
  }
}
