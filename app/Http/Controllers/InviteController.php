<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\UserInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InviteController extends Controller
{
    /**
     * แสดงหน้าฟอร์มตั้งรหัสผ่าน (เมื่อกดลิงก์จากเมล)
     */
    public function show(Request $request, $token)
    {
        $email = $request->query('email');
        
        if (!$email) {
            abort(404, 'Missing email');
        }

        $invitation = UserInvitation::where('email', $email)->first();

        // 1. Check if invitation exists
        if (!$invitation) {
            abort(404, 'Invitation not found');
        }

        // 2. Check Token (Hashed)
        // Note: We need to verify that the token provided in the URL matches the hashed token in DB.
        if (!Hash::check($token, $invitation->token)) {
            abort(403, 'Invalid token');
        }

        // 3. Check if already accepted
        if ($invitation->isAccepted()) {
            return redirect()->route('login')->with('error', 'ลิงก์นี้ถูกใช้งานไปแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านของคุณ');
        }

        // 4. Check if expired
        if ($invitation->isExpired()) {
            return Inertia::render('Auth/InvitationExpired', [ // Ensure this view exists or handling it
                'email' => $invitation->email,
            ]);
        }

        // Success: Show form
        return Inertia::render('Auth/SetPassword', [
            'invitation' => [
                'email' => $invitation->email,
                'role' => $invitation->role,
                'token' => $token, // Pass param token back to form to submit
            ],
        ]);
    }

    /**
     * บันทึกข้อมูลและ Activate Account (Create Account actually)
     */
    public function accept(Request $request)
    {
        // Validate
        $validated = $request->validate([
            'email' => 'required|email|exists:user_invitations,email',
            'token' => 'required',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'password' => 'required|confirmed|min:8',
        ]);

        $invitation = UserInvitation::where('email', $validated['email'])->first();

        // Re-validate everything (Security)
        if (!$invitation || !Hash::check($validated['token'], $invitation->token) || $invitation->isAccepted() || $invitation->isExpired()) {
             return back()->withErrors(['email' => 'Invalid or expired invitation.']);
        }

        // Create Account
        // Note: We need to ensure account doesn't already exist (though Invite logic prevents it, race conditions happen)
        if (Account::where('email', $validated['email'])->exists()) {
             return back()->withErrors(['email' => 'Account already exists.']);
        }

        $account = Account::create([
            'email' => $validated['email'],
            'role' => $invitation->role,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'status' => 'active',
            'password_hash' => Hash::make($validated['password']),
            'verified' => true,
            'job_complaint' => $invitation->permissions['job_complaint'] ?? false,
            'job_repair' => $invitation->permissions['job_repair'] ?? false,
            'job_admin' => $invitation->permissions['job_admin'] ?? false,
            'invited_by' => $invitation->invited_by,
            'invitation_sent_at' => $invitation->created_at,
            'invitation_expires_at' => $invitation->expires_at, // Keep history
        ]);

        // Mark as Accepted
        $invitation->update(['accepted_at' => now()]);

        // Login
        Auth::login($account);

        return redirect()->route('dashboard')->with('success', 'ยินดีต้อนรับเข้าสู่ระบบ!');
    }
}
