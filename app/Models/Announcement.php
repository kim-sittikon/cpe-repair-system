<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use SoftDeletes;
    protected $table = 'announcement';
    protected $primaryKey = 'announcement_id';
    protected $fillable = ['title', 'detail', 'is_urgent', 'file', 'account_id', 'building_id', 'room_id'];

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

}
