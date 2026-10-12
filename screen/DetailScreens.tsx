import React from 'react';

import {
    courses,
    results,
    sessions,
} from '../data/mockData';

import { useStudy } from '../context/StudyContext';
import type { DetailProps } from '../navigation/types';

import {
    courseName,
    dayName,
    formatDate,
    gradeLabel,
    isOverdue,
    totalScore,
} from '../utils/helpers';

import {
    Page,
    Content,
    Card,
    Title,
    Section,
    Body,
    Muted,
    Action,
    EmptyState,
    SaveStatus,
} from '../components/UI';

function MissingData({ onBack }: { onBack: () => void }) {
    return (
        <Page detail>
            <Content>
                <EmptyState message="Không tìm thấy dữ liệu của mục đã chọn." />
                <Action title="Quay lại" onPress={onBack} />
            </Content>
        </Page>
    );
}

// 1. Chi tiết môn học
export function CourseDetailScreen({
    route,
    navigation,
}: DetailProps<'CourseDetail'>) {
    const { assignments } = useStudy();

    const course = courses.find(
        item => item.id === route.params.courseId,
    );

    if (!course) {
        return <MissingData onBack={() => navigation.goBack()} />;
    }

    const courseSessions = sessions
        .filter(item => item.courseId === course.id)
        .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start));

    const courseAssignments = assignments.filter(
        item => item.courseId === course.id,
    );

    return (
        <Page detail>
            <Content>
                <Title>{course.name}</Title>

                <Card>
                    <Body>Mã môn: {course.id}</Body>
                    <Body>Số tín chỉ: {course.credits}</Body>
                    <Body>Giảng viên: {course.teacher}</Body>
                    <Muted>{course.description}</Muted>
                </Card>

                <Section>Lịch học của môn</Section>

                {courseSessions.length === 0 ? (
                    <EmptyState message="Môn học chưa có lịch." />
                ) : (
                    courseSessions.map(session => (
                        <Card
                            key={session.id}
                            onPress={() =>
                                navigation.push('SessionDetail', {
                                    sessionId: session.id,
                                })
                            }>
                            <Body>
                                {dayName(session.day)} · {session.start} – {session.end}
                            </Body>
                            <Muted>Phòng {session.room}</Muted>
                        </Card>
                    ))
                )}

                <Section>Bài tập của môn</Section>

                {courseAssignments.length === 0 ? (
                    <EmptyState message="Môn học chưa có bài tập." />
                ) : (
                    courseAssignments.map(assignment => (
                        <Card
                            key={assignment.id}
                            onPress={() =>
                                navigation.push('AssignmentDetail', {
                                    assignmentId: assignment.id,
                                })
                            }>
                            <Body>{assignment.title}</Body>
                            <Muted>Hạn: {formatDate(assignment.dueDate)}</Muted>
                            <Muted>
                                {assignment.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                            </Muted>
                        </Card>
                    ))
                )}

                <Action
                    title="Xem kết quả môn học"
                    onPress={() =>
                        navigation.push('ResultDetail', { courseId: course.id })
                    }
                />

                <Action
                    title="Quay lại"
                    secondary
                    onPress={() => navigation.goBack()}
                />
            </Content>
        </Page>
    );
}

// 2. Chi tiết buổi học
export function SessionDetailScreen({
    route,
    navigation,
}: DetailProps<'SessionDetail'>) {
    const session = sessions.find(
        item => item.id === route.params.sessionId,
    );

    if (!session) {
        return <MissingData onBack={() => navigation.goBack()} />;
    }

    const course = courses.find(
        item => item.id === session.courseId,
    );

    return (
        <Page detail>
            <Content>
                <Title>{courseName(session.courseId)}</Title>

                <Card>
                    <Body>Ngày học: {dayName(session.day)}</Body>
                    <Body>Thời gian: {session.start} – {session.end}</Body>
                    <Body>Phòng học: {session.room}</Body>
                    <Body>Giảng viên: {course?.teacher ?? 'Chưa cập nhật'}</Body>
                    <Body>Nội dung: {session.topic}</Body>
                    <Muted>Lịch mẫu lặp lại hằng tuần.</Muted>
                </Card>

                <Action
                    title="Xem môn học"
                    onPress={() =>
                        navigation.push('CourseDetail', {
                            courseId: session.courseId,
                        })
                    }
                />

                <Action
                    title="Quay lại"
                    secondary
                    onPress={() => navigation.goBack()}
                />
            </Content>
        </Page>
    );
}

