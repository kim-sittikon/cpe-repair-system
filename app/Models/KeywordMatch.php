<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KeywordMatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_type',
        'request_id',
        'keyword',
        'scope',
        'owner_id'
    ];
    public function repair()
    {
        return $this->belongsTo(RequestRepair::class, 'request_id');
    }

    public function complaint()
    {
        return $this->belongsTo(RequestComplaint::class, 'request_id');
    }

    public function getRequestAttribute()
    {
        if ($this->request_type === 'repair') {
            return $this->repair;
        }
        return $this->complaint;
    }
}
