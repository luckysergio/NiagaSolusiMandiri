<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function __construct(
        protected UserService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search',
            'role_id',
            'is_active',
            'status',
        ]);

        $perPage = (int) $request->input('per_page', 20);

        $users = $this->service->paginate(
            filters: $filters,
            perPage: $perPage
        );

        return response()->json([
            'success' => true,
            'data' => $users,
            'meta' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->service->find($id);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make(
            $request->all(),
            [
                'role_id' => ['required', 'integer', 'exists:roles,id'],
                'name' => ['required', 'string', 'max:150'],
                'email' => ['required', 'email', 'max:150'],
                'password' => ['required', 'string', 'min:6', 'confirmed'],
                'is_active' => ['nullable', 'boolean'],
            ],
            [
                'role_id.required' => 'Role wajib dipilih',
                'role_id.exists' => 'Role tidak valid',
                'name.required' => 'Nama wajib diisi',
                'name.max' => 'Nama maksimal 150 karakter',
                'email.required' => 'Email wajib diisi',
                'email.email' => 'Format email tidak valid',
                'email.max' => 'Email maksimal 150 karakter',
                'password.required' => 'Password wajib diisi',
                'password.min' => 'Password minimal 6 karakter',
                'password.confirmed' => 'Konfirmasi password tidak cocok',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $this->service->create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'User berhasil dibuat',
                'data' => $user
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
                'role_id' => ['required', 'integer', 'exists:roles,id'],
                'name' => ['required', 'string', 'max:150'],
                'email' => ['required', 'email', 'max:150'],
                'password' => ['nullable', 'string', 'min:6', 'confirmed'],
            ],
            [
                'role_id.required' => 'Role wajib dipilih',
                'role_id.exists' => 'Role tidak valid',
                'name.required' => 'Nama wajib diisi',
                'name.max' => 'Nama maksimal 150 karakter',
                'email.required' => 'Email wajib diisi',
                'email.email' => 'Format email tidak valid',
                'email.max' => 'Email maksimal 150 karakter',
                'password.min' => 'Password minimal 6 karakter',
                'password.confirmed' => 'Konfirmasi password tidak cocok',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $this->service->update(
                id: $id,
                data: $validator->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'User berhasil diperbarui',
                'data' => $user
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
                'message' => 'User berhasil dihapus'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function activate(int $id): JsonResponse
    {
        try {
            $user = $this->service->activate($id);

            return response()->json([
                'success' => true,
                'message' => 'User berhasil diaktifkan',
                'data' => $user
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function deactivate(int $id): JsonResponse
    {
        try {
            $user = $this->service->deactivate($id);

            return response()->json([
                'success' => true,
                'message' => 'User berhasil dinonaktifkan',
                'data' => $user
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function forceLogout(int $id): JsonResponse
    {
        $user = $this->service->forceLogout($id);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dipaksa logout',
            'data' => $user
        ]);
    }

    public function resetLock(int $id): JsonResponse
    {
        $user = $this->service->resetLock($id);

        return response()->json([
            'success' => true,
            'message' => 'Lock user berhasil direset',
            'data' => $user
        ]);
    }

    public function getRoles(): JsonResponse
    {
        $roles = $this->service->getRolesForDropdown();

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }

    public function getStatistics(): JsonResponse
    {
        $stats = $this->service->getStatistics();

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}