// 3. Chi tiết bài tập
export function AssignmentDetailScreen({
    route,
    navigation,
}: DetailProps<'AssignmentDetail'>) {
    const { assignments, toggleAssignment, now } = useStudy();

    const assignment = assignments.find(
        item => item.id === route.params.assignmentId,
    );

    if (!assignment) {
        return <MissingData onBack={() => navigation.goBack()} />;
    }

    return (
        <Page detail>
            <Content>
                <Title>{assignment.title}</Title>

                <Card>
                    <Body>Môn học: {courseName(assignment.courseId)}</Body>
                    <Body>Hạn nộp: {formatDate(assignment.dueDate)}</Body>
                    <Body>
                        Trạng thái: {assignment.completed
                            ? 'Đã hoàn thành'
                            : 'Chưa hoàn thành'}
                    </Body>

                    {isOverdue(assignment, now) ? (
                        <Body>Bài tập đã quá hạn nộp.</Body>
                    ) : null}

                    <Section>Yêu cầu bài tập</Section>
                    <Body>{assignment.description}</Body>
                </Card>

                <Action
                    title={assignment.completed
                        ? 'Đánh dấu chưa hoàn thành'
                        : 'Đánh dấu đã hoàn thành'}
                    onPress={() => toggleAssignment(assignment.id)}
                />

                <SaveStatus />

                <Action
                    title="Xem môn học"
                    secondary
                    onPress={() =>
                        navigation.push('CourseDetail', {
                            courseId: assignment.courseId,
                        })
                    }
                />

                <Action
                    title="Quay lại"
                    secondary
                    onPress={() => navigation.goBack()}
                />
            </Content>
        </Page>
    );
}

// 4. Chi tiết kết quả học tập
export function ResultDetailScreen({
    route,
    navigation,
}: DetailProps<'ResultDetail'>) {
    const result = results.find(
        item => item.courseId === route.params.courseId,
    );

    if (!result) {
        return <MissingData onBack={() => navigation.goBack()} />;
    }

    const score = totalScore(result);

    return (
        <Page detail>
            <Content>
                <Title>{courseName(result.courseId)}</Title>

                <Card>
                    <Body>Điểm quá trình: {result.process}</Body>
                    <Body>Điểm giữa kỳ: {result.midterm}</Body>
                    <Body>Điểm cuối kỳ: {result.final ?? 'Chưa có'}</Body>
                </Card>

                <Card>
                    <Body>
                        Tổng kết: {score === null ? 'Chưa có' : score.toFixed(2)}
                    </Body>

                    {score !== null ? (
                        <>
                            <Body>Điểm chữ: {gradeLabel(score)}</Body>
                            <Body>Kết quả: {score >= 4 ? 'Đạt' : 'Chưa đạt'}</Body>
                        </>
                    ) : (
                        <Muted>Chờ điểm cuối kỳ để tính tổng kết.</Muted>
                    )}
                </Card>

                <Section>Cách tính minh họa</Section>
                <Body>Quá trình × 20% + Giữa kỳ × 30% + Cuối kỳ × 50%</Body>
                <Muted>
                    A: từ 8,5 · B: từ 7 · C: từ 5,5 · D: từ 4 · F: dưới 4.
                    Đây là quy ước mẫu, có thể sửa theo quy định trường.
                </Muted>

                <Action
                    title="Quay lại"
                    onPress={() => navigation.goBack()}
                />
            </Content>
        </Page>
    );
}