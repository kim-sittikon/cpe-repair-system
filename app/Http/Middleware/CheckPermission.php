<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware: ตรวจสอบ Permission (Job Flags) ของ User
 * 
 * ใช้: middleware('permission:job_admin')
 *      middleware('permission:job_repair,job_complaint')
 * 
 * ถ้า user role = 'admin' → bypass เสมอ (super admin)
 * ถ้า user ไม่มี permission → redirect ไป /dashboard
 */
class CheckPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Admin role → bypass ทุก permission check
        if ($user->role === 'admin') {
            return $next($request);
        }

        // ตรวจสอบว่า user มีอย่างน้อย 1 permission ที่กำหนด
        foreach ($permissions as $permission) {
            if ($user->{$permission}) {
                return $next($request);
            }
        }

        return redirect()->route('dashboard')
            ->with('error', 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
    }
}
