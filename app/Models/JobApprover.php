<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApprover extends Model
{
    protected $table = 'jobapprover';
    protected $primaryKey = 'jobstep_id'; // PK is FK
    public $incrementing = false;
    protected $fillable = ['jobstep_id', 'text', 'action'];

    public function step()
    {
        return $this->belongsTo(JobStep::class, 'jobstep_id');
    }

}
