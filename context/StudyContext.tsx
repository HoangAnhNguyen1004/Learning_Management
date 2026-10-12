import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Button,
    Text,
    View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    createAssignments,
    initialStudent,
} from '../data/mockData';

import type {
    Assignment,
    Student,
} from '../data/mockData';

type SavedData = {
    version: 1;
    student: Student;
    assignments: Assignment[];
};

type StudyContextValue = {
    student: Student;
    assignments: Assignment[];
    now: number;
    saving: boolean;
    saveError: string;
    toggleAssignment: (id: string) => void;
    updateStudent: (
        values: Pick<Student, 'name' | 'email' | 'phone'>,
    ) => void;
    retrySave: () => void;
};

const STORAGE_KEY = '@study-manager/v1';

const StudyContext = createContext<StudyContextValue | undefined>(
    undefined,
);

// Kiểm tra dữ liệu đọc từ bộ nhớ trước khi sử dụng.
function isSavedData(value: unknown): value is SavedData {
    if (!value || typeof value !== 'object') return false;

    const data = value as Partial<SavedData>;
    const student = data.student;

    if (data.version !== 1 || !student) return false;

    const validStudent = [
        student.id,
        student.name,
        student.className,
        student.major,
        student.email,
        student.phone,
    ].every(field => typeof field === 'string');

    return validStudent
        && Array.isArray(data.assignments)
        && data.assignments.every(item =>
            item
            && typeof item.id === 'string'
            && typeof item.courseId === 'string'
            && typeof item.title === 'string'
            && typeof item.description === 'string'
            && typeof item.completed === 'boolean'
            && typeof item.dueDate === 'string'
            && Number.isFinite(Date.parse(item.dueDate)),
        );
}

export function StudyProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [student, setStudent] = useState<Student>(initialStudent);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [ready, setReady] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [loadAttempt, setLoadAttempt] = useState(0);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveAttempt, setSaveAttempt] = useState(0);
    const [now, setNow] = useState(Date.now());

    // Xếp hàng các lần ghi để dữ liệu cũ không ghi đè dữ liệu mới.
    const writeQueue = useRef<Promise<void>>(Promise.resolve());
    const latestWrite = useRef(0);

    useEffect(() => {
        let active = true;

        async function load() {
            setLoadError('');

            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);

                if (!active) return;

                if (raw) {
                    const parsed: unknown = JSON.parse(raw);

                    if (!isSavedData(parsed)) {
                        throw new Error('Invalid saved data');
                    }

                    setStudent(parsed.student);
                    setAssignments(parsed.assignments);
                } else {
                    setStudent(initialStudent);
                    setAssignments(createAssignments());
                }

                setReady(true);
            } catch {
                if (active) {
                    setLoadError(
                        'Không đọc được dữ liệu đã lưu. Hãy thử lại. '
                        + 'Ứng dụng chưa ghi đè dữ liệu của bạn.',
                    );
                }
            }
        }

        void load();

        return () => {
            active = false;
        };
    }, [loadAttempt]);

    useEffect(() => {
        if (!ready) return;

        const id = ++latestWrite.current;

        const payload: SavedData = {
            version: 1,
            student,
            assignments,
        };

        setSaving(true);
        setSaveError('');

        writeQueue.current = writeQueue.current
            .then(() =>
                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)),
            )
            .then(() => {
                if (id === latestWrite.current) {
                    setSaving(false);
                    setSaveError('');
                }
            })
            .catch(() => {
                if (id === latestWrite.current) {
                    setSaving(false);
                    setSaveError(
                        'Chưa lưu được vào máy. Thay đổi hiện vẫn còn trong ứng dụng.',
                    );
                }
            });
    }, [student, assignments, ready, saveAttempt]);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(timer);
    }, []);

    function toggleAssignment(id: string) {
        setAssignments(current =>
            current.map(item =>
                item.id === id
                    ? { ...item, completed: !item.completed }
                    : item,
            ),
        );
    }

    function updateStudent(
        values: Pick<Student, 'name' | 'email' | 'phone'>,
    ) {
        setStudent(current => ({ ...current, ...values }));
    }

    if (!ready) {
        return (
            <View
                style={{
                    flex: 1,
                    padding: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {loadError ? (
                    <>
                        <Text style={{ marginBottom: 16 }}>{loadError}</Text>
                        <Button
                            title="Thử đọc lại"
                            onPress={() => setLoadAttempt(value => value + 1)}
                        />
                    </>
                ) : (
                    <>
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text style={{ marginTop: 12 }}>Đang tải dữ liệu...</Text>
                    </>
                )}
            </View>
        );
    }

    return (
        <StudyContext.Provider
            value={{
                student,
                assignments,
                now,
                saving,
                saveError,
                toggleAssignment,
                updateStudent,
                retrySave: () => setSaveAttempt(value => value + 1),
            }}>
            {children}
        </StudyContext.Provider>
    );
}

export function useStudy() {
    const context = useContext(StudyContext);

    if (!context) {
        throw new Error('useStudy phải nằm trong StudyProvider');
    }

    return context;
}