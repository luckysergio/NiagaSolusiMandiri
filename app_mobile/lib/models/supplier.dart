class Supplier {
  final int id;
  final String name;
  final String? address;
  final String? phone;
  final bool isActive;
  final int transactionCount;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Supplier({
    required this.id,
    required this.name,
    this.address,
    this.phone,
    required this.isActive,
    this.transactionCount = 0,
    this.createdAt,
    this.updatedAt,
  });

  factory Supplier.fromJson(Map<String, dynamic> json) {
    return Supplier(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      address: json['address'],
      phone: json['phone'],
      isActive: json['is_active'] == true ||
          json['is_active'] == 1 ||
          json['is_active'] == '1',
      transactionCount: json['transaction_details_count'] is int
          ? json['transaction_details_count']
          : int.tryParse(
                  json['transaction_details_count']?.toString() ?? '0') ??
              0,
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
      'address': address,
      'phone': phone,
      'is_active': isActive,
    };
  }
}
