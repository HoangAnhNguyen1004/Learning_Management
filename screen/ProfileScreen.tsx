import React, { useState } from 'react';

import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
} from 'react-native';

import { useHeaderHeight } from '@react-navigation/elements';

import { useStudy } from '../context/StudyContext';
import { courses, results } from '../data/mockData';
import type { TabProps } from '../navigation/types';

import {
    courseName,
    gradeLabel,
    totalScore,
} from '../utils/helpers';

import {
    Page,
    Card,
    Title,
    Section,
    Body,
    Muted,
    Action,
    EmptyState,
    SaveStatus,
    styles,
    colors,
} from '../components/UI';

export default function ProfileScreen({
    navigation,
}: TabProps<'Profile'>) {
    const { student, updateStudent } = useStudy();
    const headerHeight = useHeaderHeight();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(student.name);
    const [email, setEmail] = useState(student.email);
    const [phone, setPhone] = useState(student.phone);
    const [error, setError] = useState('');

    let weightedSum = 0;
    let countedCredits = 0;

    results.forEach(result => {
        const score = totalScore(result);
        const course = courses.find(item => item.id === result.courseId);

        if (score !== null && course) {
            weightedSum += score * course.credits;
            countedCredits += course.credits;
        }
    });

    const average = countedCredits > 0
        ? (weightedSum / countedCredits).toFixed(2)
        : 'Chưa có';

    function startEditing() {
        setName(student.name);
        setEmail(student.email);
        setPhone(student.phone);
        setError('');
        setEditing(true);
    }

    function saveProfile() {
        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanPhone = phone.replace(/[\s.-]/g, '');

        if (cleanName.length < 2) {
            setError('Họ tên cần ít nhất 2 ký tự.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            setError('Email chưa hợp lệ.');
            return;
        }

        if (!/^(0\d{9}|\+84\d{9})$/.test(cleanPhone)) {
            setError('Số điện thoại cần 10 số bắt đầu bằng 0 hoặc dạng +84.');
            return;
        }

        updateStudent({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
        });

        setError('');
        setEditing(false);
        Alert.alert('Đã cập nhật', 'Thông tin đang được lưu trên thiết bị.');
    }

    return (
        <Page>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={headerHeight}>
                <FlatList
                    data={results}
                    keyExtractor={item => item.courseId}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.content}
                    ListHeaderComponent={
                        <>
                            <Title>Hồ sơ sinh viên</Title>

                            <Card>
                                <Body>Mã sinh viên: {student.id}</Body>
                                <Body>Lớp: {student.className}</Body>
                                <Body>Ngành: {student.major}</Body>

                                {editing ? (
                                    <>
                                        <Muted>Họ và tên</Muted>
                                        <TextInput
                                            style={styles.input}
                                            value={name}
                                            onChangeText={setName}
                                            maxLength={80}
                                        />

                                        <Muted>Email</Muted>
                                        <TextInput
                                            style={styles.input}
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            maxLength={120}
                                        />

                                        <Muted>Số điện thoại</Muted>
                                        <TextInput
                                            style={styles.input}
                                            value={phone}
                                            onChangeText={setPhone}
                                            keyboardType="phone-pad"
                                            maxLength={20}
                                        />

                                        {error ? (
                                            <Text style={{ color: colors.danger }}>
                                                {error}
                                            </Text>
                                        ) : null}

                                        <Action title="Lưu thông tin" onPress={saveProfile} />

                                        <Action
                                            title="Hủy"
                                            secondary
                                            onPress={() => setEditing(false)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Body>Họ tên: {student.name}</Body>
                                        <Body>Email: {student.email}</Body>
                                        <Body>Điện thoại: {student.phone}</Body>
                                        <Action
                                            title="Chỉnh sửa thông tin"
                                            onPress={startEditing}
                                        />
                                    </>
                                )}
                            </Card>

                            <SaveStatus />

                            <Section>Kết quả học tập</Section>

                            <Card>
                                <Body>Điểm trung bình hệ 10: {average}</Body>
                                <Muted>
                                    Tính theo {countedCredits} tín chỉ đã có điểm cuối kỳ.
                                </Muted>
                                <Muted>
                                    Điểm và thang xếp loại là dữ liệu minh họa.
                                </Muted>
                            </Card>
                        </>
                    }
                    ListEmptyComponent={
                        <EmptyState message="Chưa có kết quả học tập." />
                    }
                    renderItem={({ item }) => {
                        const score = totalScore(item);

                        return (
                            <Card
                                onPress={() =>
                                    navigation.push('ResultDetail', {
                                        courseId: item.courseId,
                                    })
                                }>
                                <Body>{courseName(item.courseId)}</Body>

                                <Muted>
                                    {score === null
                                        ? 'Chưa có điểm cuối kỳ'
                                        : `Tổng kết: ${score.toFixed(2)} · ${gradeLabel(score)}`}
                                </Muted>
                            </Card>
                        );
                    }}
                />
            </KeyboardAvoidingView>
        </Page>
    );
}