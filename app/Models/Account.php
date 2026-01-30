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
        // Suspension fields
        'suspended_at',
        'suspension_type',
        'suspension_start',
        'suspension_end',
        'suspension_reason',
        'suspended_by',
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
            'suspended_at' => 'datetime',
            'suspension_start' => 'datetime',
            'suspension_end' => 'datetime',
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

    /**
     * Derived suspension status (permanent/temporary/null)
     */
    public function suspensionStatus(): ?string
    {
        if (!$this->suspended_at) return null;
        if ($this->suspension_type === 'permanent') return 'permanent';
        if ($this->suspension_type === 'temporary' && 
            now()->between($this->suspension_start, $this->suspension_end)) {
            return 'temporary';
        }
        return null;
    }

    public function isSuspended(): bool
    {
        return $this->suspensionStatus() !== null;
    }

    /**
     * Check if temporary suspension has expired and auto-unsuspend
     */
    public function checkAndUpdateSuspensionStatus(): void
    {
        // Only check for temporary suspensions that have expired
        if ($this->status === 'suspended' && 
            $this->suspension_type === 'temporary' && 
            $this->suspension_end && 
            now()->gt($this->suspension_end)) {
            
            // Auto-unsuspend: clear suspension fields and set status to active
            $this->update([
                'status' => 'active',
                'suspended_at' => null,
                'suspension_type' => null,
                'suspension_start' => null,
                'suspension_end' => null,
                'suspension_reason' => null,
                'suspended_by' => null,
            ]);
        }
    }

    public function scopeSuspended($query)
    {
        return $query->whereNotNull('suspended_at');
    }

    public function suspendedBy()
    {
        return $this->belongsTo(Account::class, 'suspended_by', 'account_id');
    }

    public function suspensionLogs()
    {
        return $this->hasMany(SuspensionLog::class, 'account_id', 'account_id');
    }
}
