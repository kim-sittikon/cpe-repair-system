<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

class ReportController extends Controller
{
    use \App\Traits\ImageUploadTrait;

    public function index(Request $request)
    {
        $user = auth()->user();

        // Fetch Warnings (Keyword Matches)
        $warnings = collect();

        // 1. If Admin/Staff -> See Global Warnings for their group
        if ($user->job_admin || $user->job_repair || $user->job_complaint) {
            $query = \App\Models\KeywordMatch::where('scope', 'global')->with('request'); // Assuming relation

            // Filter by type if not Super Admin (logic can be refined)
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
            ->latest()
            ->take(5)
            ->get();

        $warnings = $warnings->concat($personalWarnings)->sortByDesc('created_at')->values();

        return Inertia::render('Report/Index', [
            'warnings' => $warnings
        ]); // Redirecting to Index as per original code, but passing data
    }

    public function create()
    {
        // Fetch locations for dropdown
        $buildings = \App\Models\Building::with('rooms')->get();
        return Inertia::render('Report/Create', [
            'buildings' => $buildings
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:repair,complaint',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location_id' => 'required_if:type,repair|nullable|exists:building,building_id',
            'room' => 'nullable|string|max:255',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240'
        ]);

        $user = auth()->user();
        $room_id = null;

        // 1. Resolve Room (Only if repair and location is provided)
        if ($request->type === 'repair' && $request->location_id) {
            $room = \App\Models\Room::firstOrCreate(
                [
                    'room_name' => $request->room ?? '-',
                    'building_id' => $request->location_id
                ],
                [
                    'account_id' => $user->account_id
                ]
            );
            $room_id = $room->room_id;
        }

        $requestModel = null;
        $message = '';

        // 2. Create Request (Repair or Complaint)
        if ($request->type === 'repair') {
            $requestModel = \App\Models\RequestRepair::create([
                'title' => $request->title,
                'description' => $request->description,
                'status' => 'pending',
                'priority' => 1,
                'account_id' => $user->account_id,
                'building_id' => $request->location_id,
                'room_id' => $room_id,
            ]);
            $message = 'Repair request submitted successfully.';
        } else {
            $requestModel = \App\Models\RequestComplaint::create([
                'title' => $request->title,
                'description' => $request->description,
                'status' => 'pending',
                'priority' => 1,
                'account_id' => $user->account_id,
                // Complaints might not have specific building/room, or optional
            ]);
            $message = 'Complaint submitted successfully.';
        }

        // --- KEYWORD DETECTION (ASYNC QUEUE) ---
        // Dispatch Job to process keywords in background
        // Use afterCommit() to ensure DB record exists before Worker picks it up
        \App\Jobs\ProcessKeywordDetection::dispatch($requestModel, $request->type)->afterCommit();

        // 3. Handle File Uploads (Using ImageUploadTrait)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Ensure the trait handles the upload, resize, and encoding
                $path = $this->uploadImage($image, 'uploads/reports');

                if ($path) {
                    if ($request->type === 'repair') {
                        \App\Models\FileRepair::create([
                            'repair_id' => $requestModel->repair_id,
                            'file_name' => basename($path), // Get generated filename
                            'file_path' => $path,
                            'uploaded_at' => now()
                        ]);
                    } else {
                        \App\Models\FileComplaint::create([
                            'complaint_id' => $requestModel->complaint_id,
                            'file_name' => basename($path),
                            'file_path' => $path,
                            'uploaded_at' => now()
                        ]);
                    }
                }
            }
        }

        return redirect()->route('dashboard')->with('success', $message);
    }

    public function history(Request $request)
    {
        $user = auth()->user();

        // Fetch Repairs
        $repairs = \App\Models\RequestRepair::where('account_id', $user->account_id)
            ->with(['building', 'room'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->type = 'repair';
                return $item;
            });

        // Fetch Complaints
        $complaints = \App\Models\RequestComplaint::where('account_id', $user->account_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                $item->type = 'complaint';
                return $item;
            });

        // Merge and Sort
        $history = $repairs->concat($complaints)->sortByDesc('created_at')->values();

        return Inertia::render('Report/History', [
            'history' => $history
        ]);
    }
}
