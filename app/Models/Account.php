<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Account extends Authenticatable
{
    use Notifiable;

    protected $primaryKey = 'account_id';

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\ResetPasswordNotification($token));
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password_hash',
        'role',
        'otp_code',
        'otp_expires',
        'credit',
        'verified',
        'status',
        'job_repair',
        'job_admin',
        'job_complaint',
        'invited_by',
        'invitation_sent_at',
        'invitation_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'otp_expires' => 'datetime',
            'password_hash' => 'hashed',
            'verified' => 'boolean',
            'job_repair' => 'boolean',
            'job_admin' => 'boolean',
            'job_complaint' => 'boolean',
            'credit' => 'integer',
            'invitation_sent_at' => 'datetime',
            'invitation_expires_at' => 'datetime',
        ];
    }

    /**
     * Accessor for name (combines first_name and last_name)
     */
    public function getNameAttribute()
    {
        if ($this->first_name && $this->last_name) {
            return $this->first_name . ' ' . $this->last_name;
        }
        return $this->first_name ?: $this->last_name ?: $this->email;
    }

    // Relationships

    public function jobs()
    {
        return $this->hasMany(Job::class, 'created_by');
    }

    public function requestsRepair()
    {
        return $this->hasMany(RequestRepair::class, 'account_id');
    }

    public function requestsComplaint()
    {
        return $this->hasMany(RequestComplaint::class, 'account_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Helpers
    public function isPending()
    {
        return $this->status === 'pending';
    }
}
