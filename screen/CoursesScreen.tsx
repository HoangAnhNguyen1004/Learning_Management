import React, { useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';

import { courses } from '../data/mockData';
import { normalizeText } from '../utils/helpers';
import type { TabProps } from '../navigation/types';

import {
    Page,
    Card,
    Body,
    Muted,
    EmptyState,
    styles,
} from '../components/UI';

export default function CoursesScreen({
    navigation,
}: TabProps<'Courses'>) {
    const [keyword, setKeyword] = useState('');

    const filtered = courses.filter(course =>
        normalizeText(`${course.name} ${course.id}`).includes(
            normalizeText(keyword),
        ),
    );

    return (
        <Page>
            <View style={{ padding: 16, paddingBottom: 0 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Tìm tên hoặc mã môn học..."
                    placeholderTextColor="#64748B"
                    value={keyword}
                    onChangeText={setKeyword}
                    accessibilityLabel="Tìm môn học"
                />

                <Muted>Tìm thấy {filtered.length} môn học</Muted>
            </View>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.content}
                ListEmptyComponent={
                    <EmptyState message="Không tìm thấy môn học phù hợp." />
                }
                renderItem={({ item }) => (
                    <Card
                        onPress={() =>
                            navigation.push('CourseDetail', {
                                courseId: item.id,
                            })
                        }>
                        <Body>{item.name}</Body>
                        <Muted>Mã môn: {item.id}</Muted>
                        <Muted>Số tín chỉ: {item.credits}</Muted>
                        <Muted>Giảng viên: {item.teacher}</Muted>
                    </Card>
                )}
            />
        </Page>
    );
}