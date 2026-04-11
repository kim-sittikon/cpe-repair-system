<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAccountSuspended
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isSuspended()) {
            $suspensionStatus = $user->suspensionStatus();

            // Logout the user
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($suspensionStatus === 'permanent') {
                return redirect()->route('login')->with('error', 
                    'บัญชีของคุณถูกปิดใช้งานถาวร กรุณาติดต่อ support@cperepair.app เพื่อขอข้อมูลเพิ่มเติม'
                );
            }

            // Temporary suspension
            $endDate = $user->suspension_end->locale('th')->translatedFormat('d F Y เวลา H:i น.');
            $reason = $user->suspension_reason ?: 'ไม่ระบุ';

            return redirect()->route('login')->with('error', 
                "บัญชีของคุณถูกระงับชั่วคราวจนถึงวันที่ {$endDate} เหตุผล: {$reason}"
            );
        }

        return $next($request);
    }
}
