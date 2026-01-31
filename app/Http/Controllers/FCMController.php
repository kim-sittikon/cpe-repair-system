<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FCMService;

class FCMController extends Controller
{
    /**
     * Store FCM token for the authenticated user
     */
    public function storeToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string|max:512'
        ]);

        $user = auth()->user();
        
        // Only update if token is different
        if ($user->fcm_token !== $request->token) {
            $user->update([
                'fcm_token' => $request->token,
                'fcm_token_updated_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'FCM token saved successfully'
        ]);
    }

    /**
     * Remove FCM token for the authenticated user (on logout)
     */
    public function removeToken(Request $request)
    {
        auth()->user()->update([
            'fcm_token' => null,
            'fcm_token_updated_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'FCM token removed successfully'
        ]);
    }

    /**
     * Get notification permission status
     */
    public function getStatus()
    {
        $user = auth()->user();
        $fcmService = new FCMService();

        return response()->json([
            'success' => true,
            'fcm_enabled' => $fcmService->isEnabled(),
            'has_token' => !empty($user->fcm_token),
            'token_updated_at' => $user->fcm_token_updated_at
        ]);
    }

    /**
     * Send test notification to current user
     */
    public function sendTest(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->fcm_token) {
            return response()->json([
                'success' => false,
                'message' => 'ยังไม่ได้เปิดการแจ้งเตือน'
            ], 400);
        }

        $fcmService = new FCMService();
        
        $result = $fcmService->sendToUser(
            $user,
            'ทดสอบการแจ้งเตือน 🔔',
            'การแจ้งเตือนทำงานปกติ!',
            [
                'type' => 'test',
                'url' => '/dashboard'
            ]
        );

        return response()->json([
            'success' => $result,
            'message' => $result ? 'ส่ง notification สำเร็จ!' : 'ไม่สามารถส่ง notification ได้'
        ]);
    }
}
