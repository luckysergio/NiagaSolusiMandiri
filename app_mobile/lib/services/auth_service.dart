// lib/services/auth_service.dart
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../models/auth_response.dart';
import 'dio_client.dart';

class AuthService {
  // Tambahkan method ini di AuthService class
  static Future<AuthResponse> register({
    required String name,
    required String email,
    required String password,
    String? recaptchaToken,
  }) async {
    try {
      final payload = {
        'name': name,
        'email': email,
        'password': password,
        'password_confirmation': password,
        if (recaptchaToken != null && recaptchaToken.isNotEmpty)
          'recaptcha_token': recaptchaToken,
      };

      final response = await DioClient.dio.post(
        ApiConfig.register,
        data: payload,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return AuthResponse.fromJson(response.data);
      } else {
        return AuthResponse(
          success: false,
          message: 'Register failed: ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      return _handleDioError(e);
    } catch (e) {
      return AuthResponse(
        success: false,
        message: 'Terjadi kesalahan: ${e.toString()}',
      );
    }
  }

  static Future<AuthResponse> login({
    required String email,
    required String password,
    String? recaptchaToken,
  }) async {
    try {
      final payload = {
        'email': email,
        'password': password,
        if (recaptchaToken != null && recaptchaToken.isNotEmpty)
          'recaptcha_token': recaptchaToken,
      };

      final response = await DioClient.dio.post(
        ApiConfig.login,
        data: payload,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Save token and user data
        if (response.data['token'] != null) {
          await _saveToken(response.data['token']);
        }
        if (response.data['user'] != null) {
          await _saveUser(response.data['user']);
        }

        return AuthResponse.fromJson(response.data);
      } else {
        return AuthResponse(
          success: false,
          message: 'Login failed: ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      return _handleDioError(e);
    } catch (e) {
      return AuthResponse(
        success: false,
        message: 'Terjadi kesalahan: ${e.toString()}',
      );
    }
  }

  static Future<AuthResponse> logout() async {
    try {
      final response = await DioClient.dio.post(ApiConfig.logout);
      await _clearAllData();
      return AuthResponse.fromJson(response.data);
    } on DioException catch (e) {
      await _clearAllData();
      return _handleDioError(e);
    } catch (e) {
      await _clearAllData();
      return AuthResponse(
        success: false,
        message: 'Terjadi kesalahan: ${e.toString()}',
      );
    }
  }

  static Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', token);
  }

  static Future<void> _saveUser(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user', userData.toString());
  }

  static Future<void> _clearAllData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('user');
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  static AuthResponse _handleDioError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.connectionError) {
      return AuthResponse(
        success: false,
        message:
            'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      );
    } else if (e.response != null) {
      final errorData = e.response?.data;
      if (errorData is Map && errorData.containsKey('message')) {
        return AuthResponse(
          success: false,
          message: errorData['message'],
        );
      } else if (errorData is Map && errorData.containsKey('errors')) {
        final errors = errorData['errors'];
        if (errors is Map) {
          final errorMessages =
              errors.values.expand((e) => e as List).join('\n');
          return AuthResponse(
            success: false,
            message: errorMessages,
          );
        }
      }
      return AuthResponse(
        success: false,
        message: 'Terjadi kesalahan: ${e.response?.statusCode}',
      );
    } else {
      return AuthResponse(
        success: false,
        message: 'Terjadi kesalahan: ${e.message}',
      );
    }
  }
}
