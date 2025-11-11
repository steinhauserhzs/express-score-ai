<?php

namespace App\Services;

use Illuminate\Support\MessageBag;

class DiagnosticValidator
{
    public function validate(array $answers): MessageBag
    {
        $errors = new MessageBag();

        if (($answers['dividas_valor'] ?? 0) > (($answers['renda_mensal'] ?? 0) * 36)) {
            $errors->add('dividas_valor', 'O valor das dívidas ultrapassa 36 vezes a renda mensal.');
        }

        return $errors;
    }
}
