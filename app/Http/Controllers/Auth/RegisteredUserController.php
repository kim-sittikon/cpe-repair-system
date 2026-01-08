<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . \App\Models\Account::class, 'regex:/@mail\.rmutt\.ac\.th$/i'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'otp' => 'required|numeric',
            'terms' => 'accepted',
        ]);

        // Verify OTP (Same as before)
        $otpCacheKey = 'otp_' . $request->email;
        $attemptCacheKey = 'otp_attempts_' . $request->email;

        $cachedOtp = \Illuminate\Support\Facades\Cache::get($otpCacheKey);
        $attempts = \Illuminate\Support\Facades\Cache::get($attemptCacheKey, 0);

        if (!$cachedOtp) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'otp' => ['รหัส OTP หมดอายุหรือยังไม่ได้ขอรหัส'],
            ]);
        }

        if ($attempts >= 3) {
            \Illuminate\Support\Facades\Cache::forget($otpCacheKey);
            \Illuminate\Support\Facades\Cache::forget($attemptCacheKey);
            throw \Illuminate\Validation\ValidationException::withMessages([
                'otp' => ['คุณกรอกรหัสผิดเกินจำนวนครั้งที่กำหนด กรุณาขอรหัสใหม่'],
            ]);
        }

        if ($cachedOtp != $request->otp) {
            \Illuminate\Support\Facades\Cache::increment($attemptCacheKey);
            throw \Illuminate\Validation\ValidationException::withMessages([
                'otp' => ['รหัส OTP ไม่ถูกต้อง (เหลือโอกาสอีก ' . (2 - $attempts) . ' ครั้ง)'],
            ]);
        }

        // Clear OTP & Attempts upon success
        \Illuminate\Support\Facades\Cache::forget($otpCacheKey);
        \Illuminate\Support\Facades\Cache::forget($attemptCacheKey);

        $user = \App\Models\Account::create([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password),
            'role' => 'student',
            'status' => 'active',
            'job_complaint' => false, // Student cannot access Complaint Group menu
            'verified' => true, // Email verified via OTP
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    /**
     * Send OTP to the user's email.
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . \App\Models\Account::class, 'regex:/@mail\.rmutt\.ac\.th$/i'],
        ]);

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Cache OTP for 5 minutes
        \Illuminate\Support\Facades\Cache::forget('otp_' . $request->email); // Clear old first
        \Illuminate\Support\Facades\Cache::put('otp_' . $request->email, $otp, now()->addMinutes(5));

        // Send Email
        \Illuminate\Support\Facades\Mail::to($request->email)->send(new \App\Mail\OtpMail($otp));

        return response()->json(['message' => 'ส่งรหัส OTP เรียบร้อยแล้ว']);
    }
}
