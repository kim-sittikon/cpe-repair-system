<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Keyword extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type',
        'scope', // 'global' or 'personal'
        'keyword',
        'creator_id',
        'editor_id',
        'deleter_id',
    ];

    /**
     * Relationships
     */
    public function creator()
    {
        return $this->belongsTo(Account::class, 'creator_id', 'account_id');
    }

    public function editor()
    {
        return $this->belongsTo(Account::class, 'editor_id', 'account_id');
    }

    public function deleter()
    {
        return $this->belongsTo(Account::class, 'deleter_id', 'account_id');
    }
}