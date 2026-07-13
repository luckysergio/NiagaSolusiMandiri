<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\TransactionService;
use App\Enums\TransactionStatus;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function __construct(
        protected TransactionService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search',
            'status',
            'user_id',
            'start_date',
            'end_date',
        ]);

        $perPage = (int) $request->input('per_page', 10);

        $transactions = $this->service->paginate(
            filters: $filters,
            perPage: $perPage
        );

        return response()->json([
            'success' => true,
            'data' => $transactions,
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
                'last_page' => $transactions->lastPage(),
                'from' => $transactions->firstItem(),
                'to' => $transactions->lastItem(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->find($id)
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'transaction_date' => ['required', 'date'],
            'customer_name' => ['required', 'string', 'max:150'],
            'project_name' => ['nullable', 'string', 'max:200'],
            'project_address' => ['nullable', 'string'],
            'status' => [
                'nullable',
                Rule::in(TransactionStatus::values()),
            ],
            'notes' => ['nullable', 'string'],
            'details' => ['nullable', 'array'],
            'details.*.product_id' => ['required_with:details', 'integer', 'exists:products,id'],
            'details.*.unit' => ['nullable', 'string', 'max:20'],
            'details.*.product_price' => ['required_with:details', 'numeric', 'min:0'],
            'details.*.qty' => ['required_with:details', 'numeric', 'min:0.01'],
            'details.*.supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
            'details.*.expense' => ['nullable', 'numeric', 'min:0'],
        ], [
            'transaction_date.required' => 'Tanggal transaksi wajib diisi',
            'transaction_date.date' => 'Format tanggal tidak valid',
            'customer_name.required' => 'Nama pelanggan wajib diisi',
            'customer_name.max' => 'Nama pelanggan maksimal 150 karakter',
            'project_name.max' => 'Nama proyek maksimal 200 karakter',
            'status.in' => 'Status tidak valid',
            'details.array' => 'Detail transaksi harus berupa array',
            'details.*.product_id.required_with' => 'Product ID wajib diisi',
            'details.*.product_id.exists' => 'Produk tidak ditemukan',
            'details.*.product_price.required_with' => 'Harga produk wajib diisi',
            'details.*.product_price.min' => 'Harga produk minimal 0',
            'details.*.qty.required_with' => 'Quantity wajib diisi',
            'details.*.qty.min' => 'Quantity minimal 0.01',
            'details.*.supplier_id.exists' => 'Supplier tidak ditemukan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $transaction = $this->service->create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil ditambahkan',
                'data' => $transaction
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'transaction_date' => ['required', 'date'],
            'customer_name' => ['required', 'string', 'max:150'],
            'project_name' => ['nullable', 'string', 'max:200'],
            'project_address' => ['nullable', 'string'],
            'status' => [
                'nullable',
                Rule::in(TransactionStatus::values()),
            ],
            'notes' => ['nullable', 'string'],
            'details' => ['nullable', 'array'],
            'details.*.product_id' => ['required_with:details', 'integer', 'exists:products,id'],
            'details.*.unit' => ['nullable', 'string', 'max:20'],
            'details.*.product_price' => ['required_with:details', 'numeric', 'min:0'],
            'details.*.qty' => ['required_with:details', 'numeric', 'min:0.01'],
            'details.*.supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
            'details.*.expense' => ['nullable', 'numeric', 'min:0'],
        ], [
            'transaction_date.required' => 'Tanggal transaksi wajib diisi',
            'transaction_date.date' => 'Format tanggal tidak valid',
            'customer_name.required' => 'Nama pelanggan wajib diisi',
            'customer_name.max' => 'Nama pelanggan maksimal 150 karakter',
            'project_name.max' => 'Nama proyek maksimal 200 karakter',
            'status.in' => 'Status tidak valid',
            'details.array' => 'Detail transaksi harus berupa array',
            'details.*.product_id.required_with' => 'Product ID wajib diisi',
            'details.*.product_id.exists' => 'Produk tidak ditemukan',
            'details.*.product_price.required_with' => 'Harga produk wajib diisi',
            'details.*.product_price.min' => 'Harga produk minimal 0',
            'details.*.qty.required_with' => 'Quantity wajib diisi',
            'details.*.qty.min' => 'Quantity minimal 0.01',
            'details.*.supplier_id.exists' => 'Supplier tidak ditemukan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $transaction = $this->service->update($id, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil diperbarui',
                'data' => $transaction
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil dihapus'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function changeStatus(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(TransactionStatus::values())],
        ], [
            'status.required' => 'Status wajib diisi',
            'status.in' => 'Status tidak valid',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $transaction = $this->service->changeStatus($id, $request->input('status'));

            return response()->json([
                'success' => true,
                'message' => "Status transaksi berhasil diubah menjadi {$transaction->status->label()}",
                'data' => $transaction
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function dropdown(Request $request): JsonResponse
    {
        $status = $request->input('status');

        return response()->json([
            'success' => true,
            'data' => $this->service->getTransactionsForDropdown($status)
        ]);
    }

    public function statistics(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        return response()->json([
            'success' => true,
            'data' => $this->service->getStatistics($startDate, $endDate)
        ]);
    }
}