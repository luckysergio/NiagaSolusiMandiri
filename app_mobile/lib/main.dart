// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';

import 'config/env_config.dart';
import 'services/dio_client.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ============================================
  // 1. LOAD ENVIRONMENT VARIABLES
  // ============================================
  try {
    await dotenv.load(fileName: ".env");
    EnvConfig.printConfig();
  } catch (e) {
    // Gunakan debugPrint untuk development logging
    debugPrint('⚠️ Error loading .env file: $e');
    // Fallback: coba load dari assets
    try {
      await dotenv.load();
    } catch (e) {
      debugPrint('⚠️ Error loading .env from assets: $e');
    }
  }

  // ============================================
  // 2. INITIALIZE DIO CLIENT
  // ============================================
  DioClient.init();

  // ============================================
  // 3. RUN APP
  // ============================================
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        // Tambahkan provider lain di sini jika diperlukan
      ],
      child: MaterialApp(
        title: EnvConfig.appName,
        debugShowCheckedModeBanner: EnvConfig.appDebug,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF4F46E5),
            primary: const Color(0xFF4F46E5),
          ),
          useMaterial3: true,
          fontFamily: 'Poppins', // Optional: jika pakai custom font
        ),
        initialRoute: '/splash',
        routes: {
          '/splash': (context) => const SplashScreen(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
        },
        onGenerateRoute: (settings) {
          // Handle route yang tidak terdaftar
          if (settings.name == '/dashboard') {
            // Untuk sementara tampilkan placeholder
            return MaterialPageRoute(
              builder: (context) => Scaffold(
                appBar: AppBar(
                  title: const Text('Dashboard'),
                  backgroundColor: const Color(0xFF4F46E5),
                  foregroundColor: Colors.white,
                ),
                body: const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.dashboard_rounded,
                        size: 64,
                        color: Color(0xFF4F46E5),
                      ),
                      SizedBox(height: 16),
                      Text(
                        'Dashboard',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Coming Soon...',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }
          return null;
        },
      ),
    );
  }
}
