<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\JobStep;
use App\Models\RequestJobMap;
use App\Models\RequestRepair;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Show the create job form
     */
    public function create(Request $request)
    {
        $ids = $request->query('ids', []);
        
        // Ensure IDs are integers
        $ids = array_map('intval', array_filter((array)$ids));

        // Get repair requests by IDs
        $repairs = RequestRepair::whereIn('repair_id', $ids)
            ->with(['account', 'building', 'room', 'files'])
            ->get()
            ->map(function ($repair) {
                return [
                    'id' => $repair->repair_id,
                    'numeric_id' => 'RP' . str_pad($repair->repair_id, 4, '0', STR_PAD_LEFT),
                    'title' => $repair->title,
                    'description' => $repair->description,
                    'priority' => $repair->priority == 3 ? 'เร่งด่วนมาก' : 'ปกติ',
                    'status' => $repair->status,
                    'location' => $repair->building?->building_name . ' ' . $repair->room?->room_name,
                    'requester' => $repair->account?->first_name . ' ' . $repair->account?->last_name,
                    'created_at' => $repair->created_at?->format('d/m/Y H:i'),
                    'files' => $repair->files->map(function ($file) {
                        $extension = strtolower(pathinfo($file->file_path, PATHINFO_EXTENSION));
                        $name = basename($file->file_path);
                        return [
                            'id' => $file->file_id ?? $file->id,
                            'name' => $name,
                            'url' => asset('storage/' . $file->file_path),
                            'extension' => $extension,
                        ];
                    })->toArray(),
                ];
            });

        // Get users who can be assigned to jobs (job_repair = true)
        $assignees = Account::where('job_repair', true)
            ->where('status', 'active')
            ->get()
            ->map(function ($account) {
                return [
                    'id' => $account->account_id,
                    'name' => $account->first_name . ' ' . $account->last_name,
                    'email' => $account->email,
                    'role' => $account->role,
                ];
            });

        return Inertia::render('Jobs/Create', [
            'repairs' => $repairs,
            'assignees' => $assignees,
            'selectedIds' => $ids,
        ]);
    }

    /**
     * Store a new job
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'repair_ids' => 'required|array|min:1',
            'repair_ids.*' => 'exists:requests_repair,repair_id',
            'steps' => 'required|array|min:1',
            'steps.*.step_name' => 'required|string|max:255',
            'steps.*.action' => 'required|in:act,app',
            'steps.*.assigned_account_id' => 'nullable|exists:accounts,account_id',
            'steps.*.step_details' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Create the job
            $job = Job::create([
                'name' => $validated['name'],
                'created_by' => Auth::id(),
            ]);

            // Map repairs to job
            foreach ($validated['repair_ids'] as $repairId) {
                RequestJobMap::create([
                    'job_id' => $job->job_id,
                    'repair_id' => $repairId,
                ]);

                // Update repair status to "กำลังดำเนินการ"
                RequestRepair::where('repair_id', $repairId)
                    ->update(['status' => 'กำลังดำเนินการ']);
            }

            // Create job steps
            foreach ($validated['steps'] as $index => $stepData) {
                JobStep::create([
                    'job_id' => $job->job_id,
                    'step_name' => $stepData['step_name'],
                    'step_number' => $index + 1,
                    'action' => $stepData['action'],
                    'status' => 'pending',
                    'step_details' => $stepData['step_details'] ?? null,
                    'assigned_account_id' => $stepData['assigned_account_id'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('repairs.index')
                ->with('success', 'สร้างใบงานสำเร็จ: ' . $job->name);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
    }

    /**
     * List all jobs (จ๊อบรวม) - visible to everyone
     */
    public function index(Request $request)
    {
        $jobs = Job::with(['creator', 'repairs', 'jobSteps.assignee'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
        ]);
    }

    /**
     * List job steps assigned to current user (จ๊อบของฉัน)
     */
    public function myJobs(Request $request)
    {
        $mySteps = JobStep::with(['job.creator', 'job.repairs', 'job.jobSteps', 'assignee'])
            ->where('assigned_account_id', Auth::id())
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 WHEN status = 'in_progress' THEN 1 ELSE 2 END")
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Jobs/MyJobs', [
            'mySteps' => $mySteps,
        ]);
    }

    /**
     * Show job details
     */
    public function show($id)
    {
        $job = Job::with(['creator', 'repairs.account', 'repairs.building', 'repairs.room', 'jobSteps.assignee'])
            ->findOrFail($id);

        return Inertia::render('Jobs/Show', [
            'job' => $job,
        ]);
    }

    /**
     * Update job step progress
     */
    public function updateStep(Request $request, $id)
    {
        $step = JobStep::findOrFail($id);
        
        // Verify user is assigned to this step
        if ($step->assigned_account_id !== Auth::id()) {
            return back()->with('error', 'คุณไม่มีสิทธิ์ดำเนินการขั้นตอนนี้');
        }

        // Update step details
        $step->step_details = $request->input('details');
        
        // Update status
        if ($request->input('status') === 'completed') {
            $step->status = 'done';
            $step->completeDT = now();
        } else {
            $step->status = 'in_progress';
        }
        
        $step->save();

        // Handle file uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('job_files/' . $step->job_id, 'public');
                
                // Create file record if you have a file table
                // For now, we'll skip this part
            }
        }

        // ถ้าดำเนินการเสร็จสิ้น ให้ redirect ไปหน้าจ็อบของฉัน
        if ($request->input('status') === 'completed') {
            return redirect()->route('repairs.jobs.my')
                ->with('success', 'ดำเนินการเสร็จสิ้น: ' . $step->step_name);
        }

        return back()->with('success', 'บันทึกข้อมูลสำเร็จ');
    }
}
