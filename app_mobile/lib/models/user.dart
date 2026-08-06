class User {
  final int id;
  final String name;
  final String email;
  final String? phone;
  final String? avatar;
  final String? role; // e.g., 'admin', 'sales'
  final int? roleId; // ID role untuk dropdown saat edit
  final String?
      roleName; // Nama role yang human-readable (e.g., 'Administrator')
  final bool isActive;
  final bool isLocked;
  final DateTime? emailVerifiedAt;
  final DateTime? lastLoginAt; // Waktu login terakhir
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
    this.roleId,
    this.roleName,
    required this.isActive,
    required this.isLocked,
    this.emailVerifiedAt,
    this.lastLoginAt,
    this.createdAt,
    this.updatedAt,
    this.rawData = const {},
  });

  factory User.fromJson(Map<String, dynamic> json) {
    final String? extractedRole = _extractRole(json);

    // Parsing roleId dan roleName secara aman
    int? parsedRoleId;
    String? parsedRoleName;

    if (json['role'] is Map) {
      parsedRoleId = json['role']['id'] is int
          ? json['role']['id']
          : int.tryParse(json['role']['id']?.toString() ?? '');
      parsedRoleName = json['role']['display_name'] ?? json['role']['name'];
    } else if (json['role_id'] != null) {
      parsedRoleId = json['role_id'] is int
          ? json['role_id']
          : int.tryParse(json['role_id'].toString());
      parsedRoleName = json['role_name'] ?? extractedRole;
    } else {
      parsedRoleName = extractedRole;
    }

    return User(
      id: json['id'] ?? 0,
      name: json['name'] ?? json['full_name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? json['phone_number'],
      avatar: json['avatar'] ?? json['profile_photo_url'],
      role: extractedRole,
      roleId: parsedRoleId,
      roleName: parsedRoleName,
      // Parsing boolean yang lebih aman (menangani kasus Laravel yang mengembalikan 1, "1", atau true)
      isActive: json['is_active'] == true ||
          json['is_active'] == 1 ||
          json['is_active'] == '1',
      isLocked: json['is_locked'] == true ||
          json['is_locked'] == 1 ||
          json['is_locked'] == '1',
      emailVerifiedAt: json['email_verified_at'] != null
          ? DateTime.tryParse(json['email_verified_at'])
          : null,
      lastLoginAt: json['last_login_at'] != null
          ? DateTime.tryParse(json['last_login_at'])
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
      'role_id': roleId,
      'is_active': isActive,
      'is_locked': isLocked,
    };
  }

  // Helper getters
  bool get isAdmin =>
      role?.toLowerCase() == 'admin' || role?.toLowerCase() == 'super_admin';
  bool get isSales => role?.toLowerCase() == 'sales';
}

// Model tambahan untuk Dropdown Role
class RoleDropdown {
  final int id;
  final String displayName;

  RoleDropdown({
    required this.id,
    required this.displayName,
  });

  factory RoleDropdown.fromJson(Map<String, dynamic> json) {
    return RoleDropdown(
      id: json['id'] ?? 0,
      displayName: json['display_name'] ?? json['name'] ?? '',
    );
  }
}
