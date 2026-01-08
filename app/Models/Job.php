<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $table = 'job';
    protected $primaryKey = 'job_id';
    protected $fillable = ['name', 'created_by'];

    public function creator()
    {
        return $this->belongsTo(Account::class, 'created_by');
    }

    public function jobSteps()
    {
        return $this->hasMany(JobStep::class, 'job_id');
    }

    public function repairs()
    {
        return $this->belongsToMany(RequestRepair::class, 'request_job_map', 'job_id', 'repair_id');
    }

}
