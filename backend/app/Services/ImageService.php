<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class ImageService
{
    private const MAX_WIDTH = 800;
    private const MAX_HEIGHT = 800;
    private const QUALITY = 80;
    private const FORMAT = 'webp';

    public function uploadAndCompress(
        UploadedFile $file,
        string $folder
    ): string {

        $filename = $this->generateFilename();

        $path = trim($folder, '/') . '/' . $filename;

        $image = Image::read($file)
            ->scaleDown(
                width: self::MAX_WIDTH,
                height: self::MAX_HEIGHT
            );

        $encoded = $image->toWebp(self::QUALITY);

        Storage::disk('public')->put(
            $path,
            (string) $encoded
        );

        return $path;
    }

    public function replace(
        UploadedFile $file,
        string $folder,
        ?string $oldPath = null
    ): string {

        if (!empty($oldPath)) {
            $this->delete($oldPath);
        }

        return $this->uploadAndCompress($file, $folder);
    }

    public function delete(?string $path): void
    {
        if (blank($path)) {
            return;
        }

        $disk = Storage::disk('public');

        if ($disk->exists($path)) {
            $disk->delete($path);
        }
    }

    public function getUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        return asset('storage/' . ltrim($path, '/'));
    }

    protected function generateFilename(): string
    {
        return sprintf(
            '%s_%s.%s',
            now()->format('Ymd_His'),
            bin2hex(random_bytes(6)),
            self::FORMAT
        );
    }
}