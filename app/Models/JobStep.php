<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobStep extends Model
{
    protected $table = 'jobstep';
    protected $primaryKey = 'jobstep_id';
    protected $fillable = [
        'step_name',
        'step_number',
        'action',
        'status',
        'step_details',
        'completeDT',
        'assigned_account_id',
        'job_id'
    ];

    // Auto-update completeDT? Probably handled in controller.

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function assignee()
    {
        return $this->belongsTo(Account::class, 'assigned_account_id');
    }

    public function actor()
    {
        return $this->hasOne(JobActor::class, 'jobstep_id');
    }

    public function approver()
    {
        return $this->hasOne(JobApprover::class, 'jobstep_id');
    }

    public function files()
    {
        return $this->hasMany(FileJob::class, 'jobstep_id');
    }

}
