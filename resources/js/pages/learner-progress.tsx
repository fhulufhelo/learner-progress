import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { home } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowUpDown, Filter, X, Users, BookOpen, TrendingUp } from 'lucide-react';

interface Course {
    id: number;
    name: string;
}

interface Enrolment {
    course_id: number;
    course_name: string;
    progress: number;
}

interface Learner {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    enrolments: Enrolment[];
    average_progress: number;
}

interface LearnerProgressProps {
    learners: Learner[];
    courses: Course[];
    filters: {
        course_id?: number;
        sort?: 'asc' | 'desc';
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: home().url,
    },
    {
        title: 'Learner Progress',
        href: '/learner-progress',
    },
];

export default function LearnerProgress({
                                            learners,
                                            courses,
                                            filters,
                                        }: LearnerProgressProps) {
    const handleCourseFilter = (courseId: string) => {
        router.get(
            '/learner-progress',
            {
                course_id: courseId === 'all' ? undefined : courseId,
                sort: filters.sort,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleSortToggle = () => {
        const newSort = filters.sort === 'asc' ? 'desc' : 'asc';
        router.get(
            '/learner-progress',
            {
                course_id: filters.course_id,
                sort: newSort,
            },
            {
                preserveState: true,
            },
        );
    };

    const clearFilters = () => {
        router.get('/learner-progress');
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-[#c69930]'; // goldenrod for high progress
        if (progress >= 50) return 'bg-[#d4af37]'; // lighter gold for medium
        return 'bg-[#8b7355]'; // brown for low progress
    };

    const selectedCourse = courses.find((c) => c.id === filters.course_id);
    const hasFilters = filters.course_id || filters.sort;

    const overallAverage =
        learners.length > 0
            ? (
                learners.reduce(
                    (sum, l) => sum + l.average_progress,
                    0,
                ) / learners.length
            ).toFixed(1)
            : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Learner Progress" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header + Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#c69930]">
                            Learner Progress Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Track learner progress across all enrolled courses
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Select
                            value={filters.course_id?.toString() || 'all'}
                            onValueChange={handleCourseFilter}
                        >
                            <SelectTrigger className="min-w-[180px] md:w-[220px] bg-white border-[#c69930]/30">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by course" />
                            </SelectTrigger>
                            <SelectContent className="w-[320px] bg-white border-[#c69930]/30">
                                <SelectItem value="all" className="hover:bg-[#fbf8f1] focus:bg-[#fbf8f1]">All Courses</SelectItem>
                                {courses.map((course) => (
                                    <SelectItem
                                        key={course.id}
                                        value={course.id.toString()}
                                        className="hover:bg-[#fbf8f1] focus:bg-[#fbf8f1]"
                                    >
                                        <span className="block max-w-[280px] truncate">
                                            {course.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={handleSortToggle}
                            className="gap-2 bg-white border-[#c69930]/30 hover:bg-[#c69930] hover:text-white hover:border-[#c69930]"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            Sort by Progress
                            {filters.sort && (
                                <Badge variant="secondary" className="ml-1 bg-[#c69930] text-white">
                                    {filters.sort === 'asc' ? '↑' : '↓'}
                                </Badge>
                            )}
                        </Button>

                        {hasFilters && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="gap-2 hover:bg-[#c69930] hover:text-white"
                            >
                                <X className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Active Filters */}
                {hasFilters && (
                    <div className="flex flex-wrap gap-2">
                        {selectedCourse && (
                            <Badge variant="outline" className="gap-1 border-[#c69930] text-[#c69930] bg-white">
                                Course: {selectedCourse.name}
                            </Badge>
                        )}
                        {filters.sort && (
                            <Badge variant="outline" className="gap-1 border-[#c69930] text-[#c69930] bg-white">
                                Sorted:{' '}
                                {filters.sort === 'asc'
                                    ? 'Low to High'
                                    : 'High to Low'}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Stats Cards with Icons */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-[#c69930]/20 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                    Total Learners
                                </div>
                                <div className="mt-1 text-2xl font-bold text-[#c69930]">
                                    {learners.length}
                                </div>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c69930]/10">
                                <Users className="h-6 w-6 text-[#c69930]" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#c69930]/20 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                    Total Courses
                                </div>
                                <div className="mt-1 text-2xl font-bold text-[#c69930]">
                                    {courses.length}
                                </div>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c69930]/10">
                                <BookOpen className="h-6 w-6 text-[#c69930]" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#c69930]/20 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                    Average Progress
                                </div>
                                <div className="mt-1 text-2xl font-bold text-[#c69930]">
                                    {overallAverage}%
                                </div>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c69930]/10">
                                <TrendingUp className="h-6 w-6 text-[#c69930]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-[#c69930]/20 shadow-sm bg-white">
                    <Table className="min-w-[640px]">
                        <TableHeader>
                            <TableRow className="border-b border-[#c69930]/20 hover:bg-[#fbf8f1]">
                                <TableHead className="min-w-[160px] md:w-[220px] font-semibold text-[#272727]">
                                    Learner Name
                                </TableHead>
                                <TableHead className="font-semibold text-[#272727]">Enrolled Courses</TableHead>
                                <TableHead className="text-right font-semibold text-[#272727]">
                                    Average Progress
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {learners.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No learners found with the selected
                                        filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                learners.map((learner) => (
                                    <TableRow key={learner.id} className="border-b border-[#c69930]/10 hover:bg-[#fbf8f1]/50">
                                        <TableCell className="font-medium">
                                            {learner.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                {learner.enrolments.map(
                                                    (enrolment) => (
                                                        <Badge
                                                            key={
                                                                enrolment.course_id
                                                            }
                                                            variant="outline"
                                                            className="gap-2 border-[#c69930]/30 hover:bg-[#c69930] hover:text-white"
                                                        >
                                                            {
                                                                enrolment.course_name
                                                            }
                                                            <span className="font-semibold">
                                                                {
                                                                    enrolment.progress
                                                                }
                                                                %
                                                            </span>
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="flex h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className={`${getProgressColor(
                                                            learner.average_progress,
                                                        )} transition-all`}
                                                        style={{
                                                            width: `${learner.average_progress}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-12 font-semibold text-[#c69930]">
                                                    {learner.average_progress.toFixed(
                                                        1,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}