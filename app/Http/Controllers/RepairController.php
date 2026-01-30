<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RequestRepair;
use App\Models\KeywordMatch;

class RepairController extends Controller
{
    /**
     * Display the Repair Group Dashboard.
     */
    public function dashboard(Request $request)
    {
        // 1. Stats Cards
        $total = RequestRepair::count();

        $newToday = RequestRepair::whereDate('created_at', today())->count();

        // Priority = 3 is considered Urgent (Normal=1, Very Urgent=3)
        $urgent = RequestRepair::where('priority', 3)
            ->where('status', '!=', 'finished')
            ->count();

        // Closed in current month
        $closedMonth = RequestRepair::where('status', 'finished')
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->count();

        $stats = [
            'urgent' => $urgent,
            'new_today' => $newToday,
            'closed_month' => $closedMonth,
            'total' => $total,
        ];

        // 2. Line Chart: Monthly Trends (Current Year)
        $monthlyCounts = RequestRepair::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $chartData = [];
        $months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        $currentMonth = now()->month;

        foreach ($months as $index => $name) {
            $monthNum = $index + 1;
            // Set future months to null to "cut" the line instead of dropping to 0
            $value = ($monthNum > $currentMonth) ? null : ($monthlyCounts[$monthNum] ?? 0);

            $chartData[] = [
                'name' => $name,
                'value' => $value
            ];
        }

        // 3. Donut Chart: Status Breakdown
        $statusCounts = RequestRepair::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $pending = $statusCounts['pending'] ?? 0;
        $processing = ($statusCounts['processing'] ?? 0) + ($statusCounts['in_progress'] ?? 0);
        $finished = ($statusCounts['finished'] ?? 0) + ($statusCounts['completed'] ?? 0);

        $statusPieData = [
            ['name' => 'รอรับเรื่อง', 'value' => $pending, 'color' => '#3B82F6'],
            ['name' => 'กำลังดำเนินการ', 'value' => $processing, 'color' => '#F59E0B'],
            ['name' => 'เสร็จสิ้น', 'value' => $finished, 'color' => '#10B981'],
        ];

        // 4. Urgent Repairs Table (only priority = 3)
        $urgentItems = RequestRepair::where('priority', 3)
            ->where('status', '!=', 'finished')
            ->with(['building', 'room', 'account'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'RP' . str_pad($item->repair_id, 4, '0', STR_PAD_LEFT),
                    'numeric_id' => $item->repair_id,
                    'title' => $item->title,
                    'location' => $item->room ? 'ห้อง ' . $item->room->room_name : ($item->building ? $item->building->building_name : 'ไม่ระบุ'),
                    'urgency' => $this->mapPriority($item->priority),
                    'status' => $this->mapStatus($item->status),
                    'raw_status' => $item->status,
                    'reporter' => $item->account ? $item->account->name : 'ไม่ระบุ',
                    'created_at' => $item->created_at->locale('th')->isoFormat('D MMMM YYYY HH:mm'),
                ];
            });

