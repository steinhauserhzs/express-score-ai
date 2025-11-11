<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diagnostic extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'raw_answers',
        'score_total',
        'scores_by_dimension',
        'financial_profile',
    ];

    protected $casts = [
        'raw_answers' => 'array',
        'scores_by_dimension' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function isCompleted(): Attribute
    {
        return Attribute::get(fn () => $this->status === 'completed');
    }
}
