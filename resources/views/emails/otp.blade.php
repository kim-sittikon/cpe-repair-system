<!DOCTYPE html>
<html>

<head>
    <title>OTP Verification</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333333; text-align: center;">รหัส OTP ยืนยันตัวตน</h2>
        <p style="color: #666666; font-size: 16px;">สวัสดีครับ,</p>
        <p style="color: #666666; font-size: 16px;">ใช้รหัส OTP ด้านล่างนี้เพื่อยืนยันการลงทะเบียนบัญชีของคุณ
            รหัสนี้จะหมดอายุใน 5 นาที</p>

        <div style="text-align: center; margin: 30px 0;">
            <span
                style="display: inline-block; background-color: #e11d48; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px 30px; border-radius: 8px;">
                {{ $otp }}
            </span>
        </div>

        <p style="color: #999999; font-size: 14px; text-align: center;">หากคุณไม่ได้ทำรายการนี้
            โปรดเพิกเฉยต่ออีเมลฉบับนี้</p>
    </div>
</body>

</html>