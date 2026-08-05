import 'user.dart';

class AuthResponse {
  final bool success;
  final String message;
  final String? token;
  final User? user;
  final List<String>? errors;

  AuthResponse({
    required this.success,
    required this.message,
    this.token,
    this.user,
    this.errors,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    final Map<String, dynamic> data = json['data'] ?? json;

    return AuthResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      token: data['access_token'] ?? data['token'],
      user: data['user'] != null ? User.fromJson(data['user']) : null,
      errors: json['errors'] != null ? List<String>.from(json['errors']) : null,
    );
  }
}
