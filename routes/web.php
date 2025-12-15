<?php

use App\Http\Controllers\LearnerProgressController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

Route::get('/learner-progress', [LearnerProgressController::class, 'index'])
    ->name('learner-progress');