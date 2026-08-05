class Product {
  final int id;
  final String? code;
  final String name;
  final String? description;
  final num price;
  final String unit;
  final num minimumOrder;
  final int sortOrder;
  final bool featured;
  final bool isActive;
  final int? productTypeId;
  final ProductType? productType;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Product({
    required this.id,
    this.code,
    required this.name,
    this.description,
    required this.price,
    this.unit = 'unit',
    this.minimumOrder = 1,
    this.sortOrder = 0,
    this.featured = false,
    this.isActive = true,
    this.productTypeId,
    this.productType,
    this.createdAt,
    this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      code: json['code'],
      name: json['name'] ?? '',
      description: json['description'],
      price: (json['price'] is num)
          ? json['price']
          : num.tryParse(json['price']?.toString() ?? '0') ?? 0,
      unit: json['unit'] ?? 'unit',
      minimumOrder: (json['minimum_order'] is num)
          ? json['minimum_order']
          : num.tryParse(json['minimum_order']?.toString() ?? '1') ?? 1,
      sortOrder: json['sort_order'] is int
          ? json['sort_order']
          : int.tryParse(json['sort_order']?.toString() ?? '0') ?? 0,
      featured: json['featured'] == true ||
          json['featured'] == 1 ||
          json['featured'] == '1',
      isActive: json['is_active'] == true ||
          json['is_active'] == 1 ||
          json['is_active'] == '1',
      productTypeId: json['product_type_id'] is int
          ? json['product_type_id']
          : int.tryParse(json['product_type_id']?.toString() ?? ''),
      productType: json['product_type'] != null
          ? ProductType.fromJson(json['product_type'])
          : null,
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
      'code': code,
      'name': name,
      'description': description,
      'price': price,
      'unit': unit,
      'minimum_order': minimumOrder,
      'sort_order': sortOrder,
      'featured': featured,
      'is_active': isActive,
      'product_type_id': productTypeId,
    };
  }
}

class ProductType {
  final int id;
  final String name;
  final int? categoryId;
  final Category? category;

  ProductType({
    required this.id,
    required this.name,
    this.categoryId,
    this.category,
  });

  factory ProductType.fromJson(Map<String, dynamic> json) {
    return ProductType(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      categoryId: json['category_id'] is int
          ? json['category_id']
          : int.tryParse(json['category_id']?.toString() ?? ''),
      category:
          json['category'] != null ? Category.fromJson(json['category']) : null,
    );
  }
}

class Category {
  final int id;
  final String name;

  Category({required this.id, required this.name});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
    );
  }
}
