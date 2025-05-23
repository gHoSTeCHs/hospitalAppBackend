<?php

use App\Models\Hospital;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hospital_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Hospital::class);
            $table->string('document_title');
            $table->enum('document_type', ['approved', 'rejected', 'pending'])->default('pending');
            $table->string('path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hospital_documents');
    }
};
