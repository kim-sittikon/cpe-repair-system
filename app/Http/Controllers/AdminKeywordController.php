<?php

namespace App\Http\Controllers;

use App\Models\Keyword;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminKeywordController extends Controller
{
    /**
     * Display the keyword management page
     */
    public function index()
    {
        // ใช้ Eager Loading (with) เพื่อดึงชื่อคนสร้าง/แก้ไข มาแสดงผลในตารางได้เลย ไม่ต้อง Query ซ้ำ
        $keywords = Keyword::with(['creator', 'editor'])
            ->orderBy('type')
            ->orderBy('keyword')
            ->get();

        return Inertia::render('Admin/ManageKeywords', [
            'keywords' => $keywords,
        ]);
    }

    /**
     * Store a new keyword
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:repair,complaint',
            'scope' => 'required|in:global,personal',
            'keyword' => 'required|string|max:255',
        ]);

        // Check for duplicate (including soft deleted)
        $exists = Keyword::withTrashed()
            ->where('type', $validated['type'])
            ->where('keyword', $validated['keyword'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['keyword' => 'คีย์เวิร์ดนี้มีอยู่แล้วในประเภทที่เลือก']);
        }

        // Add creator_id
        $validated['creator_id'] = auth()->user()->account_id;

        Keyword::create($validated);

        // Cache Invalidation
        \Illuminate\Support\Facades\Cache::forget("keywords_global_{$validated['type']}");
        \Illuminate\Support\Facades\Cache::forget("keywords_personal_{$validated['type']}");

        return back()->with('success', 'เพิ่มคีย์เวิร์ดสำเร็จ');
    }

    /**
     * Update a keyword
     */
    public function update(Request $request, $id)
    {
        $keyword = Keyword::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|in:repair,complaint',
            'scope' => 'required|in:global,personal',
            'keyword' => 'required|string|max:255',
        ]);

        // Check for duplicate (excluding current keyword, including soft deleted)
        $exists = Keyword::withTrashed()
            ->where('type', $validated['type'])
            ->where('keyword', $validated['keyword'])
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['keyword' => 'คีย์เวิร์ดนี้มีอยู่แล้วในประเภทที่เลือก']);
        }

        // Add editor_id
        $validated['editor_id'] = auth()->user()->account_id;

        $keyword->update($validated);

        // Cache Invalidation
        \Illuminate\Support\Facades\Cache::forget("keywords_global_{$validated['type']}");
        \Illuminate\Support\Facades\Cache::forget("keywords_personal_{$validated['type']}");

        return back()->with('success', 'แก้ไขคีย์เวิร์ดสำเร็จ');
    }

    /**
     * Delete a keyword
     */
    public function destroy($id)
    {
        $keyword = Keyword::findOrFail($id);

        // Track who deleted
        $keyword->deleter_id = auth()->user()->account_id;
        $keyword->save();

        // Soft delete
        $keyword->delete();

        // Cache Invalidation
        \Illuminate\Support\Facades\Cache::forget("keywords_global_{$keyword->type}");
        \Illuminate\Support\Facades\Cache::forget("keywords_personal_{$keyword->type}");

        return back()->with('success', 'ลบคีย์เวิร์ดสำเร็จ');
    }
}