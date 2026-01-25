<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\InviteController;
use App\Http\Controllers\AdminUserController;
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
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('report')->name('report.')->group(function () {
        Route::get('/', [App\Http\Controllers\ReportController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\ReportController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\ReportController::class, 'store'])->name('store');
        Route::get('/history', [App\Http\Controllers\ReportController::class, 'history'])->name('history');
    });

    Route::prefix('repair')->name('repair.')->group(function () {
        // ... other repair routes if any ...
        Route::get('/keywords', [\App\Http\Controllers\PersonalKeywordController::class, 'indexRepair'])->name('keywords');
    });

    Route::get('/job', function () {
        return Inertia::render('Job/Index'); // Stub
    })->name('job.index');

    // Complaint Routes
    Route::prefix('complaints')->name('complaints.')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\ComplaintController::class, 'dashboard'])->name('dashboard');
        Route::get('/list', [App\Http\Controllers\ComplaintController::class, 'index'])->name('index');
        Route::get('/keywords', [\App\Http\Controllers\PersonalKeywordController::class, 'indexComplaint'])->name('keywords');
    });

    Route::get('/admin', [App\Http\Controllers\AdminDashboardController::class, 'index'])->name('admin.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
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

    });

    // Announcements (News) - Moved out of admin prefix to be widely accessible
    Route::get('/announcements', [\App\Http\Controllers\AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/announcements/create', [\App\Http\Controllers\AnnouncementController::class, 'create'])->name('announcements.create');
    Route::post('/announcements', [\App\Http\Controllers\AnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('/announcements/{id}', [\App\Http\Controllers\AnnouncementController::class, 'destroy'])->name('announcements.destroy');
    // Personal Keywords CRUD
    Route::name('keywords.personal.')->group(function () {
        Route::post('/keywords/personal', [\App\Http\Controllers\PersonalKeywordController::class, 'store'])->name('store');
        Route::put('/keywords/personal/{id}', [\App\Http\Controllers\PersonalKeywordController::class, 'update'])->name('update');
        Route::delete('/keywords/personal/{id}', [\App\Http\Controllers\PersonalKeywordController::class, 'destroy'])->name('destroy');
    });
});

// Guest Routes (Invitation Acceptance)
Route::middleware('guest')->group(function () {
    Route::get('/invite/{token}', [InviteController::class, 'show'])->name('invite.show');
    Route::post('/invite/accept', [InviteController::class, 'accept'])->name('invite.accept');
});

require __DIR__ . '/auth.php';
