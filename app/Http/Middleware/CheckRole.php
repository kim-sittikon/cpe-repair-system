<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware: ตรวจสอบ Role ของ User
 * 
 * ใช้: middleware('role:admin,staff,teacher')
 * ถ้า user ไม่มี role ที่กำหนด → redirect ไป /dashboard พร้อม flash error
 */
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!in_array($user->role, $roles)) {
            return redirect()->route('dashboard')
                ->with('error', 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        }

        return $next($request);
    }
}
