<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\FCMController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

// Health Check Endpoint for Monitoring (UptimeRobot, etc.)
Route::get('/health', function () {
    $status = [
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'checks' => []
    ];
    
    // Check Database
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $status['checks']['database'] = 'ok';
    } catch (\Exception $e) {
        $status['checks']['database'] = 'error';
        $status['status'] = 'degraded';
    }
    
    // Check Redis
    try {
        \Illuminate\Support\Facades\Redis::ping();
        $status['checks']['redis'] = 'ok';
    } catch (\Exception $e) {
        $status['checks']['redis'] = 'error';
        $status['status'] = 'degraded';
    }
    
    // Check Disk Space (warning if < 1GB free)
    $freeSpace = disk_free_space('/');
    $status['checks']['disk_free_gb'] = round($freeSpace / 1024 / 1024 / 1024, 2);
    if ($freeSpace < 1024 * 1024 * 1024) {
        $status['checks']['disk'] = 'warning';
        $status['status'] = 'degraded';
    } else {
        $status['checks']['disk'] = 'ok';
    }
    
    return response()->json($status, $status['status'] === 'ok' ? 200 : 503);
});

Route::get('/test-mail', function () {
    try {
        \Illuminate\Support\Facades\Mail::raw('This is a test email from Laravel.', function ($message) {
            $message->to('test@example.com') // Replace with a real email if you can, or better yet, make it dynamic or just check logs if strictly local without outgoing
                    ->subject('Test Email');
        });
        return 'Email sent successfully! Check your inbox.';
    } catch (\Exception $e) {
        return 'Failed to send email: ' . $e->getMessage();
    }
});

