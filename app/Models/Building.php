<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    use HasFactory;

    protected $table = 'building'; // Singular table name
    protected $primaryKey = 'building_id';

    protected $fillable = [
        'building_name',
        'account_id',
    ];

    /**
     * Relationship: A building has many rooms
     */
    public function rooms()
    {
        return $this->hasMany(Room::class, 'building_id', 'building_id');
    }
}
