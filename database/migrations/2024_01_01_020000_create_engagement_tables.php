<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('progress')->default(0);
            $table->string('status')->default('not_started');
            $table->date('target_date')->nullable();
            $table->timestamps();
        });

        Schema::create('smart_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->text('message');
            $table->string('action_url')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamps();
        });

        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('consultant_id')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->dateTime('scheduled_at');
            $table->string('status')->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('contact_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->unsignedTinyInteger('score')->default(0);
            $table->string('status')->default('new');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('learning_resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type');
            $table->text('summary');
            $table->string('url');
            $table->unsignedSmallInteger('estimated_minutes');
            $table->json('tags')->nullable();
            $table->timestamps();
        });

        Schema::create('recommendation_resource', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recommendation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('learning_resource_id')->constrained()->cascadeOnDelete();
        });

        Schema::create('metric_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('metric');
            $table->decimal('value', 12, 2);
            $table->decimal('change', 8, 2)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamp('captured_at');
            $table->timestamps();
        });

        Schema::create('segments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('lead_count')->default(0);
            $table->unsignedTinyInteger('conversion_rate')->default(0);
            $table->json('criteria')->nullable();
            $table->timestamps();
        });

        Schema::create('journey_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('points')->default(100);
            $table->timestamps();
        });

        Schema::create('badge_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('badge_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('unlocked_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('badge_user');
        Schema::dropIfExists('badges');
        Schema::dropIfExists('journey_steps');
        Schema::dropIfExists('segments');
        Schema::dropIfExists('metric_snapshots');
        Schema::dropIfExists('recommendation_resource');
        Schema::dropIfExists('learning_resources');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('consultations');
        Schema::dropIfExists('smart_alerts');
        Schema::dropIfExists('goals');
    }
};
