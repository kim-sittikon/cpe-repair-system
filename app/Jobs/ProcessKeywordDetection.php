<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

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

        $globalKeywords = \Illuminate\Support\Facades\Cache::rememberForever("keywords_global_{$type}", function () use ($type) {
            return \App\Models\Keyword::where('type', $type)->where('scope', 'global')->pluck('keyword')->toArray();
        });

        // For Personal, we need to know WHO owns it. So we better cache the whole collection or list.
        $personalKeywords = \Illuminate\Support\Facades\Cache::rememberForever("keywords_personal_{$type}", function () use ($type) {
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

            \Illuminate\Support\Facades\Log::info("⚠️ [GROUP ALERT] Job Processed | Type: {$type} | Keywords: " . implode(', ', $matchedGlobal));

            // Notify Specific Working Group based on Type
            $recipients = collect();

            if ($type === 'repair') {
                $recipients = \App\Models\Account::where('job_repair', true)->get();
            } else {
                // Complaint
                $recipients = \App\Models\Account::where('job_complaint', true)->get();
            }

            if ($recipients->isNotEmpty()) {
                \Illuminate\Support\Facades\Notification::send($recipients, new \App\Notifications\KeywordDetectedNotification($this->requestModel, $matchedGlobal));
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
            if ($owner) {
                $owner->notify(new \App\Notifications\PersonalKeywordDetectedNotification($match['keyword'], $this->requestModel));
            }

            \Illuminate\Support\Facades\Log::info("📨 [PERSONAL ALERT] Job Processed | To User: {$match['owner_id']} | Keyword: {$match['keyword']}");
        }
    }
}
