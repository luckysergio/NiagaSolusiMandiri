<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\SupplierService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SupplierController extends Controller
{
    public function __construct(
        protected SupplierService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'is_active']);
        $perPage = (int) $request->input('per_page', 12);
        $page = (int) $request->input('page', 1);

        $suppliers = $this->service->paginate(
            filters: $filters, 
            perPage: $perPage,
            page: $page
        );

        return response()->json([
            'success' => true,
            'data' => $suppliers->items(),
            'meta' => [
                'current_page' => $suppliers->currentPage(),
                'per_page' => $suppliers->perPage(),
                'total' => $suppliers->total(),
                'last_page' => $suppliers->lastPage(),
                'from' => $suppliers->firstItem(),
                'to' => $suppliers->lastItem(),
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
            'name' => ['required', 'string', 'max:150', Rule::unique('suppliers', 'name')->whereNull('deleted_at')],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'name.required' => 'Nama supplier wajib diisi',
            'name.max' => 'Nama supplier maksimal 150 karakter',
            'name.unique' => 'Nama supplier sudah digunakan',
            'phone.max' => 'Nomor telepon maksimal 30 karakter',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $supplier = $this->service->create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Supplier berhasil ditambahkan',
                'data' => $supplier
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:150', Rule::unique('suppliers', 'name')->ignore($id)->whereNull('deleted_at')],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'name.required' => 'Nama supplier wajib diisi',
            'name.max' => 'Nama supplier maksimal 150 karakter',
            'name.unique' => 'Nama supplier sudah digunakan',
            'phone.max' => 'Nomor telepon maksimal 30 karakter',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $supplier = $this->service->update($id, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Supplier berhasil diperbarui',
                'data' => $supplier
            ]);

        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Supplier berhasil dihapus'
            ]);

        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
        }
    }

    public function toggleActive(int $id): JsonResponse
    {
        try {
            $supplier = $this->service->toggleActive($id);

            return response()->json([
                'success' => true,
                'message' => $supplier->is_active ? 'Supplier diaktifkan' : 'Supplier dinonaktifkan',
                'data' => $supplier
            ]);

        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'errors' => $e->errors()], 422);
        }
    }

    public function dropdown(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->getSuppliersForDropdown()
        ]);
    }

    public function statistics(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->service->getStatistics()
        ]);
    }
}