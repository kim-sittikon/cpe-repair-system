<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>แจ้งเตือนคีย์เวิร์ดส่วนตัว - CPE Service</title>
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
    <div style="display:none;">พบคีย์เวิร์ด "{{ $keyword }}" ในรายการใหม่ - CPE Repair System</div>
    
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:24px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;color:#78350f;font-size:20px;">🔔 CPE Repair System</h1>
            </td>
        </tr>
        <tr>
            <td style="background:#fff;padding:32px;text-align:center;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <p style="margin:0 0 8px;color:#1e293b;font-size:16px;font-weight:600;">แจ้งเตือนคีย์เวิร์ดส่วนตัว</p>
                <p style="margin:0 0 20px;color:#64748b;font-size:14px;">ระบบตรวจพบรายการใหม่ที่ตรงกับคีย์เวิร์ดที่คุณติดตาม</p>
                
                <div style="background:#fffbeb;border:2px solid #fde68a;border-radius:12px;padding:16px;text-align:left;margin:0 0 16px;">
                    <p style="margin:0 0 8px;color:#92400e;font-size:13px;">📌 <strong>คีย์เวิร์ดที่พบ:</strong></p>
                    <p style="margin:0 0 12px;color:#d97706;font-size:18px;font-weight:700;">{{ $keyword }}</p>
                    <p style="margin:0 0 4px;color:#92400e;font-size:13px;">📝 <strong>หัวข้อเรื่อง:</strong></p>
                    <p style="margin:0;color:#1e293b;font-size:14px;">{{ $title }}</p>
                </div>

                <a href="{{ $url }}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;padding:14px 32px;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;margin:8px 0;">
                    ดูรายละเอียด
                </a>

                <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">
                    คุณได้รับอีเมลนี้เพราะคุณตั้งค่าติดตามคีย์เวิร์ดนี้
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
