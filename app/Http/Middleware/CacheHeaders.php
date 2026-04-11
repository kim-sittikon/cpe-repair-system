<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheHeaders
{
    /**
     * Handle an incoming request and add cache headers for static assets.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Get the request path
        $path = $request->path();

        // Add cache headers for static assets
        if ($this->isStaticAsset($path)) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
        }
        // Add cache headers for images
        elseif ($this->isImage($path)) {
            $response->headers->set('Cache-Control', 'public, max-age=2592000'); // 30 days
        }
        // Add cache headers for fonts
        elseif ($this->isFont($path)) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
        }

        return $response;
    }

    /**
     * Check if the request is for a static asset (JS/CSS with hash).
     */
    private function isStaticAsset(string $path): bool
    {
        return preg_match('/\.(js|css)$/', $path) && str_contains($path, 'build/assets');
    }

    /**
     * Check if the request is for an image.
     */
    private function isImage(string $path): bool
    {
        return preg_match('/\.(webp|png|jpg|jpeg|gif|svg|ico)$/', $path);
    }

    /**
     * Check if the request is for a font.
     */
    private function isFont(string $path): bool
    {
        return preg_match('/\.(woff|woff2|ttf|otf|eot)$/', $path);
    }
}
