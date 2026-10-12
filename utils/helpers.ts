import { courses } from '../data/mockData';
import type { Assignment, StudyResult } from '../data/mockData';

export function courseName(courseId: string): string {
    return courses.find(course => course.id === courseId)?.name
        ?? 'Môn học không tồn tại';
}

export function dayName(day: number): string {
    return day === 8 ? 'Chủ nhật' : `Thứ ${day}`;
}

export function formatDate(value: string): string {
    const date = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');

    return `${pad(date.getDate())}/${pad(
        date.getMonth() + 1,
    )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
        date.getMinutes(),
    )}`;
}

export function normalizeText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .toLowerCase()
        .trim();
}

export function isOverdue(
    assignment: Assignment,
    now = Date.now(),
): boolean {
    return !assignment.completed
        && new Date(assignment.dueDate).getTime() < now;
}

export function totalScore(result: StudyResult): number | null {
    if (result.final === null) {
        return null;
    }

    return Math.round(
        (result.process * 0.2
            + result.midterm * 0.3
            + result.final * 0.5) * 100,
    ) / 100;
}

export function gradeLabel(score: number): string {
    if (score >= 8.5) return 'A';
    if (score >= 7) return 'B';
    if (score >= 5.5) return 'C';
    if (score >= 4) return 'D';
    return 'F';
}