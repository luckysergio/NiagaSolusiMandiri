class User {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final String? avatar;
  final String? role;
  final bool isActive;
  final bool isLocked;
  final DateTime? emailVerifiedAt;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final Map<String, dynamic> rawData;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.avatar,
    this.role,
    required this.isActive,
    required this.isLocked,
    this.emailVerifiedAt,
    this.createdAt,
    this.updatedAt,
    this.rawData = const {},
  });

  factory User.fromJson(Map<String, dynamic> json) {
    final String? extractedRole = _extractRole(json);

    return User(
      id: json['id'] ?? 0,
      name: json['name'] ?? json['full_name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? json['phone_number'],
      avatar: json['avatar'] ?? json['profile_photo_url'],
      role: extractedRole,
      isActive: json['is_active'] ?? json['active'] ?? true,
      isLocked: json['is_locked'] ?? json['locked'] ?? false,
      emailVerifiedAt: json['email_verified_at'] != null
          ? DateTime.tryParse(json['email_verified_at'])
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
      rawData: json,
    );
  }

  static String? _extractRole(Map<String, dynamic> json) {
    if (json['role'] != null) {
      if (json['role'] is String) {
        return json['role'];
      }
      if (json['role'] is Map) {
        return json['role']['name'] ?? json['role']['slug'];
      }
      if (json['role'] is List && (json['role'] as List).isNotEmpty) {
        final first = (json['role'] as List).first;
        if (first is String) {
          return first;
        }
        if (first is Map) {
          return first['name'] ?? first['slug'];
        }
      }
    }

    final alternativeFields = [
      'role_name',
      'user_type',
      'user_role',
      'type',
      'position',
      'designation',
    ];

    for (final field in alternativeFields) {
      if (json[field] != null) {
        if (json[field] is String) {
          return json[field];
        }
      }
    }

    if (json['roles'] != null && json['roles'] is List) {
      final roles = json['roles'] as List;
      if (roles.isNotEmpty) {
        final first = roles.first;
        if (first is String) {
          return first;
        }
        if (first is Map) {
          return first['name'] ?? first['slug'];
        }
      }
    }

    return null;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'avatar': avatar,
      'role': role,
      'is_active': isActive,
      'is_locked': isLocked,
    };
  }

  bool get isAdmin => role?.toLowerCase() == 'admin';
  bool get isSales => role?.toLowerCase() == 'sales';
}
