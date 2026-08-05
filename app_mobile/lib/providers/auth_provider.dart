import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../utils/jwt_helper.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  String? _token;
  bool _isLoading = false;
  bool _isAuthenticated = false;
  String? _error;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String? get error => _error;

  AuthProvider() {
    _loadUserFromStorage();
  }

  Future<void> _loadUserFromStorage() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      _token = prefs.getString('access_token');

      if (_token != null && _token!.isNotEmpty) {
        // Cek apakah token sudah expired
        if (JwtHelper.isTokenExpired(_token!)) {
          await _clearStoredData();
          _isAuthenticated = false;
        } else {
          _isAuthenticated = true;
          final userData = prefs.getString('user');
          if (userData != null) {
            try {
              final Map<String, dynamic> userMap = jsonDecode(userData);
              _user = User.fromJson(userMap);
            } catch (e) {
              // Silent fail - data corrupt
            }
          }
        }
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Cek apakah token saat ini masih valid (belum expired)
  bool isTokenValid() {
    if (_token == null || _token!.isEmpty) return false;
    return !JwtHelper.isTokenExpired(_token!);
  }

  Future<bool> login({
    required String email,
    required String password,
    String? recaptchaToken,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await AuthService.login(
        email: email,
        password: password,
        recaptchaToken: recaptchaToken,
      );

      if (response.success) {
        _token = response.token;
        _user = response.user;
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response.message;
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await AuthService.logout();
    } catch (e) {
      // Silent fail - tetap lanjutkan logout lokal
    }

    await _clearStoredData();
    _user = null;
    _token = null;
    _isAuthenticated = false;
    _error = null;
    _isLoading = false;
    notifyListeners();
    return true;
  }

  /// Logout tanpa memanggil API (untuk kasus token expired)
  Future<void> silentLogout() async {
    await _clearStoredData();
    _user = null;
    _token = null;
    _isAuthenticated = false;
    _error = null;
    notifyListeners();
  }

  Future<void> _clearStoredData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('user');
  }

  void updateUser(User user) {
    _user = user;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
