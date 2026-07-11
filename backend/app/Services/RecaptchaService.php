<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class RecaptchaService
{
    public function verify(string $token, string $ip): void
    {
        $secret = config('services.recaptcha.secret');

        $response = Http::timeout(5)
            ->asForm()
            ->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secret,
                'response' => $token,
                'remoteip' => $ip,
            ]);

        if (!$response->successful()) {
            throw ValidationException::withMessages([
                'recaptcha' => ['Gagal verifikasi reCAPTCHA.']
            ]);
        }

        $result = $response->json();

        if (!($result['success'] ?? false)) {
            throw ValidationException::withMessages([
                'recaptcha' => ['reCAPTCHA tidak valid.']
            ]);
        }

        if (($result['score'] ?? 0) < 0.5) {
            throw ValidationException::withMessages([
                'recaptcha' => ['Akses terdeteksi sebagai bot.']
            ]);
        }
    }
}