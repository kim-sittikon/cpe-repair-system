<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>แจ้งเตือนด่วน คำต้องห้าม - CPE Service</title>
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
    <div style="display:none;">🚨 ตรวจพบคำต้องห้ามในรายการ #{{ $requestId }} - CPE Repair System</div>
    
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:24px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;color:#1a1a2e;font-size:22px;font-weight:700;">🚨 CPE Repair System</h1>
            </td>
        </tr>
        <tr>
            <td style="background:#fff;padding:32px;text-align:center;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <p style="margin:0 0 8px;color:#1e293b;font-size:16px;font-weight:600;">แจ้งเตือนด่วน: ตรวจพบคำต้องห้าม</p>
                <p style="margin:0 0 20px;color:#64748b;font-size:14px;">ระบบได้ตรวจพบคำต้องห้ามในรายการแจ้งปัญหาใหม่</p>
                
                <div style="background:#fef2f2;border:2px solid #fecaca;border-radius:12px;padding:16px;text-align:left;margin:0 0 16px;">
                    <p style="margin:0 0 8px;color:#991b1b;font-size:13px;">📝 <strong>หัวข้อเรื่อง:</strong></p>
                    <p style="margin:0 0 12px;color:#1e293b;font-size:14px;">{{ $title }}</p>
                    <p style="margin:0 0 4px;color:#991b1b;font-size:13px;">⚠️ <strong>คีย์เวิร์ดที่ตรวจพบ:</strong></p>
                    <p style="margin:0 0 12px;color:#dc2626;font-size:16px;font-weight:700;">{{ $keywords }}</p>
                    <p style="margin:0;padding:10px;background:#fee2e2;border-radius:8px;color:#991b1b;font-size:13px;">
                        ⛔ ระบบได้ปรับระดับความสำคัญเป็น <strong>"CRITICAL"</strong> เรียบร้อยแล้ว
                    </p>
                </div>

                <a href="{{ $url }}" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;padding:14px 32px;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;margin:8px 0;">
                    ตรวจสอบรายการ
                </a>

                <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">
                    กรุณาตรวจสอบและดำเนินการแก้ไขโดยเร็วที่สุด
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding:16px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;">
                    CPE Repair System | ภาควิชาวิศวกรรมคอมพิวเตอร์ มทร.ธัญบุรี
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
