import React from 'react';
import { StatusBar } from 'react-native';

import {
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StudyProvider } from './context/StudyContext';
import MainTabs from './navigation/MainTabs';
import type { RootStackParamList } from './navigation/types';

import {
  CourseDetailScreen,
  SessionDetailScreen,
  AssignmentDetailScreen,
  ResultDetailScreen,
} from './screen/DetailScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563EB',
    background: '#F1F5F9',
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#E2E8F0',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />

      <StudyProvider>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            initialRouteName="MainTabs"
            screenOptions={{
              headerTitleAlign: 'center',
              headerTintColor: '#0F172A',
              contentStyle: { backgroundColor: '#F1F5F9' },
            }}>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="CourseDetail"
              component={CourseDetailScreen}
              options={{ title: 'Chi tiết môn học' }}
            />

            <Stack.Screen
              name="SessionDetail"
              component={SessionDetailScreen}
              options={{ title: 'Chi tiết buổi học' }}
            />

            <Stack.Screen
              name="AssignmentDetail"
              component={AssignmentDetailScreen}
              options={{ title: 'Chi tiết bài tập' }}
            />

            <Stack.Screen
              name="ResultDetail"
              component={ResultDetailScreen}
              options={{ title: 'Kết quả học tập' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StudyProvider>
    </SafeAreaProvider>
  );
}