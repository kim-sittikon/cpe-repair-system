<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileComplaint extends Model
{
    protected $table = 'file_complaint';
    protected $primaryKey = 'file_id';
    protected $fillable = ['file_path', 'complaint_id'];

    public function request()
    {
        return $this->belongsTo(RequestComplaint::class, 'complaint_id');
    }

}
