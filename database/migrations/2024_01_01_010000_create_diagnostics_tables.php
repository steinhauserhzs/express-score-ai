<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diagnostics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('mode')->default('complete');
            $table->unsignedTinyInteger('overall_score');
            $table->string('classification');
            $table->json('strengths')->nullable();
            $table->json('improvements')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('diagnostic_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diagnostic_id')->constrained()->cascadeOnDelete();
            $table->string('dimension');
            $table->unsignedTinyInteger('score');
            $table->unsignedTinyInteger('weight')->default(20);
            $table->text('observation')->nullable();
            $table->timestamps();
        });

        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('diagnostic_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('priority')->default('medium');
            $table->string('status')->default('open');
            $table->date('due_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendations');
        Schema::dropIfExists('diagnostic_responses');
        Schema::dropIfExists('diagnostics');
    }
};
