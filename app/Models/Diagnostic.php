<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diagnostic extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'mode',
        'overall_score',
        'classification',
        'strengths',
        'improvements',
        'metadata',
    ];

    protected $casts = [
        'strengths' => 'array',
        'improvements' => 'array',
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function responses()
    {
        return $this->hasMany(DiagnosticResponse::class);
    }

    public function recommendations()
    {
        return $this->hasMany(Recommendation::class);
    }
}
