import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { MainTabParamList } from './types';

import OverviewScreen from '../screen/OverviewScreen';
import CoursesScreen from '../screen/CoursesScreen';
import ScheduleScreen from '../screen/ScheduleScreen';
import AssignmentsScreen from '../screen/AssignmentsScreen';
import ProfileScreen from '../screen/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const icons: Record<keyof MainTabParamList, string> = {
    Overview: '⌂',
    Courses: '▤',
    Schedule: '▦',
    Assignments: '✓',
    Profile: '●',
};

export default function MainTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Overview"
            screenOptions={({ route }) => ({
                headerTitleAlign: 'center',
                headerTintColor: '#0F172A',
                headerStyle: { backgroundColor: '#FFFFFF' },
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#64748B',
                tabBarLabelStyle: { fontSize: 10 },
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => (
                    <Text style={{ color, fontSize: size }}>
                        {icons[route.name]}
                    </Text>
                ),
            })}>
            <Tab.Screen
                name="Overview"
                component={OverviewScreen}
                options={{ title: 'Tổng quan' }}
            />

            <Tab.Screen
                name="Courses"
                component={CoursesScreen}
                options={{ title: 'Môn học' }}
            />

            <Tab.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{
                    title: 'Thời khóa biểu',
                    tabBarLabel: 'Lịch học',
                }}
            />

            <Tab.Screen
                name="Assignments"
                component={AssignmentsScreen}
                options={{ title: 'Bài tập' }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Cá nhân và kết quả',
                    tabBarLabel: 'Cá nhân',
                }}
            />
        </Tab.Navigator>
    );
}