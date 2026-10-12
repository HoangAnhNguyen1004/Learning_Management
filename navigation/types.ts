import type {
    CompositeScreenProps,
    NavigatorScreenParams,
} from '@react-navigation/native';

import type {
    BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import type {
    NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type MainTabParamList = {
    Overview: undefined;
    Courses: undefined;
    Schedule: undefined;
    Assignments: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
    CourseDetail: { courseId: string };
    SessionDetail: { sessionId: string };
    AssignmentDetail: { assignmentId: string };
    ResultDetail: { courseId: string };
};

export type TabProps<T extends keyof MainTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MainTabParamList, T>,
        NativeStackScreenProps<RootStackParamList, 'MainTabs'>
    >;

export type DetailProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;