<?php

if (! function_exists('percentage_change')) {
    function percentage_change(float $current, float $previous): float
    {
        if ($previous == 0.0) {
            return $current === 0.0 ? 0.0 : 100.0;
        }

        return (($current - $previous) / $previous) * 100;
    }
}

if (! function_exists('score_color')) {
    function score_color(float $score): string
    {
        return match (true) {
            $score >= 85 => 'success',
            $score >= 70 => 'warning',
            default => 'danger',
        };
    }
}
