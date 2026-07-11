<?php

namespace App\Services;

use App\Models\LoginLog;

class LoginLogService
{
    public function create(array $data): void
    {
        LoginLog::create($data);
    }
}