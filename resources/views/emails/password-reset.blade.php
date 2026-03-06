<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>รีเซ็ตรหัสผ่าน - CPE Service</title>
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
    <div style="display:none;">คลิกลิงก์เพื่อรีเซ็ตรหัสผ่าน CPE Repair System (หมดอายุใน 60 นาที)</div>
    
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(135deg,#e11d48,#be123c);padding:24px;text-align:center;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;color:#fff;font-size:20px;">🔐 CPE Repair System</h1>
            </td>
        </tr>
        <tr>
            <td style="background:#fff;padding:32px;text-align:center;border-radius:0 0 12px 12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <p style="margin:0 0 20px;color:#64748b;font-size:15px;">คุณได้รับอีเมลนี้เพราะมีคำขอรีเซ็ตรหัสผ่าน</p>
                
                <a href="{{ $resetUrl }}" style="display:inline-block;background:linear-gradient(135deg,#e11d48,#be123c);color:#fff;padding:14px 32px;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;margin:16px 0;">
                    ตั้งรหัสผ่านใหม่
                </a>
                
                <p style="margin:20px 0 0;padding:12px;background:#fef3c7;border-radius:8px;color:#92400e;font-size:13px;">
                    ⏰ ลิงก์นี้จะหมดอายุใน <strong>60 นาที</strong>
                </p>
                
                <p style="margin:16px 0 0;color:#94a3b8;font-size:12px;">
                    🔒 หากคุณไม่ได้ส่งคำขอนี้ ไม่ต้องดำเนินการใดๆ
                </p>
                
                <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;">
                    <p style="margin:0;color:#94a3b8;font-size:11px;">
                        หากปุ่มด้านบนไม่ทำงาน ให้คัดลอก URL นี้ไปวางในเบราว์เซอร์:<br>
                        <span style="word-break:break-all;color:#64748b;">{{ $resetUrl }}</span>
                    </p>
                </div>
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
