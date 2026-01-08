<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\UserInvitation;
use App\Mail\UserInvitationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * แสดงหน้าฟอร์มเชิญผู้ใช้ใหม่
     */
    public function index()
    {
        $pendingUsers = UserInvitation::whereNull('accepted_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($invite) {
                // Determine permissions for frontend display
                $permissions = $invite->permissions ?? [];

                return [
                    'account_id' => $invite->id, // Use invitation ID as account_id for frontend compatibility
                    'email' => $invite->email,
                    'role' => $invite->role,
                    'first_name' => 'Invited',
                    'last_name' => 'User',
                    'invitation_sent_at' => $invite->created_at,
                    'invitation_expires_at' => $invite->expires_at,
                    'job_repair' => $permissions['job_repair'] ?? false,
                    'job_admin' => $permissions['job_admin'] ?? false,
                    'job_complaint' => $permissions['job_complaint'] ?? false,
                ];
            });

        return Inertia::render('Admin/UserList', [
            'activeUsers' => Account::active()->orderBy('created_at', 'desc')->get(),
            'pendingUsers' => $pendingUsers,
        ]);
    }

    public function create()
    {
        // Fetch recent invites for history
        $recentInvites = UserInvitation::where('invited_by', auth()->id())
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($invite) {
                return [
                    'account_id' => $invite->id, // Mapped for frontend compatibility
                    'email' => $invite->email,
                    'role' => $invite->role,
                    'created_at' => $invite->created_at, // For consistent raw data if needed
                    'invitation_sent_at' => $invite->created_at, // For frontend display compatibility
                    'status' => $invite->isAccepted() ? 'active' : ($invite->isExpired() ? 'expired' : 'pending'), // Lowercase to match badge logic if any, though frontend showed Mixed case. Frontend uses 'active'/'pending' checks.
                ];
            });

        return Inertia::render('Admin/InviteUser', [
            'recentInvites' => $recentInvites
        ]);
    }

    public function invite(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:accounts,email|unique:user_invitations,email',
            'role' => 'required|in:admin,staff,teacher,student',
            'job_repair' => 'boolean',
            'job_admin' => 'boolean',
            'job_complaint' => 'boolean',
        ]);

        $token = Str::random(60);

        $invitation = UserInvitation::create([
            'email' => $validated['email'],
            'token' => Hash::make($token), // Hash token for security
            'role' => $validated['role'],
            'permissions' => [
                'job_repair' => $validated['job_repair'] ?? false,
                'job_admin' => $validated['job_admin'] ?? false,
                'job_complaint' => $validated['job_complaint'] ?? true, // Default to true based on assumed logic
            ],
            'invited_by' => auth()->id(),
            'expires_at' => now()->addHours(72), // 72 hours per plan
        ]);

        $this->sendInvitationEmail($invitation, $token);

        return back()->with('success', 'ส่งคำเชิญเรียบร้อยแล้ว');
    }

    public function resend($id)
    {
        $invitation = UserInvitation::whereNull('accepted_at')->findOrFail($id);

        // Update timestamp to invalidate old links (since we check expiration)
        // Note: Token remains same but we extend expiration
        $invitation->update(['expires_at' => now()->addHours(72)]);
        
        // We need to generate a NEW token because we cannot retrieve the old hashed one
        // and send it. If we don't change token, we can't send email with link.
        // So we MUST generate new token.
        $newToken = Str::random(60);
        $invitation->update(['token' => Hash::make($newToken)]);

        $this->sendInvitationEmail($invitation, $newToken);

        return back()->with('success', 'ส่งคำเชิญซ้ำเรียบร้อยแล้ว');
    }

    public function cancel($id)
    {
        $invitation = UserInvitation::whereNull('accepted_at')->findOrFail($id);
        $invitation->delete();

        return back()->with('success', 'ยกเลิกคำเชิญเรียบร้อยแล้ว');
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $file = $request->file('file');
        $fileContents = file($file->getPathname());
        $count = 0;

        foreach ($fileContents as $line) {
            $data = str_getcsv($line);
            if (empty($data[0]))
                continue; // Skip empty lines

            // CSV Format: email,role (optional)
            $email = trim($data[0]);
            $role = isset($data[1]) ? trim($data[1]) : 'student'; // Default role

            // Skip invalid email format
            if (!filter_var($email, FILTER_VALIDATE_EMAIL))
                continue;

            // Check if email already exists
            if (Account::where('email', $email)->exists() || UserInvitation::where('email', $email)->exists())
                continue;

            $token = Str::random(60);
            
            $invitation = UserInvitation::create([
                'email' => $email,
                'token' => Hash::make($token),
                'role' => $role,
                'permissions' => [
                    'job_repair' => in_array($role, ['staff', 'admin']),
                    'job_admin' => $role === 'admin',
                    'job_complaint' => true,
                ],
                'invited_by' => auth()->id(),
                'expires_at' => now()->addHours(72),
            ]);

            $this->sendInvitationEmail($invitation, $token);
            $count++;
        }

        return back()->with('success', "นำเข้าและส่งคำเชิญเรียบร้อยแล้ว $count รายการ");
    }

    private function sendInvitationEmail($invitation, $token)
    {
        // Link to /invite/{token}?email=...
        // Token is part of URL path usually: /invite/{token}
        // We need to pass the PLAIN token here.
        
        // Ideally we sign the route too, but if using token in DB, maybe just token is enough?
        // Plan says: /invite/{token} checks token in DB.
        
        $url = route('invite.show', ['token' => $token, 'email' => $invitation->email]);

        Mail::to($invitation->email)->send(
            new UserInvitationMail($url, $invitation->role)
        );
    }
}
