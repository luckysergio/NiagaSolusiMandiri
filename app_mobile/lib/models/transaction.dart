class Transaction {
  final int id;
  final String invoice;
  final String customerName;
  final String? projectName;
  final String? projectAddress;
  final DateTime transactionDate;
  final String status; // 'dipesan', 'dikerjakan', 'selesai'
  final num totalTransaction;
  final num totalExpense;
  final int detailsCount;
  final int? userId;
  final String? userName;
  final String? notes;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Transaction({
    required this.id,
    required this.invoice,
    required this.customerName,
    this.projectName,
    this.projectAddress,
    required this.transactionDate,
    required this.status,
    required this.totalTransaction,
    required this.totalExpense,
    this.detailsCount = 0,
    this.userId,
    this.userName,
    this.notes,
    this.createdAt,
    this.updatedAt,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? 0,
      invoice: json['invoice'] ?? '',
      customerName: json['customer_name'] ?? '',
      projectName: json['project_name'],
      projectAddress: json['project_address'],
      transactionDate: json['transaction_date'] != null
          ? DateTime.parse(json['transaction_date'])
          : DateTime.now(),
      status: json['status'] ?? 'dipesan',
      totalTransaction: json['total_transaction'] is num
          ? json['total_transaction']
          : num.tryParse(json['total_transaction']?.toString() ?? '0') ?? 0,
      totalExpense: json['total_expense'] is num
          ? json['total_expense']
          : num.tryParse(json['total_expense']?.toString() ?? '0') ?? 0,
      detailsCount: json['details_count'] is int
          ? json['details_count']
          : int.tryParse(json['details_count']?.toString() ?? '0') ?? 0,
      userId: json['user_id'] is int
          ? json['user_id']
          : int.tryParse(json['user_id']?.toString() ?? ''),
      userName: json['user'] != null ? json['user']['name'] : json['user_name'],
      notes: json['notes'],
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'])
          : null,
    );
  }
}
