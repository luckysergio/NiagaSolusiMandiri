<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProductTypeService;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProductTypeController extends Controller
{
    public function __construct(
        protected ProductTypeService $service,
        protected ImageService $imageService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search',
            'category_id',
            'is_active',
        ]);

        $perPage = (int) $request->input('per_page', 12);
        $page = (int) $request->input('page', 1);

        $types = $this->service->paginate(
            filters: $filters,
            perPage: $perPage,
            page: $page
        );

        $types->through(function ($type) {
            $type->image_url = $this->imageService->getUrl($type->image);
            return $type;
        });

        return response()->json([
            'success' => true,
            'data' => $types->items(),
            'meta' => [
                'current_page' => $types->currentPage(),
                'per_page' => $types->perPage(),
                'total' => $types->total(),
                'last_page' => $types->lastPage(),
                'from' => $types->firstItem(),
                'to' => $types->lastItem(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $type = $this->service->find($id);
        $type->image_url = $this->imageService->getUrl($type->image);

        return response()->json([
            'success' => true,
            'data' => $type
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'category_id' => ['required', 'integer', 'exists:product_categories,id'],
                'name' => ['required', 'string', 'max:120'],
                'slug' => ['nullable', 'string', 'max:150'],
                'description' => ['nullable', 'string'],
                'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
                'is_active' => ['nullable', 'boolean'],
            ],
            [
                'category_id.required' => 'Kategori wajib dipilih',
                'category_id.exists' => 'Kategori tidak ditemukan',
                'name.required' => 'Nama jenis produk wajib diisi',
                'name.max' => 'Nama jenis produk maksimal 120 karakter',
                'slug.max' => 'Slug maksimal 150 karakter',
                'image.image' => 'File harus berupa gambar',
                'image.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WebP',
                'image.max' => 'Ukuran gambar maksimal 2MB',
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
            $type = $this->service->create(
                data: $validator->validated(),
                image: $request->file('image')
            );

            $type->image_url = $this->imageService->getUrl($type->image);

            return response()->json([
                'success' => true,
                'message' => 'Jenis produk berhasil ditambahkan',
                'data' => $type
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
                'category_id' => ['required', 'integer', 'exists:product_categories,id'],
                'name' => ['required', 'string', 'max:120'],
                'slug' => ['nullable', 'string', 'max:150'],
                'description' => ['nullable', 'string'],
                'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
                'is_active' => ['nullable', 'boolean'],
            ],
            [
                'category_id.required' => 'Kategori wajib dipilih',
                'category_id.exists' => 'Kategori tidak ditemukan',
                'name.required' => 'Nama jenis produk wajib diisi',
                'name.max' => 'Nama jenis produk maksimal 120 karakter',
                'slug.max' => 'Slug maksimal 150 karakter',
                'image.image' => 'File harus berupa gambar',
                'image.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WebP',
                'image.max' => 'Ukuran gambar maksimal 2MB',
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
            $type = $this->service->update(
                id: $id,
                data: $validator->validated(),
                image: $request->file('image')
            );

            $type->image_url = $this->imageService->getUrl($type->image);

            return response()->json([
                'success' => true,
                'message' => 'Jenis produk berhasil diperbarui',
                'data' => $type
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
                'message' => 'Jenis produk berhasil dihapus'
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
            $type = $this->service->toggleActive($id);
            $type->image_url = $this->imageService->getUrl($type->image);

            return response()->json([
                'success' => true,
                'message' => $type->is_active ? 'Jenis produk diaktifkan' : 'Jenis produk dinonaktifkan',
                'data' => $type
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
        $categoryId = $request->input('category_id')
            ? (int) $request->input('category_id')
            : null;

        $types = $this->service->getTypesForDropdown($categoryId);

        return response()->json([
            'success' => true,
            'data' => $types
        ]);
    }

    public function statistics(Request $request): JsonResponse
    {
        $categoryId = $request->input('category_id')
            ? (int) $request->input('category_id')
            : null;

        $stats = $this->service->getStatistics($categoryId);

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function nextSortOrder(Request $request): JsonResponse
    {
        $categoryId = $request->input('category_id')
            ? (int) $request->input('category_id')
            : null;

        $nextOrder = $this->service->getNextSortOrder($categoryId);

        return response()->json([
            'success' => true,
            'data' => [
                'next_sort_order' => $nextOrder,
            ]
        ]);
    }
}