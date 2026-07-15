<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search']);
        $perPage = (int) $request->input('per_page', 12);
        $page = (int) $request->input('page', 1);

        $roles = $this->service->paginate(
            filters: $filters,
            perPage: $perPage,
            page: $page
        );

        return response()->json([
            'success' => true,
            'data' => $roles->items(),
            'meta' => [
                'current_page' => $roles->currentPage(),
                'per_page' => $roles->perPage(),
                'total' => $roles->total(),
                'last_page' => $roles->lastPage(),
                'from' => $roles->firstItem(),
                'to' => $roles->lastItem(),
            ]
        ]);
    }

    public function dropdown(): JsonResponse
    {
        $roles = $this->service->getRolesForDropdown();

        return response()->json([
            'success' => true,
            'data' => $roles
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

    public function show(int $id): JsonResponse
    {
        $role = $this->service->find($id);

        return response()->json([
            'success' => true,
            'data' => $role
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => ['required', 'string', 'max:50', 'regex:/^[a-z_]+$/'],
                'display_name' => ['required', 'string', 'max:100'],
            ],
            [
                'name.required' => 'Nama role wajib diisi',
                'name.max' => 'Nama role maksimal 50 karakter',
                'name.regex' => 'Nama role hanya boleh huruf kecil dan underscore',
                'display_name.required' => 'Display name wajib diisi',
                'display_name.max' => 'Display name maksimal 100 karakter',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $role = $this->service->create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil dibuat',
                'data' => $role
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
                'name' => ['required', 'string', 'max:50'],
                'display_name' => ['required', 'string', 'max:100'],
            ],
            [
                'name.required' => 'Nama role wajib diisi',
                'name.max' => 'Nama role maksimal 50 karakter',
                'display_name.required' => 'Display name wajib diisi',
                'display_name.max' => 'Display name maksimal 100 karakter',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $role = $this->service->update(
                id: $id,
                data: $validator->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil diperbarui',
                'data' => $role
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
                'message' => 'Role berhasil dihapus'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23503') {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'id' => ['Role tidak dapat dihapus karena masih digunakan oleh user.']
                    ]
                ], 422);
            }

            throw $e;
        }
    }
}