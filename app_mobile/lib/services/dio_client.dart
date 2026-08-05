import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/env_config.dart';
import '../utils/app_navigator.dart';

class DioClient {
  static late Dio _dio;
  static bool _isShowingExpiredDialog = false;

  static Dio get dio => _dio;

  static void init() {
    _dio = Dio(
      BaseOptions(
        baseUrl: EnvConfig.currentApiUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onResponse: _onResponse,
        onError: _onError,
      ),
    );

    if (EnvConfig.isDevelopment) {
      _dio.interceptors.add(
        LogInterceptor(
          request: true,
          requestHeader: true,
          requestBody: true,
          responseHeader: true,
          responseBody: true,
        ),
      );
    }
  }

  static Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _getToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    return handler.next(options);
  }

  static void _onResponse(
    Response response,
    ResponseInterceptorHandler handler,
  ) {
    return handler.next(response);
  }

  static Future<void> _onError(
    DioException error,
    ErrorInterceptorHandler handler,
  ) async {
    if (error.response?.statusCode == 401) {
      await _clearToken();
      _showSessionExpiredDialog();
    }
    return handler.next(error);
  }

  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  static Future<void> _clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('user');
  }

  static void _showSessionExpiredDialog() {
    if (_isShowingExpiredDialog) return;
    _isShowingExpiredDialog = true;

    final context = AppNavigator.context;
    if (context == null) {
      _isShowingExpiredDialog = false;
      return;
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Color(0xFFF59E0B)),
            SizedBox(width: 10),
            Text(
              'Sesi Berakhir',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        content: const Text(
          'Sesi login Anda telah berakhir karena token JWT sudah expired.\n\n'
          'Silakan login ulang untuk melanjutkan.',
          style: TextStyle(
            color: Color(0xFFCBD5E1),
            fontSize: 14,
            height: 1.5,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              _isShowingExpiredDialog = false;
              // Redirect ke login
              context.go('/login');
            },
            style: TextButton.styleFrom(
              backgroundColor: const Color(0xFF4F46E5),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: const Text(
              'Login Ulang',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
