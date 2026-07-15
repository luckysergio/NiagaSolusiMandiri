<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search',
            'product_type_id',
            'category_id',
            'is_active',
            'featured',
            'price_min',
            'price_max',
        ]);

        $perPage = (int) $request->input('per_page', 12);
        $page = (int) $request->input('page', 1);

        $products = $this->service->paginate(
            filters: $filters,
            perPage: $perPage,
            page: $page
        );

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'last_page' => $products->lastPage(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->service->find($id);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'product_type_id' => ['required', 'integer', 'exists:product_types,id'],
                'code' => ['nullable', 'string', 'max:30', 'unique:products,code'],
                'name' => ['required', 'string', 'max:150'],
                'description' => ['nullable', 'string'],
                'price' => ['nullable', 'numeric', 'min:0'],
                'unit' => ['nullable', 'string', 'max:20'],
                'minimum_order' => ['nullable', 'numeric', 'min:0'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
                'featured' => ['nullable', 'boolean'],
                'is_active' => ['nullable', 'boolean'],
            ],
            [
                'product_type_id.required' => 'Jenis produk wajib dipilih',
                'product_type_id.exists' => 'Jenis produk tidak ditemukan',
                'code.max' => 'Kode produk maksimal 30 karakter',
                'code.unique' => 'Kode produk sudah digunakan',
                'name.required' => 'Nama produk wajib diisi',
                'name.max' => 'Nama produk maksimal 150 karakter',
                'price.numeric' => 'Harga harus berupa angka',
                'price.min' => 'Harga minimal 0',
                'unit.max' => 'Unit maksimal 20 karakter',
                'minimum_order.numeric' => 'Minimum order harus berupa angka',
                'minimum_order.min' => 'Minimum order minimal 0',
                'sort_order.integer' => 'Sort order harus berupa angka',
                'sort_order.min' => 'Sort order minimal 0',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = $this->service->create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil ditambahkan',
                'data' => $product
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
        $validator = Validator::make(
            $request->all(),
            [
                'product_type_id' => ['required', 'integer', 'exists:product_types,id'],
                'code' => [
                    'nullable',
                    'string',
                    'max:30',
                    Rule::unique('products')->ignore($id),
                ],
                'name' => ['required', 'string', 'max:150'],
                'description' => ['nullable', 'string'],
                'price' => ['nullable', 'numeric', 'min:0'],
                'unit' => ['nullable', 'string', 'max:20'],
                'minimum_order' => ['nullable', 'numeric', 'min:0'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
                'featured' => ['nullable', 'boolean'],
                'is_active' => ['nullable', 'boolean'],
            ],
            [
                'product_type_id.required' => 'Jenis produk wajib dipilih',
                'product_type_id.exists' => 'Jenis produk tidak ditemukan',
                'code.max' => 'Kode produk maksimal 30 karakter',
                'code.unique' => 'Kode produk sudah digunakan',
                'name.required' => 'Nama produk wajib diisi',
                'name.max' => 'Nama produk maksimal 150 karakter',
                'price.numeric' => 'Harga harus berupa angka',
                'price.min' => 'Harga minimal 0',
                'unit.max' => 'Unit maksimal 20 karakter',
                'minimum_order.numeric' => 'Minimum order harus berupa angka',
                'minimum_order.min' => 'Minimum order minimal 0',
                'sort_order.integer' => 'Sort order harus berupa angka',
                'sort_order.min' => 'Sort order minimal 0',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = $this->service->update($id, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil diperbarui',
                'data' => $product
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
                'message' => 'Produk berhasil dihapus'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function toggleActive(int $id): JsonResponse
    {
        try {
            $product = $this->service->toggleActive($id);

            return response()->json([
                'success' => true,
                'message' => $product->is_active ? 'Produk diaktifkan' : 'Produk dinonaktifkan',
                'data' => $product
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function toggleFeatured(int $id): JsonResponse
    {
        try {
            $product = $this->service->toggleFeatured($id);

            return response()->json([
                'success' => true,
                'message' => $product->featured ? 'Produk ditandai sebagai unggulan' : 'Produk dihapus dari unggulan',
                'data' => $product
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
        $typeId = $request->input('product_type_id') ? (int) $request->input('product_type_id') : null;
        $categoryId = $request->input('category_id') ? (int) $request->input('category_id') : null;

        $products = $this->service->getProductsForDropdown($typeId, $categoryId);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function statistics(Request $request): JsonResponse
    {
        $categoryId = $request->input('category_id') ? (int) $request->input('category_id') : null;
        $typeId = $request->input('product_type_id') ? (int) $request->input('product_type_id') : null;

        $stats = $this->service->getStatistics($categoryId, $typeId);

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function nextSortOrder(Request $request): JsonResponse
    {
        $typeId = $request->input('product_type_id') ? (int) $request->input('product_type_id') : null;
        $nextOrder = $this->service->getNextSortOrder($typeId);

        return response()->json([
            'success' => true,
            'data' => ['next_sort_order' => $nextOrder]
        ]);
    }

    public function generateCode(Request $request): JsonResponse
    {
        $productTypeId = $request->input('product_type_id');
        $name = $request->input('name', '');

        if (!$productTypeId || !$name) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis produk dan nama wajib diisi untuk generate kode.'
            ], 422);
        }

        $code = $this->service->generateSmartCode((int) $productTypeId, $name);

        return response()->json([
            'success' => true,
            'data' => [
                'code' => $code,
            ]
        ]);
    }
}