Route::middleware(['auth', 'verified'])->group(function () {
    // ============================================================
    // ส่วนที่ทุก Role เข้าถึงได้ (student, teacher, staff, admin)
    // ============================================================
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('report')->name('report.')->group(function () {
        Route::get('/', [App\Http\Controllers\ReportController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\ReportController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\ReportController::class, 'store'])->name('store');
        Route::get('/history', [App\Http\Controllers\ReportController::class, 'history'])->name('history');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Announcements - ดูได้ทุกคน
    Route::get('/announcements', [\App\Http\Controllers\AnnouncementController::class, 'index'])->name('announcements.index');

    // Personal Keywords CRUD - ทุกคนตั้งค่าได้
    Route::name('keywords.personal.')->group(function () {
        Route::post('/keywords/personal', [\App\Http\Controllers\PersonalKeywordController::class, 'store'])->name('store');
        Route::put('/keywords/personal/{id}', [\App\Http\Controllers\PersonalKeywordController::class, 'update'])->name('update');
        Route::delete('/keywords/personal/{id}', [\App\Http\Controllers\PersonalKeywordController::class, 'destroy'])->name('destroy');
    });

    // FCM Push Notification Routes - ทุกคนใช้ได้
    Route::prefix('fcm')->name('fcm.')->group(function () {
        Route::post('/token', [FCMController::class, 'storeToken'])->name('token.store');
        Route::delete('/token', [FCMController::class, 'removeToken'])->name('token.remove');
        Route::get('/status', [FCMController::class, 'getStatus'])->name('status');
        Route::post('/test', [FCMController::class, 'sendTest'])->name('test');
    });

    // Badge count for PWA Badging API - ทุกคนใช้ได้
    Route::get('/api/pending-count', function () {
        $user = auth()->user();
        if (!$user) return response()->json(['count' => 0]);
        
        $count = 0;
        
        // Count pending items based on user role
        if ($user->job_repair) {
            $count += \App\Models\RequestRepair::where('status', 'pending')->count();
        }
        if ($user->job_complaint) {
            $count += \App\Models\RequestComplaint::where('status', 'pending')->count();
        }
        
        return response()->json(['count' => $count]);
    })->name('pending.count');

    Route::get('/job', function () {
        return Inertia::render('Job/Index'); // Stub
    })->name('job.index');

    // ============================================================
    // กลุ่มงานแจ้งซ่อม (Repair) — ต้องไม่เป็น student + ต้องมี job_repair
    // ============================================================
    Route::middleware(['role:admin,staff,teacher', 'permission:job_repair'])->group(function () {
        Route::prefix('repairs')->name('repairs.')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\RepairController::class, 'dashboard'])->name('dashboard');
            Route::get('/list', [\App\Http\Controllers\RepairController::class, 'index'])->name('index');
            Route::get('/status', [\App\Http\Controllers\RepairController::class, 'showStatus'])->name('status');
            Route::patch('/status', [\App\Http\Controllers\RepairController::class, 'updateStatus'])->name('status.update');
            Route::post('/credit/{id}', [\App\Http\Controllers\RepairController::class, 'voteCredit'])->name('credit.vote');
            Route::get('/keywords', [\App\Http\Controllers\PersonalKeywordController::class, 'indexRepair'])->name('keywords');
            
            // Job routes
            Route::get('/jobs/my', [\App\Http\Controllers\JobController::class, 'myJobs'])->name('jobs.my');
            Route::get('/jobs/create', [\App\Http\Controllers\JobController::class, 'create'])->name('jobs.create');
            Route::post('/jobs', [\App\Http\Controllers\JobController::class, 'store'])->name('jobs.store');
            Route::get('/jobs', [\App\Http\Controllers\JobController::class, 'index'])->name('jobs.index');
            Route::get('/jobs/{id}', [\App\Http\Controllers\JobController::class, 'show'])->name('jobs.show');
            Route::post('/jobs/step/{id}', [\App\Http\Controllers\JobController::class, 'updateStep'])->name('jobs.step.update');
        });
    });

    // ============================================================
    // กลุ่มงานร้องเรียน (Complaint) — ต้องไม่เป็น student + ต้องมี job_complaint
    // ============================================================
    Route::middleware(['role:admin,staff,teacher', 'permission:job_complaint'])->group(function () {
        Route::prefix('complaints')->name('complaints.')->group(function () {
            Route::get('/dashboard', [App\Http\Controllers\ComplaintController::class, 'dashboard'])->name('dashboard');
            Route::get('/list', [App\Http\Controllers\ComplaintController::class, 'index'])->name('index');
            Route::get('/status', [App\Http\Controllers\ComplaintController::class, 'showStatus'])->name('status');
            Route::patch('/status', [App\Http\Controllers\ComplaintController::class, 'updateStatus'])->name('status.update');
            Route::post('/credit/{id}', [App\Http\Controllers\ComplaintController::class, 'voteCredit'])->name('credit.vote');
            Route::get('/keywords', [\App\Http\Controllers\PersonalKeywordController::class, 'indexComplaint'])->name('keywords');
        });
    });

    // ============================================================
    // ผู้ดูแลระบบ (Admin) — ต้องไม่เป็น student + ต้องมี job_admin
    // ============================================================
    Route::middleware(['role:admin,staff,teacher', 'permission:job_admin'])->group(function () {
        Route::get('/admin', [App\Http\Controllers\AdminDashboardController::class, 'index'])->name('admin.index');

        Route::prefix('admin')->name('admin.')->group(function () {
            // Locations (Buildings & Rooms)
            Route::get('/locations', [App\Http\Controllers\AdminLocationController::class, 'index'])->name('locations.index');
            Route::post('/buildings', [App\Http\Controllers\AdminLocationController::class, 'storeBuilding'])->name('buildings.store');
            Route::delete('/buildings/{id}', [App\Http\Controllers\AdminLocationController::class, 'destroyBuilding'])->name('buildings.destroy');
            Route::post('/rooms', [App\Http\Controllers\AdminLocationController::class, 'storeRoom'])->name('rooms.store');
            Route::put('/rooms/{id}', [App\Http\Controllers\AdminLocationController::class, 'updateRoom'])->name('rooms.update');
            Route::delete('/rooms/{id}', [App\Http\Controllers\AdminLocationController::class, 'destroyRoom'])->name('rooms.destroy');

            // Keywords
            Route::get('/keywords', [App\Http\Controllers\AdminKeywordController::class, 'index'])->name('keywords.index');
            Route::post('/keywords', [App\Http\Controllers\AdminKeywordController::class, 'store'])->name('keywords.store');
            Route::put('/keywords/{id}', [App\Http\Controllers\AdminKeywordController::class, 'update'])->name('keywords.update');
            Route::delete('/keywords/{id}', [App\Http\Controllers\AdminKeywordController::class, 'destroy'])->name('keywords.destroy');

            // User Management
            Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
            Route::get('/users/invite', [AdminUserController::class, 'create'])->name('users.invite');
            Route::post('/users/invite', [AdminUserController::class, 'invite'])->name('users.invite.send');
            Route::post('/users/bulk', [AdminUserController::class, 'bulkStore'])->name('users.bulk');
            Route::post('/users/{id}/resend', [AdminUserController::class, 'resend'])->name('users.resend');
            Route::delete('/users/{id}/cancel', [AdminUserController::class, 'cancel'])->name('users.cancel');
            
            // Suspension Management
            Route::get('/users/{id}/suspend', [AdminUserController::class, 'suspend'])->name('users.suspend');
            Route::post('/users/{id}/suspend', [AdminUserController::class, 'storeSuspension'])->name('users.suspend.store');
            Route::post('/users/{id}/unsuspend', [AdminUserController::class, 'unsuspend'])->name('users.unsuspend');
            
            // Edit User
            Route::get('/users/{id}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
            Route::patch('/users/{id}', [AdminUserController::class, 'update'])->name('users.update');
        });
    });

    // ============================================================
    // Announcements สร้าง/แก้/ลบ — ต้องเป็น Staff ขึ้นไป (ไม่ใช่ student)
    // ============================================================
    Route::middleware(['role:admin,staff,teacher'])->group(function () {
        Route::get('/announcements/create', [\App\Http\Controllers\AnnouncementController::class, 'create'])->name('announcements.create');
        Route::post('/announcements', [\App\Http\Controllers\AnnouncementController::class, 'store'])->name('announcements.store');
        Route::delete('/announcements/{id}', [\App\Http\Controllers\AnnouncementController::class, 'destroy'])->name('announcements.destroy');
        Route::post('/announcements/{id}', [\App\Http\Controllers\AnnouncementController::class, 'update'])->name('announcements.update');
    });
});

// Guest Routes (Invitation Acceptance)
Route::middleware('guest')->group(function () {
    Route::get('/invite/{token}', [InviteController::class, 'show'])->name('invite.show');
    Route::post('/invite/accept', [InviteController::class, 'accept'])->name('invite.accept');
});

// Public Legal Pages (no auth required)
Route::get('/privacy-policy', function () {
    return Inertia::render('Legal/PrivacyPolicy');
})->name('privacy.policy');

// OTP Status Check (for async polling)
Route::get('/otp-status/{requestId}', function ($requestId, \Illuminate\Http\Request $request) {
    $status = \App\Services\EmailService::getOtpStatus($requestId, $request->query('email'));
    return response()->json($status);
})->name('otp.status');

require __DIR__ . '/auth.php';
