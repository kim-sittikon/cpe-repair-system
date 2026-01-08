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

        // 2. Filter by Status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // 3. Filter by Priority
        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        // 4. Sorting & Pagination
        $complaints = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($item) {
                return [
                    'id' => 'CM' . str_pad($item->complaint_id, 4, '0', STR_PAD_LEFT),
                    'title' => $item->title,
                    'description' => $item->description,
                    'priority' => $this->mapPriority($item->priority),
                    'status' => $this->mapStatus($item->status),
                    'raw_status' => $item->status,
                    'reporter' => $item->account ? $item->account->name : 'Unknown',
                    'reporter_credit' => $item->account ? $item->account->credit : 0,
                    'created_at' => $item->created_at->locale('th')->isoFormat('D MMM YY HH:mm'),
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
}