        return Inertia::render('Repair/Dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'statusPieData' => $statusPieData,
            'urgentRepairs' => $urgentItems,
        ]);
    }

    /**
     * Display the list of repairs.
     */
    public function index(Request $request)
    {
        $query = RequestRepair::query();

        // Eager load relationships
        $query->with(['account', 'building', 'room']);

        // 1. Search (ID or Title)
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('repair_id', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        // 2. Filter by Status (Default to 'pending' to show only active repairs)
        $status = $request->status ?? 'pending';
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // 3. Filter by Priority
        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        // Get current user's account_id for personal keyword match check
        $currentUserId = auth()->user()->account_id ?? null;

        // Get all personal keyword matches for current user (repair type)
        $personalMatches = [];
        if ($currentUserId) {
            $personalMatches = KeywordMatch::where('request_type', 'repair')
                ->where('scope', 'personal')
                ->where('owner_id', $currentUserId)
                ->pluck('request_id')
                ->toArray();
        }

        // 4. Custom Sorting: Priority 3 (Very Urgent) first, then Personal Match, then by date
        // We need to use raw SQL with CASE for complex sorting
        if (!empty($personalMatches)) {
            $matchedIdsStr = implode(',', $personalMatches);
            $query->orderByRaw("
                CASE 
                    WHEN priority = 3 THEN 0 
                    WHEN repair_id IN ({$matchedIdsStr}) THEN 1 
                    ELSE 2 
                END ASC,
                created_at DESC
            ");
        } else {
            // No personal matches, just sort by priority then date
            $query->orderByRaw("
                CASE 
                    WHEN priority = 3 THEN 0 
                    ELSE 1 
                END ASC,
                created_at DESC
            ");
        }

        // 5. Pagination
        $repairs = $query->paginate(10)
            ->withQueryString()
            ->through(function ($item) use ($personalMatches) {
                return [
                    'id' => 'RP' . str_pad($item->repair_id, 4, '0', STR_PAD_LEFT),
                    'numeric_id' => $item->repair_id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'location' => $item->room ? 'ห้อง ' . $item->room->room_name : ($item->building ? $item->building->building_name : '-'),
                    'priority' => $this->mapPriority($item->priority),
                    'raw_priority' => $item->priority,
                    'status' => $this->mapStatus($item->status),
                    'raw_status' => $item->status,
                    'reporter' => $item->account ? $item->account->name : 'Unknown',
                    'reporter_credit' => $item->account ? $item->account->credit : 0,
                    'created_at' => $item->created_at->locale('th')->isoFormat('D MMM YY HH:mm'),
                    'hasPersonalMatch' => in_array($item->repair_id, $personalMatches),
                ];
            });

        return Inertia::render('Repair/Index', [
            'repairs' => $repairs,
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    /**
     * Show status change page
     */
    public function showStatus(Request $request)
    {
        $ids = $request->query('ids', []);
        
        if (empty($ids)) {
            return redirect()->route('repairs.index')
                ->with('error', 'กรุณาเลือกรายการที่ต้องการเปลี่ยนสถานะ');
        }

        if (is_string($ids)) {
            $ids = explode(',', $ids);
        }

        // Extract numeric IDs (RP0001 -> 1)
        $numericIds = array_map(function ($id) {
            return (int) preg_replace('/[^0-9]/', '', $id);
        }, $ids);

        $repairs = RequestRepair::whereIn('repair_id', $numericIds)
            ->with(['account', 'room', 'building', 'files'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'RP' . str_pad($item->repair_id, 4, '0', STR_PAD_LEFT),
                    'numeric_id' => $item->repair_id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'status' => $item->status,
                    'status_text' => $this->mapStatus($item->status),
                    'reporter_name' => $item->account ? $item->account->name : 'ไม่ระบุ',
                    'location' => $item->room ? 'ห้อง ' . $item->room->room_name : ($item->building ? $item->building->building_name : 'ไม่ระบุ'),
                    'files' => $item->files->map(function ($file) {
                        $ext = strtolower(pathinfo($file->file_path, PATHINFO_EXTENSION));
                        return [
                            'path' => $file->file_path,
                            'url' => asset('storage/' . $file->file_path),
                            'extension' => $ext,
                            'type' => in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp']) ? 'image' : 
                                      ($ext === 'pdf' ? 'pdf' : 'file'),
                        ];
                    }),
                    'credited' => $item->credited ?? false,
                ];
            });

        $statusOptions = [
            ['value' => 'processing', 'label' => 'รับเรื่อง'],
            ['value' => 'finished', 'label' => 'ดำเนินการเสร็จสิ้น'],
        ];

        return Inertia::render('Repair/Status', [
            'repairs' => $repairs,
            'statusOptions' => $statusOptions,
        ]);
    }

    /**
     * Update status
     */
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer',
            'status' => 'required|in:processing,finished',
        ]);

        $updated = RequestRepair::whereIn('repair_id', $validated['ids'])
            ->update(['status' => $validated['status']]);

        return redirect()->route('repairs.index')
            ->with('success', "อัปเดตสถานะเรียบร้อย {$updated} รายการ");
    }

    /**
     * Vote credit for a repair reporter
     */
    public function voteCredit(Request $request, $repairId)
    {
        $user = $request->user();
        
        if (!$user->job_repair && $user->role !== 'admin') {
            return back()->with('error', 'คุณไม่มีสิทธิ์ให้คะแนน');
        }
        
        $validated = $request->validate([
            'vote' => 'required|in:up,down',
        ]);
        
        $repair = RequestRepair::findOrFail($repairId);
        
        if ($repair->credited) {
            return back()->with('error', 'ให้คะแนนไปแล้ว');
        }
        
        $account = $repair->account;
        if ($account) {
            $change = $validated['vote'] === 'up' ? 1 : -1;
            $newCredit = $account->credit + $change;
            $account->credit = max(-3, min(3, $newCredit));
            $account->save();
        }
        
        $repair->credited = true;
        $repair->save();
        
        $message = $validated['vote'] === 'up' ? 'ให้คะแนน +1 เรียบร้อย' : 'ให้คะแนน -1 เรียบร้อย';
        return back()->with('success', $message);
    }

    private function mapPriority($priority)
    {
        switch ($priority) {
            case 3:
                return 'เร่งด่วนมาก';
            case 2:
                return 'เร่งด่วน';
            default:
                return 'ปกติ';
        }
    }

    private function mapStatus($status)
    {
        switch ($status) {
            case 'pending':
                return 'รอดำเนินการ';
            case 'processing':
                return 'กำลังดำเนินการ';
            case 'in_progress':
                return 'กำลังดำเนินการ';
            case 'finished':
                return 'เสร็จสิ้น';
            case 'completed':
                return 'เสร็จสิ้น';
            case 'canceled':
                return 'ยกเลิก';
            default:
                return $status;
        }
    }
}
