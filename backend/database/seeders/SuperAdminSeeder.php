<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'adminwebsitensm@gmail.com',
            ],
            [
                'role_id' => Role::where(
                    'name',
                    'super_admin'
                )->value('id'),

                'name' => 'Super Admin',

                'password' => bcrypt(
                    'adminniagasolusimandiri!_@'
                ),

                'is_active' => true,
            ]
        );
    }
}