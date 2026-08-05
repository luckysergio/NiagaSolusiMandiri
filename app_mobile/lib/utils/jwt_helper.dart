import 'dart:convert';

class JwtHelper {
  /// Decode JWT token dan return payload sebagai Map
  static Map<String, dynamic>? decodeToken(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) return null;

      final payload = parts[1];
      final normalized = base64Url.normalize(payload);
      final decoded = utf8.decode(base64Url.decode(normalized));
      return jsonDecode(decoded);
    } catch (e) {
      return null;
    }
  }

  /// Cek apakah token sudah expired
  static bool isTokenExpired(String token) {
    final payload = decodeToken(token);
    if (payload == null) return true;

    final exp = payload['exp'];
    if (exp == null) return true;

    final expiryTime = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
    // Beri buffer 30 detik sebelum benar-benar expired
    return DateTime.now().add(const Duration(seconds: 30)).isAfter(expiryTime);
  }

  /// Ambil sisa waktu sebelum expired (dalam detik)
  static int getTimeUntilExpiry(String token) {
    final payload = decodeToken(token);
    if (payload == null) return 0;

    final exp = payload['exp'];
    if (exp == null) return 0;

    final expiryTime = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
    return expiryTime.difference(DateTime.now()).inSeconds;
  }
}
