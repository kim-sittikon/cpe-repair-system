<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestJobMap extends Model
{
    protected $table = 'request_job_map';
    protected $primaryKey = 'map_id';
    protected $fillable = ['job_id', 'repair_id'];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function repair()
    {
        return $this->belongsTo(RequestRepair::class, 'repair_id');
    }

}
