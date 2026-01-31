<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>OTP Verification - CPE Service System</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <!-- Preheader Text (ซ่อน แต่ email client จะแสดงเป็น preview) -->
    <div style="display: none; max-height: 0; overflow: hidden;">
        รหัส OTP ของคุณคือ {{ $otp }} - มีอายุ 5 นาที
    </div>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
                    <!-- Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 32px; text-align: center;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">
                                            🔐 CPE Service System
                                        </h1>
                                        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                                            ระบบแจ้งซ่อมและร้องเรียน ภาควิชา CPE
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px; font-weight: 600;">
                                รหัส OTP ยืนยันตัวตน
                            </h2>
                            <p style="margin: 0 0 24px; color: #64748b; font-size: 15px; line-height: 1.6;">
                                สวัสดีครับ/ค่ะ กรุณาใช้รหัส OTP ด้านล่างเพื่อยืนยันบัญชีของคุณ รหัสนี้ใช้ได้ครั้งเดียว
                            </p>
                            
                            <!-- OTP Code Box -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="padding: 32px 0;">
                                        <table role="presentation" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #fecaca; border-radius: 12px; padding: 20px 40px;">
                                                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #dc2626; font-family: 'Courier New', Courier, monospace;">
                                                        {{ $otp }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Warning Box -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                                <tr>
                                    <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0;">
                                        <p style="margin: 0; color: #92400e; font-size: 14px;">
                                            ⏰ รหัสนี้จะหมดอายุใน <strong>5 นาที</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0 0;">
                                <tr>
                                    <td style="background-color: #f1f5f9; padding: 16px; border-radius: 8px;">
                                        <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                                            🔒 <strong>เพื่อความปลอดภัย:</strong> อย่าแชร์รหัส OTP นี้กับผู้อื่น ทีมงานจะไม่มีการขอรหัสนี้จากคุณ
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 24px 0 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                                หากคุณไม่ได้ทำรายการนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600;">
                                            CPE Service System
                                        </p>
                                        <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                                            ภาควิชาวิศวกรรมคอมพิวเตอร์<br>
                                            คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี
                                        </p>
                                        <p style="margin: 16px 0 0; color: #cbd5e1; font-size: 11px;">
                                            © {{ date('Y') }} CPE RMUTT. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Anti-spam Footer -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; margin-top: 24px;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; color: #94a3b8; font-size: 11px; line-height: 1.5;">
                                อีเมลนี้ถูกส่งจาก noreply@mg.cperepair.app<br>
                                กรุณาอย่าตอบกลับอีเมลนี้โดยตรง
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>