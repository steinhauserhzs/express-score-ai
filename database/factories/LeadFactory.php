<?php

namespace Database\Factories;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'company_name' => $this->faker->company(),
            'contact_name' => $this->faker->name(),
            'email' => $this->faker->unique()->companyEmail(),
            'phone' => $this->faker->phoneNumber(),
            'score' => $this->faker->numberBetween(30, 95),
            'status' => $this->faker->randomElement(['new', 'engaged', 'proposal', 'won', 'lost']),
            'metadata' => ['segment' => $this->faker->randomElement(['SaaS', 'Educação', 'Saúde'])],
        ];
    }
}
