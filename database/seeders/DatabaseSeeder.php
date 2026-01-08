<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users (Accounts)
        $admin = \App\Models\Account::create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@rmutt.ac.th',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
            'job_admin' => true,
            'job_repair' => true,
            'job_complaint' => true,
            'verified' => true,
        ]);

        $staff = \App\Models\Account::create([
            'first_name' => 'Staff',
            'last_name' => 'Repairman',
            'email' => 'staff@rmutt.ac.th',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'staff',
            'job_repair' => true,
            'verified' => true,
        ]);

        $teacher = \App\Models\Account::create([
            'first_name' => 'Teacher',
            'last_name' => 'User',
            'email' => 'teacher@rmutt.ac.th',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'teacher',
            'job_complaint' => true,
            'verified' => true,
        ]);

        $student = \App\Models\Account::create([
            'first_name' => 'Student',
            'last_name' => 'User',
            'email' => 'student@mail.rmutt.ac.th',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'student',
            'verified' => true,
        ]);

        // 2. Master Data (Locations)
        $buildings = [
            ['name' => 'Computer Engineering Building (ตึกคอม)', 'rooms' => ['CPE_Lab1', 'CPE_Lab2', '401', '402', '403']],
            ['name' => 'Engineering Build 1', 'rooms' => ['En1_101', 'En1_102', 'En1_201', 'En1_202', 'En1_Meeting']],
            ['name' => 'Engineering Build 2', 'rooms' => ['En2_LabA', 'En2_LabB', 'En2_Office', 'En2_Hall', 'En2_Storage']],
        ];

        foreach ($buildings as $bData) {
            $building = \App\Models\Building::create([
                'building_name' => $bData['name'],
                'account_id' => $admin->account_id,
            ]);

            foreach ($bData['rooms'] as $roomName) {
                \App\Models\Room::create([
                    'room_name' => $roomName,
                    'building_id' => $building->building_id,
                    'account_id' => $admin->account_id,
                ]);
            }
        }

        // Keywords for Watcher (Staff)
        $keywords = ['แอร์ (Air)', 'ไฟ (Light)', 'คอมพิวเตอร์ (Computer)'];
        foreach ($keywords as $kw) {
            \Illuminate\Support\Facades\DB::table('repair_keywords')->insert([
                'keyword_text' => $kw,
                'account_id' => $staff->account_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Transactions
        // Get random building/room
        $randomRoom = \App\Models\Room::first();

        // Create 10 Repair Requests
        for ($i = 0; $i < 10; $i++) {
            \App\Models\RequestRepair::create([
                'title' => 'Repair Request #' . ($i + 1),
                'description' => 'Something is broken.',
                'status' => $i < 5 ? 'pending' : 'in_progress',
                'priority' => rand(1, 3),
                'account_id' => $student->account_id,
                'building_id' => $randomRoom->building_id,
                'room_id' => $randomRoom->room_id,
            ]);
        }

        // Create 5 Complaints
        for ($i = 0; $i < 5; $i++) {
            \App\Models\RequestComplaint::create([
                'title' => 'Complaint #' . ($i + 1),
                'description' => 'Noise issue.',
                'status' => 'pending',
                'account_id' => $teacher->account_id,
                // Nullable locations
            ]);
        }

        // 4. Create Active Job (Linked to Repair #1)
        $repair = \App\Models\RequestRepair::first();
        $job = \App\Models\Job::create([
            'name' => 'Fix Air Conditioner Task',
            'created_by' => $admin->account_id,
        ]);

        // Link Request to Job
        \App\Models\RequestJobMap::create([
            'job_id' => $job->job_id,
            'repair_id' => $repair->repair_id,
        ]);

        // Job Steps
        // Step 1: Done
        \App\Models\JobStep::create([
            'step_name' => 'Check Issue',
            'step_number' => 1,
            'action' => 'act',
            'status' => 'done',
            'completeDT' => now(),
            'assigned_account_id' => $staff->account_id,
            'job_id' => $job->job_id,
        ]);

        // Step 2: In Progress (Active for Staff Dashboard)
        \App\Models\JobStep::create([
            'step_name' => 'Fixing',
            'step_number' => 2,
            'action' => 'act',
            'status' => 'in_progress',
            'assigned_account_id' => $staff->account_id,
            'job_id' => $job->job_id,
        ]);

        // 5. Announcements (for Dashboard)
        // Urgent 1
        \App\Models\Announcement::create([
            'title' => 'บำรุงรักษาเครื่อง Server ประจำไตรมาส',
            'detail' => 'จะมีการปิดปรับปรุงระบบ Server เพื่อทำการบำรุงรักษา ในวันที่ 14 Sep 2025 เวลา 22.00 - 02.00 น.',
            'is_urgent' => true,
            'account_id' => $admin->account_id,
            'created_at' => now()->subDays(1),
        ]);
        // Urgent 2
        \App\Models\Announcement::create([
            'title' => 'งดการเรียนการสอน ห้อง CPE_Lab1',
            'detail' => 'เนื่องจากมีการสอบกลางภาค จึงของดใช้ห้อง Lab 1 ในช่วงเช้าวันพรุ่งนี้',
            'is_urgent' => true,
            'account_id' => $admin->account_id,
            'created_at' => now()->subHours(5),
            'building_id' => 1, // Example
        ]);

        // General News
        $generalTitles = [
            'ปิดปรับปรุงระบบเครือข่าย อาคาร CPE ชั้น 2',
            'แจ้งกำหนดการส่งคืนอุปกรณ์ยืมเรียน',
            'รับสมัครนักศึกษาช่วยงานฝ่ายอาคาร',
            'กิจกรรม Big Cleaning Day ประจำปี',
        ];

        foreach ($generalTitles as $index => $title) {
            \App\Models\Announcement::create([
                'title' => $title,
                'detail' => 'รายละเอียดเพิ่มเติมเกี่ยวกับ ' . $title . ' สามารถติดต่อสอบถามได้ที่สำนักงาน',
                'is_urgent' => false,
                'account_id' => $staff->account_id,
                'created_at' => now()->subDays($index + 2),
            ]);
        }
    }
}
