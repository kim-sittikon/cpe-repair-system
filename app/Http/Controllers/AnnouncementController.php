<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Building;
use App\Traits\ImageUploadTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    use ImageUploadTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 1. Fetch Urgent News (Max 7)
        $urgentNews = Announcement::with('account')
            ->where('is_urgent', true)
            ->latest()
            ->take(7)
            ->get();

        // 2. Fetch General News (Paginated, excluding Urgent if needed, or just all)
        // Usually, 'All News' section might include urgent ones too, or exclude them.
        // Let's exclude urgent ones from the "General List" to avoid duplication if desired,
        // OR just show everything. User requirement implies "General" list is below.
        // Let's show *non-urgent* in the general list to be distinct.
        $generalNews = Announcement::with('account')
            ->where('is_urgent', false)
            ->latest()
            ->paginate(10);

        // API Response for JSON calls (e.g. from React Frontend)
        if ($request->wantsJson()) {
            return response()->json([
                'urgent' => $urgentNews,
                'general' => $generalNews
            ]);
        }

        // View Response (if accessing via direct route)
        return Inertia::render('Announcement/Index', [
            'urgentNews' => $urgentNews,
            'generalNews' => $generalNews
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $latestAnnouncements = Announcement::latest()->paginate(10)->through(function ($news) {
            return [
                'id' => $news->announcement_id,
                'title' => $news->title,
                'detail' => $news->detail,
                'is_urgent' => $news->is_urgent,
                'image' => $news->file,
                'building_id' => $news->building_id,
                'room_id' => $news->room_id,
                'created_at' => $news->created_at,
            ];
        });

        // Get buildings with their rooms for location selector
        $buildings = Building::with('rooms')->get()->map(function ($building) {
            return [
                'id' => $building->building_id,
                'name' => $building->building_name,
                'rooms' => $building->rooms->map(function ($room) {
                    return [
                        'id' => $room->room_id,
                        'name' => $room->room_name,
                    ];
                }),
            ];
        });

        return Inertia::render('Announcement/Create', [
            'latestAnnouncements' => $latestAnnouncements,
            'buildings' => $buildings,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'detail' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // 2MB Max
            'is_urgent' => 'boolean',
            'building_id' => 'nullable|exists:building,building_id',
            'room_id' => 'nullable|exists:room,room_id',
        ]);

        $user = auth()->user();
        $isUrgent = $request->boolean('is_urgent');

        // --- URGENT LIMIT LOGIC (Auto-Downgrade) ---
        if ($isUrgent) {
            $urgentCount = Announcement::where('is_urgent', true)->count();
            if ($urgentCount >= 7) {
                // Find the OLDEST urgent news
                $oldestUrgent = Announcement::where('is_urgent', true)
                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($oldestUrgent) {
                    $oldestUrgent->update(['is_urgent' => false]);
                }
            }
        }

        // --- IMAGE UPLOAD (Using Trait) ---
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->uploadImage($request->file('image'), 'uploads/announcements');
        }

        Announcement::create([
            'title' => $request->title,
            'detail' => $request->detail,
            'is_urgent' => $isUrgent,
            'file' => $imagePath, // Use 'file' column as per schema
            'account_id' => $user->account_id,
            'building_id' => $request->building_id,
            'room_id' => $request->room_id,
        ]);

        return redirect()->back()->with('success', 'ประกาศข่าวเรียบร้อยแล้ว');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'detail' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_urgent' => 'boolean',
            'building_id' => 'nullable|exists:building,building_id',
            'room_id' => 'nullable|exists:room,room_id',
        ]);

        $announcement = Announcement::findOrFail($id);
        $isUrgent = $request->boolean('is_urgent');

        // --- URGENT LIMIT LOGIC (Auto-Downgrade) ---
        if ($isUrgent && !$announcement->is_urgent) {
            $urgentCount = Announcement::where('is_urgent', true)->count();
            if ($urgentCount >= 7) {
                $oldestUrgent = Announcement::where('is_urgent', true)
                    ->orderBy('created_at', 'asc')
                    ->first();
                if ($oldestUrgent) {
                    $oldestUrgent->update(['is_urgent' => false]);
                }
            }
        }

        // --- IMAGE UPLOAD ---
        $updateData = [
            'title' => $request->title,
            'detail' => $request->detail,
            'is_urgent' => $isUrgent,
            'building_id' => $request->building_id,
            'room_id' => $request->room_id,
        ];

        if ($request->hasFile('image')) {
            $updateData['file'] = $this->uploadImage($request->file('image'), 'uploads/announcements');
        }

        $announcement->update($updateData);

        return redirect()->back()->with('success', 'แก้ไขประกาศเรียบร้อยแล้ว');
    }

    /**
     * Remove the specified resource from storage (Soft Delete).
     */
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete(); // Soft Delete

        return redirect()->back()->with('success', 'ลบข่าวเรียบร้อยแล้ว');
    }
}
