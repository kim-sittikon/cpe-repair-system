<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobActor extends Model
{
    protected $table = 'jobactor';
    protected $primaryKey = 'jobstep_id'; // PK is FK
    public $incrementing = false; // Important for 1:1 on PK
    protected $fillable = ['jobstep_id', 'message'];

    public function step()
    {
        return $this->belongsTo(JobStep::class, 'jobstep_id');
    }

}
