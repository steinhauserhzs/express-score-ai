<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetricSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'metric',
        'value',
        'change',
        'metadata',
        'captured_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'captured_at' => 'datetime',
    ];
}
