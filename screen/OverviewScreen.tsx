import React from 'react';
import { FlatList } from 'react-native';

import { courses } from '../data/mockData';
import { useStudy } from '../context/StudyContext';
import type { TabProps } from '../navigation/types';

import {
    Page,
    Title,
    Section,
    Body,
    Muted,
    Card,
    EmptyState,
    SaveStatus,
    styles,
} from '../components/UI';

import {
    courseName,
    formatDate,
    isOverdue,
} from '../utils/helpers';

export default function OverviewScreen({
    navigation,
}: TabProps<'Overview'>) {
    const { student, assignments, now } = useStudy();

    const upcoming = assignments
        .filter(item => {
            const due = new Date(item.dueDate).getTime();

            return !item.completed
                && due >= now
                && due <= now + 7 * 24 * 60 * 60 * 1000;
        })
        .sort(
            (a, b) =>
                new Date(a.dueDate).getTime()
                - new Date(b.dueDate).getTime(),
        );

    const completedCount = assignments.filter(
        item => item.completed,
    ).length;

    const overdueCount = assignments.filter(
        item => isOverdue(item, now),
    ).length;

    const credits = courses.reduce(
        (sum, course) => sum + course.credits,
        0,
    );

    return (
        <Page>
            <FlatList
                data={upcoming}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        <Title>Xin chào, {student.name}</Title>

                        <Card>
                            <Body>Mã sinh viên: {student.id}</Body>
                            <Muted>{student.className} · {student.major}</Muted>
                            <Body>{courses.length} môn học · {credits} tín chỉ</Body>
                            <Body>
                                Hoàn thành: {completedCount}/{assignments.length} bài tập
                            </Body>
                            <Body>Quá hạn chưa hoàn thành: {overdueCount}</Body>
                        </Card>

                        <SaveStatus />

                        <Section>Môn học đang học</Section>

                        {courses.length === 0 ? (
                            <EmptyState message="Chưa có môn học." />
                        ) : (
                            courses.map(course => (
                                <Card
                                    key={course.id}
                                    onPress={() =>
                                        navigation.push('CourseDetail', {
                                            courseId: course.id,
                                        })
                                    }>
                                    <Body>{course.name}</Body>
                                    <Muted>
                                        {course.id} · {course.credits} tín chỉ
                                    </Muted>
                                </Card>
                            ))
                        )}

                        <Section>Bài tập đến hạn trong 7 ngày</Section>
                    </>
                }
                ListEmptyComponent={
                    <EmptyState message="Không có bài tập sắp đến hạn." />
                }
                renderItem={({ item }) => (
                    <Card
                        onPress={() =>
                            navigation.push('AssignmentDetail', {
                                assignmentId: item.id,
                            })
                        }>
                        <Body>{item.title}</Body>
                        <Muted>{courseName(item.courseId)}</Muted>
                        <Muted>Hạn nộp: {formatDate(item.dueDate)}</Muted>
                    </Card>
                )}
            />
        </Page>
    );
}