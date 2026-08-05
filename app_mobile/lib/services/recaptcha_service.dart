import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class ReCaptchaService {
  // URL file HTML yang sudah Anda upload di server (WAJIB HTTPS)
  static const String _recaptchaHtmlUrl =
      'https://www.betoncortangerang.com/recaptcha.html';

  static Future<String?> getToken(BuildContext context) async {
    String? recaptchaToken;

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dialogContext) {
        return PopScope(
          canPop: false,
          child: Dialog(
            backgroundColor: Colors.transparent,
            child: Container(
              width: 300,
              height: 120,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Stack(
                children: [
                  // 1. UI Loading (Tampil di depan)
                  const Center(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(
                                Color(0xFF4F46E5)),
                            strokeWidth: 2,
                          ),
                        ),
                        SizedBox(width: 16),
                        Text(
                          'Verifying security...',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // 2. InAppWebView (Di belakang, transparan)
                  // Opacity 0.01 membuat WebView tetap ter-render di layar (syarat reCAPTCHA v3)
                  // namun tidak terlihat oleh user.
                  Opacity(
                    opacity: 0.01,
                    child: InAppWebView(
                      initialUrlRequest: URLRequest(
                        url: WebUri(_recaptchaHtmlUrl),
                      ),
                      initialSettings: InAppWebViewSettings(
                        javaScriptEnabled: true,
                        transparentBackground: true,
                        supportZoom: false,
                        clearCache: true,
                      ),
                      onWebViewCreated: (controller) {
                        // Handler untuk menerima token dari JavaScript (HTML)
                        controller.addJavaScriptHandler(
                          handlerName: 'onRecaptchaSuccess',
                          callback: (args) {
                            recaptchaToken = args[0] as String?;
                            debugPrint(
                                '✅ reCAPTCHA v3 token received successfully');
                            if (dialogContext.mounted) {
                              Navigator.of(dialogContext).pop();
                            }
                            return null;
                          },
                        );

                        // Handler untuk error
                        controller.addJavaScriptHandler(
                          handlerName: 'onRecaptchaError',
                          callback: (args) {
                            debugPrint('❌ reCAPTCHA v3 Error: ${args[0]}');
                            if (dialogContext.mounted) {
                              Navigator.of(dialogContext).pop();
                            }
                            return null;
                          },
                        );
                      },
                      onLoadStop: (controller, url) async {
                        debugPrint(
                            '✅ reCAPTCHA v3 WebView loaded successfully');
                      },
                      onReceivedError: (controller, request, error) {
                        debugPrint('❌ WebView Error: ${error.description}');
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );

    return recaptchaToken;
  }
}
