<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    /**
     * Display the Complaint Group Dashboard.
     */
    public function dashboard(Request $request)
    {
        // 1. Stats Cards
        $total = \App\Models\RequestComplaint::count();

        $newToday = \App\Models\RequestComplaint::whereDate('created_at', today())->count();

        // Priority >= 2 is considered Urgent (Normal=1, Urgent=2, Very Urgent=3)
        $urgent = \App\Models\RequestComplaint::where('priority', '>=', 2)
            ->where('status', '!=', 'finished') // Exclude finished
            ->count();

        // Closed in current month
        $closedMonth = \App\Models\RequestComplaint::where('status', 'finished')
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
        $monthlyCounts = \App\Models\RequestComplaint::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
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
        $statusCounts = \App\Models\RequestComplaint::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Defaults if no data
        $pending = $statusCounts['pending'] ?? 0;
        $processing = ($statusCounts['processing'] ?? 0) + ($statusCounts['in_progress'] ?? 0); // Handle potential variations
        $finished = ($statusCounts['finished'] ?? 0) + ($statusCounts['completed'] ?? 0);

        // Calculate percentages or raw values? Recharts handles raw values fine.
        $statusPieData = [
            ['name' => 'รอรับเรื่อง', 'value' => $pending, 'color' => '#3B82F6'], // Blue
            ['name' => 'กำลังดำเนินการ', 'value' => $processing, 'color' => '#F59E0B'], // Amber
            ['name' => 'เสร็จสิ้น', 'value' => $finished, 'color' => '#10B981'], // Emerald
        ];

        // 4. Urgent Complaints Table
        $urgentItems = \App\Models\RequestComplaint::where('priority', '>=', 2)
            ->where('status', '!=', 'finished')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'CM' . str_pad($item->complaint_id, 4, '0', STR_PAD_LEFT),
                    'title' => $item->title,
                    'urgency' => $this->mapPriority($item->priority),
                    'status' => $this->mapStatus($item->status),
                    'raw_status' => $item->status, // For badge logic if needed
                    'created_at' => $item->created_at->locale('th')->isoFormat('D MMMM YYYY HH:mm'),
                ];
            });

        return Inertia::render('Complaint/Dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'statusPieData' => $statusPieData, // New Prop
            'urgentComplaints' => $urgentItems,
        ]);
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

    /**
     * Display the list of complaints.
     */
    /**
     * Display the list of complaints.
     */
    public function index(Request $request)
    {
        $query = \App\Models\RequestComplaint::query();

        // Eager load relationships
        $query->with('account');

        // 1. Search (ID or Title)
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('complaint_id', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%");
            });
        }

        // 2. Filter by Status (Default to 'pending' to show only active complaints)
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

        // Get all personal keyword matches for current user (complaint type)
        $personalMatches = [];
        if ($currentUserId) {
            $personalMatches = \App\Models\KeywordMatch::where('request_type', 'complaint')
                ->where('scope', 'personal')
                ->where('owner_id', $currentUserId)
                ->pluck('request_id')
                ->toArray();
        }

        // 4. Custom Sorting: Priority 3 (Very Urgent) first, then Personal Match, then by date
        if (!empty($personalMatches)) {
            $matchedIdsStr = implode(',', $personalMatches);
            $query->orderByRaw("
                CASE 
                    WHEN priority = 3 THEN 0 
                    WHEN complaint_id IN ({$matchedIdsStr}) THEN 1 
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
        $complaints = $query->paginate(10)
            ->withQueryString()
            ->through(function ($item) use ($personalMatches) {
                return [
                    'id' => 'CM' . str_pad($item->complaint_id, 4, '0', STR_PAD_LEFT),
                    'numeric_id' => $item->complaint_id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'priority' => $this->mapPriority($item->priority),
                    'raw_priority' => $item->priority,
                    'status' => $this->mapStatus($item->status),
                    'raw_status' => $item->status,
                    'reporter' => $item->account ? $item->account->name : 'Unknown',
                    'reporter_credit' => $item->account ? $item->account->credit : 0,
                    'created_at' => $item->created_at->locale('th')->isoFormat('D MMM YY HH:mm'),
                    'hasPersonalMatch' => in_array($item->complaint_id, $personalMatches),
                ];
            });

        return Inertia::render('Complaint/Index', [
            'complaints' => $complaints,
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    /**
     * Display the keyword settings.
     */
    public function keywords(Request $request)
    {
        return Inertia::render('Complaint/Keywords');
    }

    /**
     * แสดงหน้าเปลี่ยนสถานะ
     */
    public function showStatus(Request $request)
    {
        $ids = $request->query('ids', []);
        
        if (empty($ids)) {
            return redirect()->route('complaints.index')
                ->with('error', 'กรุณาเลือกรายการที่ต้องการเปลี่ยนสถานะ');
        }

        if (is_string($ids)) {
            $ids = explode(',', $ids);
        }

        // Extract numeric IDs (CM0001 -> 1)
        $numericIds = array_map(function ($id) {
            return (int) preg_replace('/[^0-9]/', '', $id);
        }, $ids);

        // ดึงข้อมูล complaints พร้อม relations
        $complaints = \App\Models\RequestComplaint::whereIn('complaint_id', $numericIds)
            ->with(['account', 'room', 'building', 'files'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => 'CP' . str_pad($item->complaint_id, 4, '0', STR_PAD_LEFT),
                    'numeric_id' => $item->complaint_id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'status' => $item->status,
                    'status_text' => $this->mapStatus($item->status),
                    'reporter_name' => $item->account ? $item->account->name : 'ไม่ระบุ',
                    'location' => $item->room ? 'ห้อง ' . $item->room->name : ($item->building ? $item->building->name : 'ไม่ระบุ'),
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

        // สถานะที่เลือกได้ (2 ตัวเลือกตาม Figma)
        $statusOptions = [
            ['value' => 'processing', 'label' => 'รับเรื่อง'],
            ['value' => 'finished', 'label' => 'ดำเนินการเสร็จสิ้น'],
        ];

        return Inertia::render('Complaint/Status', [
            'complaints' => $complaints,
            'statusOptions' => $statusOptions,
        ]);
    }

    /**
     * อัปเดตสถานะ
     */
    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer',
            'status' => 'required|in:processing,finished',
        ]);

        $updated = \App\Models\RequestComplaint::whereIn('complaint_id', $validated['ids'])
            ->update(['status' => $validated['status']]);

        return redirect()->route('complaints.index')
            ->with('success', "อัปเดตสถานะเรียบร้อย {$updated} รายการ");
    }

    /**
     * Vote credit for a complaint reporter (thumbs up/down)
     */
    public function voteCredit(Request $request, $complaintId)
    {
        $user = $request->user();
        
        // Permission check: only job_complaint staff or admin can vote
        if (!$user->job_complaint && $user->role !== 'admin') {
            return back()->with('error', 'คุณไม่มีสิทธิ์ให้คะแนน');
        }
        
        $validated = $request->validate([
            'vote' => 'required|in:up,down',
        ]);
        
        $complaint = \App\Models\RequestComplaint::findOrFail($complaintId);
        
        // Check if already voted
        if ($complaint->credited) {
            return back()->with('error', 'ให้คะแนนไปแล้ว');
        }
        
        // Update reporter's credit (limit: -3 to +3)
        $account = $complaint->account;
        if ($account) {
            $change = $validated['vote'] === 'up' ? 1 : -1;
            $newCredit = $account->credit + $change;
            $account->credit = max(-3, min(3, $newCredit)); // Clamp -3 to +3
            $account->save();
        }
        
        // Mark complaint as credited
        $complaint->credited = true;
        $complaint->save();
        
        $message = $validated['vote'] === 'up' ? 'ให้คะแนน +1 เรียบร้อย' : 'ให้คะแนน -1 เรียบร้อย';
        return back()->with('success', $message);
    }
}
