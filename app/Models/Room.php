<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $table = 'room'; // Singular table name
    protected $primaryKey = 'room_id';

    protected $fillable = [
        'room_name',
        'building_id',
        'account_id',
    ];

    /**
     * Relationship: A room belongs to a building
     */
    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id', 'building_id');
    }
}
