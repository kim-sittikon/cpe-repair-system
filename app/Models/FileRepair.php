<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileRepair extends Model
{
    protected $table = 'file_repair';
    protected $primaryKey = 'file_id';
    protected $fillable = ['file_path', 'repair_id'];

    public function request()
    {
        return $this->belongsTo(RequestRepair::class, 'repair_id');
    }

}
