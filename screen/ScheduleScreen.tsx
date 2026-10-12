import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

import { sessions } from '../data/mockData';
import { courseName, dayName } from '../utils/helpers';
import type { TabProps } from '../navigation/types';

import {
    Page,
    Card,
    Body,
    Muted,
    Filters,
    EmptyState,
    styles,
} from '../components/UI';

const dayOptions = [
    { value: 'all', label: 'Cả tuần' },
    ...[2, 3, 4, 5, 6, 7, 8].map(day => ({
        value: String(day),
        label: dayName(day),
    })),
];

export default function ScheduleScreen({
    navigation,
}: TabProps<'Schedule'>) {
    const [selectedDay, setSelectedDay] = useState('all');

    const filtered = sessions
        .filter(item =>
            selectedDay === 'all'
            || item.day === Number(selectedDay),
        )
        .sort(
            (a, b) => a.day - b.day || a.start.localeCompare(b.start),
        );

    return (
        <Page>
            <View style={{ padding: 16, paddingBottom: 0 }}>
                <Muted>Lịch học mẫu lặp lại hằng tuần</Muted>

                <Filters
                    options={dayOptions}
                    selected={selectedDay}
                    onChange={setSelectedDay}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.content}
                ListEmptyComponent={
                    <EmptyState message="Không có lịch học trong ngày này." />
                }
                renderItem={({ item }) => (
                    <Card
                        onPress={() =>
                            navigation.push('SessionDetail', {
                                sessionId: item.id,
                            })
                        }>
                        <Muted>
                            {dayName(item.day)} · {item.start} – {item.end}
                        </Muted>
                        <Body>{courseName(item.courseId)}</Body>
                        <Muted>Phòng: {item.room}</Muted>
                        <Muted>{item.topic}</Muted>
                    </Card>
                )}
            />
        </Page>
    );
}