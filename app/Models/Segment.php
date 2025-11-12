<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'lead_count',
        'conversion_rate',
        'criteria',
    ];

    protected $casts = [
        'criteria' => 'array',
    ];
}
