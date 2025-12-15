# Learner Progress Dashboard

A Laravel 12 + React application to track learner progress across enrolled courses.

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- SQLite

## Installation

1. **Install PHP dependencies**
```bash
   composer install
```

2. **Install Node dependencies**
```bash
   npm install
```

3. **Configure environment**
```bash
   cp .env.example .env
   php artisan key:generate
```

4. **Setup database**
```bash
   php artisan migrate --seed
```
This creates 50+ learners, 29 courses, and 200+ enrolments.

5. **Generate TypeScript routes**
```bash
   php artisan wayfinder:generate
```

## Running the Application

1. **Start the Laravel server**
```bash
   php artisan serve
```

2. **Start Vite dev server** (in a new terminal)
```bash
   npm run dev
```

3. **Visit the app**
```
   http://localhost:8000/learner-progress
```

## Features

- View all learners with their enrolled courses
- Filter learners by course
- Sort by average progress (ascending/descending)
- Visual progress indicators with color coding
- Real-time statistics dashboard

## Tech Stack

- Laravel 12
- React 19
- Inertia.js 2
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- SQLite