import React, { useState } from 'react';
import {
    FlatList,
    Pressable,
    Switch,
    Text,
    View,
} from 'react-native';

import { useStudy } from '../context/StudyContext';
import type { TabProps } from '../navigation/types';

import {
    courseName,
    formatDate,
    isOverdue,
    normalizeText,
} from '../utils/helpers';

import { TextInput } from 'react-native';

import {
    Page,
    Card,
    Body,
    Muted,
    Filters,
    EmptyState,
    SaveStatus,
    colors,
    styles,
} from '../components/UI';

const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chưa xong' },
    { value: 'done', label: 'Đã xong' },
    { value: 'overdue', label: 'Quá hạn' },
];

export default function AssignmentsScreen({
    navigation,
}: TabProps<'Assignments'>) {
    const { assignments, toggleAssignment, now } = useStudy();

    const [filter, setFilter] = useState('all');
    const [keyword, setKeyword] = useState('');

    const filtered = assignments
        .filter(item => {
            const matchesKeyword = normalizeText(
                `${item.title} ${courseName(item.courseId)}`,
            ).includes(normalizeText(keyword));

            if (!matchesKeyword) return false;
            if (filter === 'done') return item.completed;
            if (filter === 'pending') return !item.completed;
            if (filter === 'overdue') return isOverdue(item, now);

            return true;
        })
        .sort(
            (a, b) =>
                new Date(a.dueDate).getTime()
                - new Date(b.dueDate).getTime(),
        );

    return (
        <Page>
            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm bài tập hoặc môn học..."
                            placeholderTextColor={colors.muted}
                            value={keyword}
                            onChangeText={setKeyword}
                        />

                        <Filters
                            options={statusOptions}
                            selected={filter}
                            onChange={setFilter}
                        />

                        <SaveStatus />
                        <Muted>{filtered.length} bài tập</Muted>
                    </>
                }
                ListEmptyComponent={
                    <EmptyState message="Không có bài tập phù hợp." />
                }
                renderItem={({ item }) => (
                    <Card>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() =>
                                navigation.push('AssignmentDetail', {
                                    assignmentId: item.id,
                                })
                            }>
                            <Body>{item.title}</Body>
                            <Muted>{courseName(item.courseId)}</Muted>
                            <Muted>Hạn: {formatDate(item.dueDate)}</Muted>
                            <Text style={{ color: colors.primary }}>
                                Xem chi tiết →
                            </Text>
                        </Pressable>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 12,
                            }}>
                            <Text
                                style={{
                                    flex: 1,
                                    color: item.completed
                                        ? colors.success
                                        : isOverdue(item, now)
                                            ? colors.danger
                                            : colors.muted,
                                }}>
                                {item.completed
                                    ? 'Đã hoàn thành'
                                    : isOverdue(item, now)
                                        ? 'Chưa hoàn thành · Quá hạn'
                                        : 'Chưa hoàn thành'}
                            </Text>

                            <Switch
                                value={item.completed}
                                onValueChange={() => toggleAssignment(item.id)}
                                accessibilityLabel={`Hoàn thành ${item.title}`}
                            />
                        </View>
                    </Card>
                )}
            />
        </Page>
    );
}