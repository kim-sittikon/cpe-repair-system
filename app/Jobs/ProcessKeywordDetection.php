<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class ProcessKeywordDetection implements ShouldQueue
{
    use Queueable;

    // Retry 3 times on failure
    public $tries = 3;
    // Wait 10 seconds before retrying
    public $backoff = 10;

    protected $requestModel;
    protected $type;

    /**
     * Create a new job instance.
     */
    public function __construct($requestModel, $type)
    {
        $this->requestModel = $requestModel;
        $this->type = $type;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $content = $this->requestModel->title . ' ' . $this->requestModel->description;
        $type = $this->type;

        // 1. Fetch Keywords from Cache (or DB)
        // Cache Key Structure: 'keywords_{scope}_{type}'
        // Ex: keywords_global_repair, keywords_personal_complaint

        $globalKeywords = Cache::rememberForever("keywords_global_{$type}", function () use ($type) {
            return \App\Models\Keyword::where('type', $type)->where('scope', 'global')->pluck('keyword')->toArray();
        });

        // For Personal, we need to know WHO owns it. So we better cache the whole collection or list.
        $personalKeywords = Cache::rememberForever("keywords_personal_{$type}", function () use ($type) {
            return \App\Models\Keyword::where('type', $type)->where('scope', 'personal')->get(['keyword', 'creator_id']);
        });


        // 2. GLOBAL DETECTION (Regex Chunking)
        // Chunk size 100 to avoid Regex Limit
        $chunks = array_chunk($globalKeywords, 100);
        $matchedGlobal = [];

        foreach ($chunks as $chunk) {
            // Escape special chars: preg_quote($word, '/')
            $escaped = array_map(function ($word) {
                return preg_quote($word, '/');
            }, $chunk);

            $pattern = '/(' . implode('|', $escaped) . ')/i';

            if (preg_match_all($pattern, $content, $matches)) {
                // $matches[0] contains full matched strings
                $matchedGlobal = array_merge($matchedGlobal, array_unique($matches[0]));
            }
        }

        // 3. PERSONAL DETECTION (Looping)
        // Personal keywords might be fewer, but let's be safe.
        // Complex Regex for Personal is harder because we need to map back to owner.
        // So we iterate. (Can be optimized further if needed, but acceptable for Personal volume)
        $matchedPersonal = [];
        foreach ($personalKeywords as $kw) {
            // Simple str_contains for now, or regex per word if needed.
            // Using str_contains is faster for simple loop matching than compiling regex per word.
            // But we agreed on "Loose Matching" for Thai.
            if (stripos($content, $kw->keyword) !== false) {
                $matchedPersonal[] = [
                    'keyword' => $kw->keyword,
                    'owner_id' => $kw->creator_id
                ];
            }
        }

        // 4. ACTION for Global Matches
        if (!empty($matchedGlobal)) {
            // Update Priority
            $this->requestModel->priority = 3; // Critical
            $this->requestModel->save();

            foreach ($matchedGlobal as $word) {
                \App\Models\KeywordMatch::create([
                    'request_type' => $type,
                    'request_id' => $this->requestModel->repair_id ?? $this->requestModel->complaint_id,
                    'keyword' => $word,
                    'scope' => 'global',
                    'owner_id' => null,
                ]);
            }

            Log::info("⚠️ [GROUP ALERT] Job Processed | Type: {$type} | Keywords: " . implode(', ', $matchedGlobal));

            // Notify Specific Working Group based on Type via Brevo API
            $recipients = collect();

            if ($type === 'repair') {
                $recipients = \App\Models\Account::where('job_repair', true)->get();
            } else {
                // Complaint
                $recipients = \App\Models\Account::where('job_complaint', true)->get();
            }

            if ($recipients->isNotEmpty()) {
                $requestId = $this->requestModel->repair_id ?? $this->requestModel->complaint_id;
                $title = $this->requestModel->title;
                $keywordsText = implode(', ', $matchedGlobal);
                $subject = '🚨 แจ้งเตือนด่วน: ตรวจพบคำต้องห้ามในรายการที่ #' . $requestId;

                // Render HTML template
                $htmlContent = $this->renderGlobalTemplate($requestId, $title, $keywordsText);

                // Send email to each recipient via Brevo API
                foreach ($recipients as $recipient) {
                    if (!empty($recipient->email)) {
                        SendEmailJob::dispatch(
                            $recipient->email,
                            $subject,
                            $htmlContent,
                            'keyword-global',
                            ['keyword', 'global', 'critical']
                        );
                    }
                }

                Log::info("📧 [GROUP ALERT] Emails dispatched | Recipients: {$recipients->count()} | Keywords: {$keywordsText}");
            }
        }

        // 5. ACTION for Personal Matches
        foreach ($matchedPersonal as $match) {
            \App\Models\KeywordMatch::create([
                'request_type' => $type,
                'request_id' => $this->requestModel->repair_id ?? $this->requestModel->complaint_id,
                'keyword' => $match['keyword'],
                'scope' => 'personal',
                'owner_id' => $match['owner_id'],
            ]);

            $owner = \App\Models\Account::find($match['owner_id']);
            if ($owner && !empty($owner->email)) {
                $title = $this->requestModel->title;
                $subject = '🔔 แจ้งเตือน: พบคีย์เวิร์ด "' . $match['keyword'] . '" ในรายการใหม่';

                // Render HTML template
                $htmlContent = $this->renderPersonalTemplate($match['keyword'], $title);

                // Send email via Brevo API
                SendEmailJob::dispatch(
                    $owner->email,
                    $subject,
                    $htmlContent,
                    'keyword-personal',
                    ['keyword', 'personal']
                );
            }

            Log::info("📨 [PERSONAL ALERT] Job Processed | To User: {$match['owner_id']} | Keyword: {$match['keyword']}");
        }
    }

    /**
     * Render personal keyword notification template
     */
    private function renderPersonalTemplate(string $keyword, string $title): string
    {
        try {
            return View::make('emails.keyword-personal', [
                'keyword' => $keyword,
                'title' => $title,
                'url' => url('/dashboard'),
            ])->render();
        } catch (\Throwable $e) {
            Log::warning('⚠️ Failed to render personal keyword template, using fallback', [
                'error' => $e->getMessage(),
            ]);
            return $this->getPersonalFallbackTemplate($keyword, $title);
        }
    }

    /**
     * Render global keyword notification template
     */
    private function renderGlobalTemplate(int|string $requestId, string $title, string $keywords): string
    {
        try {
            return View::make('emails.keyword-global', [
                'requestId' => $requestId,
                'title' => $title,
                'keywords' => $keywords,
                'url' => url('/dashboard'),
            ])->render();
        } catch (\Throwable $e) {
            Log::warning('⚠️ Failed to render global keyword template, using fallback', [
                'error' => $e->getMessage(),
            ]);
            return $this->getGlobalFallbackTemplate($requestId, $title, $keywords);
        }
    }

    /**
     * Fallback HTML template for personal keyword notification
     */
    private function getPersonalFallbackTemplate(string $keyword, string $title): string
    {
        $url = url('/dashboard');
        return <<<HTML
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:20px;">
            <h2 style="color:#d97706;">🔔 แจ้งเตือนคีย์เวิร์ดส่วนตัว</h2>
            <p>ระบบตรวจพบรายการใหม่ที่ตรงกับคีย์เวิร์ดที่คุณติดตาม</p>
            <p><strong>📌 คีย์เวิร์ดที่พบ:</strong> {$keyword}</p>
            <p><strong>📝 หัวข้อเรื่อง:</strong> {$title}</p>
            <p><a href="{$url}" style="background:#d97706;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">ดูรายละเอียด</a></p>
            <p style="color:#999;font-size:12px;">CPE Repair System | ภาควิชาวิศวกรรมคอมพิวเตอร์ มทร.ธัญบุรี</p>
        </div>
        HTML;
    }

    /**
     * Fallback HTML template for global keyword notification
     */
    private function getGlobalFallbackTemplate(int|string $requestId, string $title, string $keywords): string
    {
        $url = url('/dashboard');
        return <<<HTML
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:20px;">
            <h2 style="color:#dc2626;">🚨 แจ้งเตือนด่วน: ตรวจพบคำต้องห้าม</h2>
            <p>ระบบได้ตรวจพบคำต้องห้ามในรายการแจ้งปัญหาใหม่</p>
            <p><strong>📝 หัวข้อเรื่อง:</strong> {$title}</p>
            <p><strong>⚠️ คีย์เวิร์ดที่ตรวจพบ:</strong> {$keywords}</p>
            <p>⛔ ระบบได้ปรับระดับความสำคัญเป็น "CRITICAL" เรียบร้อยแล้ว</p>
            <p><a href="{$url}" style="background:#dc2626;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">ตรวจสอบรายการ</a></p>
            <p style="color:#999;font-size:12px;">CPE Repair System | ภาควิชาวิศวกรรมคอมพิวเตอร์ มทร.ธัญบุรี</p>
        </div>
        HTML;
    }
}

