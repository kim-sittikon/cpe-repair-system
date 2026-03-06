<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP - CPE Service</title>
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
    <div style="display:none;">รหัส OTP: {{ $otp }} (หมดอายุใน 5 นาที)</div>
    
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(135deg,#e11d48,#be123c);padding:24px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;color:#fff;font-size:20px;">🔐 CPE Service System</h1>
            </td>
        </tr>
        <tr>
            <td style="background:#fff;padding:32px;text-align:center;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <p style="margin:0 0 20px;color:#64748b;font-size:15px;">รหัส OTP สำหรับยืนยันตัวตน</p>
                
                <div style="background:#fef2f2;border:2px solid #fecaca;border-radius:12px;padding:20px;display:inline-block;">
                    <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#dc2626;font-family:'Courier New',monospace;">{{ $otp }}</span>
                </div>
                
                <p style="margin:20px 0 0;padding:12px;background:#fef3c7;border-radius:8px;color:#92400e;font-size:13px;">
                    ⏰ รหัสนี้จะหมดอายุใน <strong>5 นาที</strong>
                </p>
                
                <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">
                    🔒 อย่าแชร์รหัสนี้กับผู้อื่น
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding:16px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:11px;">
                    CPE Service System | ภาควิชาวิศวกรรมคอมพิวเตอร์ มทร.ธัญบุรี
                </p>
            </td>
        </tr>
    </table>
</body>
</html>