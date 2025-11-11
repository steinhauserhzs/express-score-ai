<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'summary',
        'url',
        'estimated_minutes',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function recommendations()
    {
        return $this->belongsToMany(Recommendation::class, 'recommendation_resource');
    }
}
