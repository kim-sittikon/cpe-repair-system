<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestRepair extends Model
{
    protected $table = 'requests_repair';
    protected $primaryKey = 'repair_id';
    protected $fillable = ['title', 'description', 'status', 'priority', 'account_id', 'building_id', 'room_id', 'credited'];

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

}
