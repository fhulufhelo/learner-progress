<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Learner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearnerProgressController extends Controller
{
    public function index(Request $request)
    {
        $query = Learner::with(['enrolments.course']);

        if ($request->filled('course_id')) {
            $query->whereHas('enrolments', function ($q) use ($request) {
                $q->where('course_id', $request->course_id);
            });
        }

        $learners = $query->get()->map(function ($learner) use ($request) {
            $enrolments = $learner->enrolments;
            if ($request->filled('course_id')) {
                $enrolments = $enrolments->where('course_id', $request->course_id);
            }

            return [
                'id' => $learner->id,
                'name' => $learner->full_name,
                'firstname' => $learner->firstname,
                'lastname' => $learner->lastname,
                'enrolments' => $enrolments->map(function ($enrolment) {
                    return [
                        'course_id' => $enrolment->course_id,
                        'course_name' => $enrolment->course->name,
                        'progress' => (float) $enrolment->progress,
                    ];
                })->values(),
                'average_progress' => $enrolments->avg('progress') ?? 0,
            ];
        });

        if ($request->filled('sort')) {
            $learners = $request->sort === 'asc'
                ? $learners->sortBy('average_progress')
                : $learners->sortByDesc('average_progress');
        }

        $courses = Course::orderBy('name')->get(['id', 'name']);

        return Inertia::render('learner-progress', [
            'learners' => $learners->values(),
            'courses' => $courses,
            'filters' => [
                'course_id' => $request->course_id,
                'sort' => $request->sort,
            ],
        ]);
    }
}
