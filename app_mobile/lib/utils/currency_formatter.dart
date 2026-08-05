class CurrencyFormatter {
  /// Format angka ke Rupiah: "Rp 1.500.000"
  static String formatRupiah(num value) {
    final intValue = value.round();
    final formatted = intValue.toString().replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]}.',
        );
    return 'Rp $formatted';
  }

  /// Format untuk input field: "1.500.000" (tanpa "Rp")
  static String formatInput(String digits) {
    final clean = digits.replaceAll(RegExp(r'[^\d]'), '');
    if (clean.isEmpty) return '';
    return clean.replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]}.',
    );
  }

  /// Parse input "1.500.000" → 1500000
  static int parseRupiah(String formatted) {
    final clean = formatted.replaceAll(RegExp(r'[^\d]'), '');
    if (clean.isEmpty) return 0;
    return int.tryParse(clean) ?? 0;
  }
}
