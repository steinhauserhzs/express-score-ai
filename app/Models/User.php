<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'profile' => 'array',
        'password' => 'hashed',
    ];

    public function diagnostics()
    {
        return $this->hasMany(Diagnostic::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function smartAlerts()
    {
        return $this->hasMany(SmartAlert::class);
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    public function badges()
    {
        return $this->belongsToMany(Badge::class)->withTimestamps()->withPivot('unlocked_at');
    }

    public function journey()
    {
        return $this->hasMany(JourneyStep::class);
    }
}
