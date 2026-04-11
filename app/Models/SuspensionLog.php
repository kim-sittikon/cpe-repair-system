<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuspensionLog extends Model
{
    protected $fillable = [
        'account_id',
        'action',
        'type',
        'reason',
        'performed_by',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id', 'account_id');
    }

    public function performedBy()
    {
        return $this->belongsTo(Account::class, 'performed_by', 'account_id');
    }
}
