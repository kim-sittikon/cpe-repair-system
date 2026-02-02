<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestRepair extends Model
{
    protected $table = 'requests_repair';
    protected $primaryKey = 'repair_id';
    protected $fillable = [
        'title', 'description', 'status', 'priority', 
        'account_id', 'building_id', 'room_id', 'credited',
        'completion_notes', 'completed_at', 'completed_by'
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function account() // requester
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function jobs()
    {
        // Many-to-Many via pivot
        return $this->belongsToMany(Job::class, 'request_job_map', 'repair_id', 'job_id');
    }

    public function files()
    {
        return $this->hasMany(FileRepair::class, 'repair_id');
    }

    // Files from reporter (original request)
    public function requestFiles()
    {
        return $this->hasMany(FileRepair::class, 'repair_id')->where('file_type', 'request');
    }

    // Files from staff when completing
    public function completionFiles()
    {
        return $this->hasMany(FileRepair::class, 'repair_id')->where('file_type', 'completion');
    }

    // Who completed the repair
    public function completedBy()
    {
        return $this->belongsTo(Account::class, 'completed_by');
    }
}
