import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/user.dart';
import 'dio_client.dart';

class UserService {
  static Future<Map<String, dynamic>> getUsers({
    int page = 1,
    int perPage = 12,
    String? search,
    int? roleId,
    String? isActive,
  }) async {
    try {
      final params = <String, dynamic>{'page': page, 'per_page': perPage};
      if (search != null && search.isNotEmpty) params['search'] = search;
      if (roleId != null) params['role_id'] = roleId;
      if (isActive != null && isActive.isNotEmpty) {
        params['is_active'] = isActive;
      }

      final response =
          await DioClient.dio.get(ApiConfig.users, queryParameters: params);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        final meta = response.data['meta'];
        final List<dynamic> rawData =
            data is List ? data : (data['data'] ?? []);
        return {
          'users': rawData.map((e) => User.fromJson(e)).toList(),
          'meta': meta,
        };
      }
      throw Exception('Gagal memuat data user');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<List<RoleDropdown>> getRolesDropdown() async {
    try {
      final response = await DioClient.dio.get(ApiConfig.rolesDropdown);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        final List<dynamic> rawData = data is List ? data : [];
        return rawData.map((e) => RoleDropdown.fromJson(e)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  static Future<User> createUser(Map<String, dynamic> payload) async {
    try {
      final response = await DioClient.dio.post(ApiConfig.users, data: payload);
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data['data'] ?? response.data;
        return User.fromJson(data);
      }
      throw Exception('Gagal membuat user');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<User> updateUser(int id, Map<String, dynamic> payload) async {
    try {
      final response =
          await DioClient.dio.put('${ApiConfig.users}/$id', data: payload);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return User.fromJson(data);
      }
      throw Exception('Gagal memperbarui user');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> deleteUser(int id) async {
    try {
      await DioClient.dio.delete('${ApiConfig.users}/$id');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<User> toggleActive(int id, bool activate) async {
    try {
      final endpoint = activate
          ? '${ApiConfig.users}/$id/activate'
          : '${ApiConfig.users}/$id/deactivate';
      final response = await DioClient.dio.patch(endpoint);
      if (response.statusCode == 200) {
        final data = response.data['data'] ?? response.data;
        return User.fromJson(data);
      }
      throw Exception('Gagal mengubah status user');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> forceLogout(int id) async {
    try {
      await DioClient.dio.patch('${ApiConfig.users}/$id/force-logout');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<void> resetLock(int id) async {
    try {
      await DioClient.dio.patch('${ApiConfig.users}/$id/reset-lock');
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
