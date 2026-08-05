import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/user.dart';
import 'dio_client.dart';

class ProfileService {
  /// Get profile user yang sedang login (GET /user/me)
  static Future<User> getProfile() async {
    try {
      final response = await DioClient.dio.get(ApiConfig.profile);

      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return User.fromJson(data);
      } else {
        throw Exception('Gagal memuat profile');
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Update profile (PUT /user/profile)
  static Future<User> updateProfile(Map<String, dynamic> payload) async {
    try {
      final response = await DioClient.dio.put(
        ApiConfig.updateProfile, // ✅ Menggunakan endpoint khusus update
        data: payload,
      );

      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return User.fromJson(data);
      } else {
        throw Exception('Gagal memperbarui profile');
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Change password (POST /user/change-password)
  static Future<void> changePassword(Map<String, dynamic> payload) async {
    try {
      final response = await DioClient.dio.post(
        ApiConfig.changePassword,
        data: payload,
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Gagal mengubah password');
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Exception _handleError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.connectionError) {
      return Exception('Tidak dapat terhubung ke server');
    }

    if (e.response != null) {
      final errorData = e.response?.data;
      if (errorData is Map) {
        if (errorData.containsKey('message')) {
          return Exception(errorData['message']);
        }
        if (errorData.containsKey('errors') && errorData['errors'] is Map) {
          final errors = errorData['errors'] as Map;
          if (errors.isNotEmpty) {
            final firstError = errors.values.first;
            if (firstError is List && firstError.isNotEmpty) {
              return Exception(firstError.first);
            }
          }
        }
      }
    }

    return Exception(e.message ?? 'Terjadi kesalahan');
  }
}
