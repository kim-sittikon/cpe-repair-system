<?php

namespace App\Http\Controllers;

use App\Models\Keyword;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonalKeywordController extends Controller
{
    /**
     * Show Repair Keywords (Personal)
     */
    public function indexRepair(Request $request)
    {
        return $this->commonIndex($request, 'repair');
    }

    /**
     * Show Complaint Keywords (Personal)
     */
    public function indexComplaint(Request $request)
    {
        return $this->commonIndex($request, 'complaint');
    }

    /**
     * Common logic for rendering the view
     */
    private function commonIndex(Request $request, $type)
    {
        $user = auth()->user();
        $search = $request->input('search');

        // Fetch Personal Keywords (Editable) - Keep all for now or paginate if needed? 
        // User mainly complained about Global list being long. Let's keep Personal as get() for now unless specified.
        $personalKeywords = Keyword::where('type', $type)
            ->where('scope', 'personal')
            ->where('creator_id', $user->account_id)
            ->when($search, function ($query, $search) {
                // Optional: also filter personal keywords by same search term client-side or server-side?
                // The prompt implies singular search bar. Let's filter both server-side if possible,
                // OR let client handle Personal (since it's small) and server handle Global.
                // CURRENTLY: PersonalIndex has one search bar.
                // Let's filter Personal server-side too to be consistent.
                return $query->where('keyword', 'like', "%{$search}%");
            })
            ->orderBy('keyword')
            ->get();

        // Fetch Global Keywords (Read-Only) - Paginated
        $globalKeywords = Keyword::where('type', $type)
            ->where('scope', 'global')
            ->when($search, function ($query, $search) {
                return $query->where('keyword', 'like', "%{$search}%");
            })
            ->orderBy('keyword')
            ->paginate(15)
            ->withQueryString(); // Keep search params in links

        return Inertia::render('Keywords/PersonalIndex', [
            'personalKeywords' => $personalKeywords,
            'globalKeywords' => $globalKeywords,
            'group' => $type, // 'repair' or 'complaint'
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a new personal keyword
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:repair,complaint',
            'keyword' => 'required|string|max:255',
        ]);

        $user = auth()->user();

        // Check for duplicate (Any scope: Global or Personal, including soft-deleted)
        // Since the DB has unique(type, keyword), we must check withTrashed()
        $existingKeyword = Keyword::withTrashed()
            ->where('type', $validated['type'])
            ->where('keyword', $validated['keyword'])
            ->first();

        if ($existingKeyword) {
            // If it's a soft-deleted personal keyword owned by this user, restore it
            if ($existingKeyword->trashed() && $existingKeyword->scope === 'personal' && $existingKeyword->creator_id === $user->account_id) {
                $existingKeyword->restore();
                $existingKeyword->update([
                    'deleter_id' => null,
                    'editor_id' => null,
                ]);

                // Cache Invalidation
                \Illuminate\Support\Facades\Cache::forget("keywords_personal_{$validated['type']}");

                return back()->with('success', 'เพิ่มคีย์เวิร์ดส่วนตัวเรียบร้อย');
            }

            // If it's a soft-deleted record but not owned by this user, or still active
            if (!$existingKeyword->trashed()) {
                // Check if it is global to give specific message
                if ($existingKeyword->scope === 'global') {
                    return back()->withErrors(['keyword' => 'คำนี้มีอยู่ใน "คีย์เวิร์ดกลาง" แล้ว ไม่จำเป็นต้องเพิ่ม']);
                }

                return back()->withErrors(['keyword' => 'คุณมีคีย์เวิร์ดนี้อยู่แล้ว']);
            }

            // Soft-deleted but belongs to someone else or is global
            return back()->withErrors(['keyword' => 'ไม่สามารถเพิ่มคีย์เวิร์ดนี้ได้ เนื่องจากมีอยู่ในระบบแล้ว']);
        }

        Keyword::create([
            'type' => $validated['type'],
            'scope' => 'personal',
            'keyword' => $validated['keyword'],
            'creator_id' => $user->account_id,
        ]);

        // Cache Invalidation
        \Illuminate\Support\Facades\Cache::forget("keywords_personal_{$validated['type']}");

        return back()->with('success', 'เพิ่มคีย์เวิร์ดส่วนตัวเรียบร้อย');
    }

    /**
     * Update a personal keyword
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();

        // Ensure ownership
        $keyword = Keyword::where('id', $id)
            ->where('creator_id', $user->account_id)
            ->where('scope', 'personal')
            ->firstOrFail();

        $validated = $request->validate([
            'keyword' => 'required|string|max:255',
        ]);

        // Check duplicate (Any scope, excluding self, including soft-deleted)
        $existingKeyword = Keyword::withTrashed()
            ->where('type', $keyword->type)
            ->where('keyword', $validated['keyword'])
            ->where('id', '!=', $id)
            ->first();

        if ($existingKeyword) {
            if (!$existingKeyword->trashed()) {
                // Check if it is global
                if ($existingKeyword->scope === 'global') {
                    return back()->withErrors(['keyword' => 'คำนี้มีอยู่ใน "คีย์เวิร์ดกลาง" แล้ว ไม่จำเป็นต้องเพิ่ม']);
                }

                return back()->withErrors(['keyword' => 'คุณมีคีย์เวิร์ดนี้อยู่แล้ว']);
            }

            return back()->withErrors(['keyword' => 'ไม่สามารถใช้คีย์เวิร์ดนี้ได้ เนื่องจากมีอยู่ในระบบแล้ว']);
        }

        $keyword->update([
            'keyword' => $validated['keyword'],
            'editor_id' => $user->account_id,
        ]);

        // Cache Invalidation
        \Illuminate\Support\Facades\Cache::forget("keywords_personal_{$keyword->type}");

        return back()->with('success', 'แก้ไขคีย์เวิร์ดเรียบร้อย');
    }

    /**
     * Delete a personal keyword
     */
    public function destroy($id)
    {
        $user = auth()->user();

        // Ensure ownership
        $keyword = Keyword::where('id', $id)
            ->where('creator_id', $user->account_id)
            ->where('scope', 'personal')
            ->firstOrFail();

        $type = $keyword->type;

        $keyword->deleter_id = $user->account_id;
        $keyword->save();
        $keyword->delete();

        // Cache Invalidation
        \Illuminate\Support\Facades\Cache::forget("keywords_personal_{$type}");

        return back()->with('success', 'ลบคีย์เวิร์ดเรียบร้อย');
    }
}
