<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLocationController extends Controller
{
    /**
     * Display the location management page
     */
    public function index()
    {
        $buildings = Building::orderBy('building_name')->get();
        $rooms = Room::with('building')->orderBy('building_id')->orderBy('room_name')->get();

        return Inertia::render('Admin/ManageLocations', [
            'buildings' => $buildings,
            'rooms' => $rooms,
        ]);
    }

    /**
     * Store a new building
     */
    public function storeBuilding(Request $request)
    {
        $validated = $request->validate([
            'building_name' => 'required|string|max:255|unique:building,building_name',
        ]);

        // Add account_id (current user)
        $validated['account_id'] = auth()->user()->account_id;

        Building::create($validated);

        return back()->with('success', 'เพิ่มอาคารสำเร็จ');
    }

    /**
     * Delete a building
     */
    public function destroyBuilding($id)
    {
        $building = Building::findOrFail($id);

        // Check if building has rooms
        if ($building->rooms()->count() > 0) {
            return back()->withErrors(['error' => 'ไม่สามารถลบอาคารที่มีห้องอยู่ได้ กรุณาลบห้องในอาคารก่อน']);
        }

        $building->delete();

        return back()->with('success', 'ลบอาคารสำเร็จ');
    }

    /**
     * Store a new room
     */
    public function storeRoom(Request $request)
    {
        $validated = $request->validate([
            'building_id' => 'required|exists:building,building_id',
            'room_name' => 'required|string|max:50',
        ]);

        // Check for duplicate room in same building
        $exists = Room::where('building_id', $validated['building_id'])
            ->where('room_name', $validated['room_name'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['room_name' => 'ห้องนี้มีอยู่แล้วในอาคารที่เลือก']);
        }

        // Add account_id
        $validated['account_id'] = auth()->user()->account_id;

        Room::create($validated);

        return back()->with('success', 'เพิ่มห้องสำเร็จ');
    }

    /**
     * Update a room
     */
    public function updateRoom(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'building_id' => 'required|exists:building,building_id',
            'room_name' => 'required|string|max:50',
        ]);

        // Check for duplicate (excluding current room)
        $exists = Room::where('building_id', $validated['building_id'])
            ->where('room_name', $validated['room_name'])
            ->where('room_id', '!=', $id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['room_name' => 'ห้องนี้มีอยู่แล้วในอาคารที่เลือก']);
        }

        $room->update($validated);

        return back()->with('success', 'แก้ไขห้องสำเร็จ');
    }

    /**
     * Delete a room
     */
    public function destroyRoom($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return back()->with('success', 'ลบห้องสำเร็จ');
    }
}
