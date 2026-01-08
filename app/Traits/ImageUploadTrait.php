<?php

namespace App\Traits;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Exception;

trait ImageUploadTrait
{
    /**
     * Upload and resize an image.
     *
     * @param \Illuminate\Http\UploadedFile $file The image file from request.
     * @param string $path The storage directory (inside storage/app/public).
     * @param int $width The maximum width (default 1200px).
     * @param int $quality The WebP quality (default 80).
     * @return string|null The relative path of the saved image.
     */
    public function uploadImage(UploadedFile $file, string $path = 'uploads', int $width = 1200, int $quality = 80): ?string
    {
        if (!$file) {
            return null;
        }

        try {
            // Increase memory limit for this process to handle large images
            ini_set('memory_limit', '256M');

            // Sanitize path (remove trailing slash)
            $path = rtrim($path, '/');

            // CHECK: Is GD Extension loaded?
            if (extension_loaded('gd')) {
                // 1. Create ImageManager Instance (Driver: GD)
                $manager = new ImageManager(new Driver());

                // 2. Read the image
                $image = $manager->read($file);

                // 3. Resize (Scale width to 1200px, maintain aspect ratio)
                $image->scale(width: $width);

                // 4. Encode to WebP with Quality
                $encoded = $image->toWebp($quality);

                // 5. Generate Unique Filename
                $filename = Str::uuid() . '.webp';
                $fullPath = $path . '/' . $filename;

                // 6. Save to Storage
                Storage::disk('public')->put($fullPath, (string) $encoded);

                return $fullPath;
            } else {
                // FALLBACK: GD is missing. Save original file.
                Log::warning('GD Extension not loaded. Falling back to original file upload.');

                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

                // storeAs automatically handles disk: 'public' if not specified, 
                // but usually we want to be explicit. 
                // However, storeAs uses the default disk. 
                // Let's use Storage::disk('public')->putFileAs...
                // Or simply use the file's storeAs method which is convenient.

                // Ensure we are using the 'public' disk
                return $file->storeAs($path, $filename, 'public');
            }

        } catch (Exception $e) {
            // Log error for debugging
            Log::error('Image Upload Failed: ' . $e->getMessage(), [
                'path' => $path,
                'file' => $file->getClientOriginalName()
            ]);

            // If Resize failed, try fallback save
            try {
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                return $file->storeAs($path, $filename, 'public');
            } catch (Exception $fallbackError) {
                // If even fallback fails, then throw original error
                throw $e;
            }
        }
    }

    /**
     * Delete an image from storage.
     * 
     * @param string|null $path
     * @return bool
     */
    public function deleteImage($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }
}
