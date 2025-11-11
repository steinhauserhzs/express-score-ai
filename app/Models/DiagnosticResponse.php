<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosticResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'diagnostic_id',
        'dimension',
        'score',
        'weight',
        'observation',
    ];

    public function diagnostic()
    {
        return $this->belongsTo(Diagnostic::class);
    }
}
