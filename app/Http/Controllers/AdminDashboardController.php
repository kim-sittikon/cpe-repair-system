<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Building;
use App\Models\Room;
use App\Models\Keyword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard
     */
    public function index()
    {
        // 1. Fetch statistics
        $stats = [
            'users' => Account::count(),
            'buildings' => Building::count(),
            'rooms' => Room::count(),
            'keywords' => Keyword::count(),
        ];

        // 2. Activity Chart Data (Last 7 days)
        $chartData_activity = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = Keyword::withTrashed()
                ->whereDate('updated_at', $date->format('Y-m-d'))
                ->count();

            $chartData_activity[] = [
                'date' => $date->format('d M'),
                'count' => $count,
            ];
        }

        // 3. Distribution Chart Data (Keyword types)
        $repairCount = Keyword::where('type', 'repair')->count();
        $complaintCount = Keyword::where('type', 'complaint')->count();

        $chartData_distribution = [
            [
                'name' => 'แจ้งซ่อม',
                'value' => $repairCount,
                'color' => '#3b82f6',
            ],
            [
                'name' => 'ร้องเรียน',
                'value' => $complaintCount,
                'color' => '#10b981',
            ],
        ];

        // 4. User Activity Chart - Empty data (backend removed)
        $chartData_userActivity = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $chartData_userActivity[] = [
                'month' => $date->locale('th')->format('M'),
                'users' => 0, // No data - backend removed
            ];
        }

        // 5. Recent keyword activity (with names)
        $recentActivity = Keyword::with(['creator', 'editor', 'deleter'])
            ->withTrashed()
            ->orderBy('updated_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($keyword) {
                // Determine action type
                $action = 'updated';
                $actor = null;

                if ($keyword->deleted_at) {
                    $action = 'deleted';
                    $actor = $keyword->deleter;
                } elseif ($keyword->created_at->equalTo($keyword->updated_at)) {
                    $action = 'created';
                    $actor = $keyword->creator;
                } else {
                    $action = 'updated';
                    $actor = $keyword->editor ?? $keyword->creator;
                }

                return [
                    'id' => $keyword->id,
                    'action' => $action,
                    'keyword' => $keyword->keyword,
                    'type' => $keyword->type,
                    'actor_name' => $actor ? $actor->name : 'Unknown',
                    'time' => $keyword->updated_at->diffForHumans(),
                    'timestamp' => $keyword->updated_at,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'chartData_activity' => $chartData_activity,
            'chartData_distribution' => $chartData_distribution,
            'chartData_userActivity' => $chartData_userActivity,
            'recentActivity' => $recentActivity,
        ]);
    }
}
