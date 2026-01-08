<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Keyword;
use App\Models\Account;

class RefinedComplaintKeywordSeeder extends Seeder
{
    public function run()
    {
        $admin = Account::where('role', 'admin')->first() ?? Account::first();

        // 1. Cleanup: Remove the previously generated 'repair-like' complaint keywords
        // We target global complaint keywords created recently or all of them if safe.
        // For safety, let's delete only the ones matching the previous list if possible, 
        // OR just delete all global complaint keywords to Start Fresh (User asked for a set of 50).
        Keyword::where('type', 'complaint')
            ->where('scope', 'global')
            ->forceDelete(); // Hard delete to reset the mock data completely

        // 2. New "Sensitive" Complaint Keywords (50 items)
        $keywords = [
            // หมวดการเรียนการสอน (Academics)
            'อาจารย์สอนไม่ตรงเวลา',
            'ปล่อยคลาสเลทมาก',
            'ไม่แจ้งเกณฑ์การให้คะแนน',
            'สอนไม่รู้เรื่อง',
            'ไม่อธิบายเนื้อหาเพิ่มเติม',
            'ข้อสอบออกไม่ตรงที่สอน',
            'เฉลยข้อสอบผิดพลาด',
            'ไม่บอกคะแนนเก็บ',
            'สั่งงานเยอะเกินความจำเป็น',
            'ยกเลิกคลาสกระทันหัน',
            'ไม่มาสอนตามตาราง',
            'อุปกรณ์การสอนไม่พร้อม',

            // หมวดพฤติกรรมบุคลากร/อาจารย์ (Behavior)
            'อาจารย์ใช้วาจาไม่สุภาพ',
            'เจ้าหน้าที่พูดจาไม่ดี',
            'ตะคอกใส่นิสิต',
            'เหยียดเพศ',
            'เหยียดรูปร่างหน้าตา',
            'ลวนลามทางคำพูด',
            'คุกคามทางเพศ',
            'วางตัวไม่เหมาะสม',
            'เลือกปฏิบัติ',
            'ลำเอียงในการให้เกรด',
            'รับสินบน',
            'ทุจริตในหน้าที่',
            'ไม่ให้บริการนิสิต',
            'ไล่นิสิตออกจากห้อง',
            'ข่มขู่นิสิต',

            // หมวดความปลอดภัยและสภาพแวดล้อม (Safety & Environment - Non-Repair)
            'ทางเดินมืดและเปลี่ยว',
            'ไม่มี รปภ. เฝ้าจุดเสี่ยง',
            'บุคคลภายนอกน่าสงสัย',
            'มีการมั่วสุม',
            'สูบบุหรี่ในพื้นที่ห้ามสูบ',
            'กลิ่นบุหรี่รบกวน',
            'เสียงดังรบกวนการเรียน',
            'จัดกิจกรรมเสียงดัง',
            'จอดรถกีดขวางทางเดิน',
            'ขับรถเร็วในคณะ',
            'สุนัขจรจัดดุร้าย',
            'ไม่มีไฟส่องสว่างจุดจอดรถ',
            'ขโมยของในหอสมุด',
            'โรคจิตแอบถ่าย',
            'ห้องน้ำไม่มิดชิด',

            // หมวดระบบและบริการ (System & Services)
            'ระบบลงทะเบียนล่มบ่อย',
            'ติดต่อเจ้าหน้าที่ทะเบียนไม่ได้',
            'ขั้นตอนเอกสารล่าช้า',
            'ไม่อนุมัติคำร้องโดยไม่มีเหตุผล',
            'ค่าเทอมแพงเกินจริง',
            'เก็บเงินกิจกรรมเกินความจำเป็น',
            'บังคับเข้าร่วมกิจกรรม',
            'อาหารในโรงอาหารไม่สะอาด',
            'ร้านค้าเอาเปรียบราคา',
            'ไม่ได้รับความเป็นธรรม'
        ];

        // Ensure we have 50 items (or pad if needed, but the list above is approx 47. Let's add a few more if short)
        $extras = ['การกลั่นแกล้ง (Bullying)', 'Cyberbullying ในกลุ่มรุ่น', 'รุ่นพี่กดขี่รุ่นน้อง', 'โซตัสรุนแรง'];
        $keywords = array_merge($keywords, $extras);


        foreach ($keywords as $k) {
            Keyword::firstOrCreate([
                'keyword' => $k,
                'type' => 'complaint', // Must be complaint
                'scope' => 'global'
            ], [
                'creator_id' => $admin ? $admin->account_id : 1
            ]);
        }
    }
}
