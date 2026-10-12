import React from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudy } from '../context/StudyContext';

export const colors = {
    primary: '#2563EB',
    background: '#F1F5F9',
    text: '#0F172A',
    muted: '#64748B',
    border: '#CBD5E1',
    danger: '#B91C1C',
    success: '#15803D',
};

export function Page({
    children,
    detail = false,
}: {
    children: React.ReactNode;
    detail?: boolean;
}) {
    return (
        <SafeAreaView
            style={styles.page}
            edges={detail ? ['left', 'right', 'bottom'] : ['left', 'right']}>
            {children}
        </SafeAreaView>
    );
}

export function Content({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}>
            {children}
        </ScrollView>
    );
}

export function Title({ children }: { children: React.ReactNode }) {
    return <Text style={styles.title}>{children}</Text>;
}

export function Section({ children }: { children: React.ReactNode }) {
    return <Text style={styles.section}>{children}</Text>;
}

export function Body({ children }: { children: React.ReactNode }) {
    return <Text style={styles.body}>{children}</Text>;
}

export function Muted({ children }: { children: React.ReactNode }) {
    return <Text style={styles.muted}>{children}</Text>;
}

export function Card({
    children,
    onPress,
}: {
    children: React.ReactNode;
    onPress?: () => void;
}) {
    if (onPress) {
        return (
            <Pressable
                accessibilityRole="button"
                onPress={onPress}
                style={({ pressed }) => [
                    styles.card,
                    pressed && { opacity: 0.7 },
                ]}>
                {children}
            </Pressable>
        );
    }

    return <View style={styles.card}>{children}</View>;
}

export function Action({
    title,
    onPress,
    secondary = false,
}: {
    title: string;
    onPress: () => void;
    secondary?: boolean;
}) {
    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                secondary && { backgroundColor: '#E2E8F0' },
                pressed && { opacity: 0.7 },
            ]}>
            <Text
                style={[
                    styles.buttonText,
                    secondary && { color: colors.text },
                ]}>
                {title}
            </Text>
        </Pressable>
    );
}

export function EmptyState({
    message = 'Không có dữ liệu.',
}: {
    message?: string;
}) {
    return (
        <View style={styles.empty}>
            <Text style={styles.muted}>{message}</Text>
        </View>
    );
}

export function Filters({
    options,
    selected,
    onChange,
}: {
    options: { value: string; label: string }[];
    selected: string;
    onChange: (value: string) => void;
}) {
    return (
        <View style={styles.filters}>
            {options.map(option => (
                <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: selected === option.value }}
                    onPress={() => onChange(option.value)}
                    style={[
                        styles.chip,
                        selected === option.value && {
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                        },
                    ]}>
                    <Text
                        style={{
                            color: selected === option.value
                                ? '#FFFFFF'
                                : colors.text,
                        }}>
                        {option.label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

export function SaveStatus() {
    const { saving, saveError, retrySave } = useStudy();

    if (saveError) {
        return (
            <Card>
                <Text style={{ color: colors.danger }}>{saveError}</Text>
                <Action title="Thử lưu lại" onPress={retrySave} />
            </Card>
        );
    }

    return (
        <Muted>
            {saving ? 'Đang lưu...' : 'Dữ liệu đã lưu trên thiết bị'}
        </Muted>
    );
}

export const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 16,
        paddingBottom: 28,
    },
    title: {
        fontSize: 25,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 12,
    },
    section: {
        fontSize: 19,
        fontWeight: '700',
        color: colors.text,
        marginTop: 20,
        marginBottom: 12,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        color: colors.text,
        marginBottom: 6,
    },
    muted: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.muted,
        marginBottom: 6,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    button: {
        minHeight: 46,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: colors.text,
        fontSize: 16,
        marginBottom: 12,
    },
    filters: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
    },
    empty: {
        padding: 24,
        alignItems: 'center',
    },
});