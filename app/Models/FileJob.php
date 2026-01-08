<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileJob extends Model
{
    protected $table = 'file_job';
    protected $primaryKey = 'file_id';
    protected $fillable = ['file_path', 'jobstep_id'];

    public function step()
    {
        return $this->belongsTo(JobStep::class, 'jobstep_id');
    }

}
