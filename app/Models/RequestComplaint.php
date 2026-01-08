<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestComplaint extends Model
{
    protected $table = 'requests_complaint';
    protected $primaryKey = 'complaint_id';
    protected $fillable = ['title', 'description', 'status', 'priority', 'account_id', 'building_id', 'room_id', 'credited'];

    public function account()
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

    public function files()
    {
        return $this->hasMany(FileComplaint::class, 'complaint_id');
    }

}
