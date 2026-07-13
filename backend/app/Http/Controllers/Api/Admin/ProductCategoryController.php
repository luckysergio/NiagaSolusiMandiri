<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProductCategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProductCategoryController extends Controller
{
    public function __construct(
        protected ProductCategoryService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search',
            'is_active',
        ]);

        $perPage = (int) $request->input('per_page', 10);

        $categories = $this->service->paginate(
            filters: $filters,
            perPage: $perPage
        );

        return response()->json([
            'success' => true,
            'data' => $categories,
            'meta' => [
                'current_page' => $categories->currentPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
                'last_page' => $categories->lastPage(),
                'from' => $categories->firstItem(),
                'to' => $categories->lastItem(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->service->find($id);

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => ['required', 'string', 'max:100'],
                'slug' => ['nullable', 'string', 'max:120'],
                'description' => ['nullable', 'string'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
                'is_active' => ['nullable', 'boolean'],
            ],
            [
                'name.required' => 'Nama kategori wajib diisi',
                'name.max' => 'Nama kategori maksimal 100 karakter',
                'slug.max' => 'Slug maksimal 120 karakter',
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
            $category = $this->service->create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Kategori berhasil ditambahkan',
                'data' => $category
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
                'name' => ['required', 'string', 'max:100'],
                'slug' => ['nullable', 'string', 'max:120'],
                'description' => ['nullable', 'string'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
                'is_active' => ['nullable', 'boolean'],
            ],
            [
                'name.required' => 'Nama kategori wajib diisi',
                'name.max' => 'Nama kategori maksimal 100 karakter',
                'slug.max' => 'Slug maksimal 120 karakter',
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
            $category = $this->service->update($id, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Kategori berhasil diperbarui',
                'data' => $category
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
                'message' => 'Kategori berhasil dihapus'
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
            $category = $this->service->toggleActive($id);

            return response()->json([
                'success' => true,
                'message' => $category->is_active ? 'Kategori diaktifkan' : 'Kategori dinonaktifkan',
                'data' => $category
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function dropdown(): JsonResponse
    {
        $categories = $this->service->getCategoriesForDropdown();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function statistics(): JsonResponse
    {
        $stats = $this->service->getStatistics();

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function nextSortOrder(): JsonResponse
    {
        $nextOrder = $this->service->getNextSortOrder();

        return response()->json([
            'success' => true,
            'data' => [
                'next_sort_order' => $nextOrder,
            ]
        ]);
    }
}