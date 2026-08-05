// lib/models/auth_response.dart
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
    return AuthResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      token: json['token'],
      user: json['user'] != null ? User.fromJson(json['user']) : null,
      errors: json['errors'] != null ? List<String>.from(json['errors']) : null,
    );
  }
}
