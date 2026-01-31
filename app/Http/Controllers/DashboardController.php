<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Account;
use App\Models\Building;
use App\Models\Room;
use App\Models\Keyword;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Fetch Urgent News (Limit 7)
        $urgentNews = Announcement::with(['account:account_id,first_name,last_name', 'building', 'room'])
            ->where('is_urgent', true)
            ->latest()
            ->take(7)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->announcement_id,
                    'title' => $item->title,
                    'desc' => $item->detail,
                    'img' => $item->file ? '/storage/' . $item->file : null, // Ensure /storage/ prefix
                    'date' => $item->created_at->locale('th')->isoFormat('D MMM YYYY'),
                    'is_urgent' => true,
                    'building_name' => $item->building?->building_name,
                    'room_name' => $item->room?->room_name,
                ];
            });

        // 2. Fetch General News (Paginated 4)
        $generalNews = Announcement::with(['account:account_id,first_name,last_name', 'building', 'room'])
            ->where('is_urgent', false)
            ->latest()
            ->paginate(4)
            ->through(function ($item) {
                return [
                    'id' => $item->announcement_id,
                    'title' => $item->title,
                    'desc' => $item->detail,
                    'img' => $item->file ? '/storage/' . $item->file : null,
                    'date' => $item->created_at->locale('th')->isoFormat('D MMM YYYY'),
                    'is_urgent' => false,
                    'building_name' => $item->building?->building_name,
                    'room_name' => $item->room?->room_name,
                ];
            });

        // 3. Admin Statistics (if user is admin)
        $adminStats = null;
        $recentActivity = null;

        if (auth()->user() && auth()->user()->job_admin) {
            $adminStats = [
                'users' => Account::count(),
                'buildings' => Building::count(),
                'rooms' => Room::count(),
                'keywords' => Keyword::count(),
            ];

            // 4. Recent keyword activity
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
        }

        // 5. Fetch Warnings (Keyword Matches)
        $warnings = collect();
        $user = auth()->user();

        if ($user) {
            // 1. If Admin/Staff -> See Global Warnings for their group
            if ($user->job_admin || $user->job_repair || $user->job_complaint) {
                $query = \App\Models\KeywordMatch::where('scope', 'global');

                // Fetch Request data based on type
                // Note: 'request' accessor we added in model might be heavy if not eager loaded properly, 
                // but since it's polymorphic-ish via 'request_id', standard 'with' won't work easily unless we separate relations.
                // We'll trust the model accessor for small volume (limit 5).
                // Or better, eager load both: with(['repair', 'complaint'])
                $query->with(['repair', 'complaint']);

                // Filter by type if not Super Admin
                if (!$user->job_admin) {
                    if ($user->job_repair)
                        $query->where('request_type', 'repair');
                    if ($user->job_complaint)
                        $query->where('request_type', 'complaint');
                }

                $globalWarnings = $query->latest()->take(5)->get();
                $warnings = $warnings->concat($globalWarnings);
            }

            // 2. Personal Warnings (Always see own)
            $personalWarnings = \App\Models\KeywordMatch::where('scope', 'personal')
                ->where('owner_id', $user->account_id)
                ->with(['repair', 'complaint'])
                ->latest()
                ->take(5)
                ->get();

            $warnings = $warnings->concat($personalWarnings)->sortByDesc('created_at')->values();
        }

        return Inertia::render('Dashboard', [
            'urgent_news' => $urgentNews,
            'general_news' => $generalNews,
            'adminStats' => $adminStats,
            'recentActivity' => $recentActivity,
            'warnings' => $warnings // Pass warnings to frontend
        ]);
    }
}
