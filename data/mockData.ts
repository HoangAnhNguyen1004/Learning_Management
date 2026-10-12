//Kiểu dữ liệu và dữ liệu mẫu
export type Student = {
    id: string;
    name: string;
    className: string;
    major: string;
    email: string;
    phone: string;
};

export type Course = {
    id: string;
    name: string;
    credits: number;
    teacher: string;
    description: string;
};

export type Session = {
    id: string;
    courseId: string;
    day: number; // 2 = Thứ hai, ..., 8 = Chủ nhật
    start: string;
    end: string;
    room: string;
    topic: string;
};

export type Assignment = {
    id: string;
    courseId: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
};

export type StudyResult = {
    courseId: string;
    process: number;
    midterm: number;
    final: number | null;
};

export const initialStudent: Student = {
    id: '23110001',
    name: 'Nguyễn Minh Anh',
    className: '23110CL1',
    major: 'Công nghệ thông tin',
    email: 'minhanh@example.com',
    phone: '0901234567',
};

export const courses: Course[] = [
    {
        id: 'MOB101',
        name: 'Lập trình di động',
        credits: 3,
        teacher: 'Nguyễn Hoàng Nam',
        description:
            'Xây dựng ứng dụng React Native, quản lý trạng thái và điều hướng.',
    },
    {
        id: 'DBS201',
        name: 'Cơ sở dữ liệu',
        credits: 3,
        teacher: 'Trần Thị Lan',
        description:
            'Thiết kế cơ sở dữ liệu quan hệ, truy vấn SQL và chuẩn hóa dữ liệu.',
    },
    {
        id: 'NET201',
        name: 'Mạng máy tính',
        credits: 3,
        teacher: 'Lê Quốc Huy',
        description:
            'Tìm hiểu mô hình TCP/IP, địa chỉ IP và các giao thức mạng.',
    },
    {
        id: 'ENG201',
        name: 'Tiếng Anh chuyên ngành',
        credits: 2,
        teacher: 'Phạm Thu Hà',
        description:
            'Đọc hiểu tài liệu và giao tiếp tiếng Anh trong lĩnh vực CNTT.',
    },
    {
        id: 'SWE301',
        name: 'Công nghệ phần mềm',
        credits: 3,
        teacher: 'Võ Minh Đức',
        description:
            'Phân tích yêu cầu, thiết kế, kiểm thử và quản lý dự án phần mềm.',
    },
];

export const sessions: Session[] = [
    {
        id: 'S01',
        courseId: 'MOB101',
        day: 2,
        start: '07:00',
        end: '09:30',
        room: 'A1-302',
        topic: 'Component, Props và State',
    },
    {
        id: 'S02',
        courseId: 'DBS201',
        day: 2,
        start: '13:00',
        end: '15:30',
        room: 'A2-201',
        topic: 'Truy vấn SQL và phép JOIN',
    },
    {
        id: 'S03',
        courseId: 'NET201',
        day: 3,
        start: '07:00',
        end: '09:30',
        room: 'B1-204',
        topic: 'Địa chỉ IPv4 và chia subnet',
    },
    {
        id: 'S04',
        courseId: 'ENG201',
        day: 4,
        start: '09:45',
        end: '11:15',
        room: 'C1-105',
        topic: 'Reading technical documentation',
    },
    {
        id: 'S05',
        courseId: 'MOB101',
        day: 5,
        start: '13:00',
        end: '15:30',
        room: 'Lab-03',
        topic: 'Thực hành React Navigation',
    },
    {
        id: 'S06',
        courseId: 'SWE301',
        day: 6,
        start: '07:00',
        end: '09:30',
        room: 'A1-401',
        topic: 'Phân tích yêu cầu và Use Case',
    },
];

export const results: StudyResult[] = [
    { courseId: 'MOB101', process: 9, midterm: 8, final: null },
    { courseId: 'DBS201', process: 8, midterm: 7.5, final: 8 },
    { courseId: 'NET201', process: 7.5, midterm: 8, final: 7 },
    { courseId: 'ENG201', process: 9, midterm: 8.5, final: 9 },
    { courseId: 'SWE301', process: 8, midterm: 8, final: null },
];

function deadlineAfter(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(23, 59, 0, 0);
    return date.toISOString();
}

export function createAssignments(): Assignment[] {
    return [
        {
            id: 'A01',
            courseId: 'MOB101',
            title: 'Xây dựng ứng dụng quản lý học tập',
            description:
                'Tạo 5 tab, các màn hình chi tiết, tìm kiếm và lưu dữ liệu cục bộ.',
            dueDate: deadlineAfter(3),
            completed: false,
        },
        {
            id: 'A02',
            courseId: 'DBS201',
            title: 'Bài tập truy vấn SQL',
            description:
                'Viết 10 câu truy vấn có JOIN, GROUP BY và truy vấn lồng.',
            dueDate: deadlineAfter(1),
            completed: false,
        },
        {
            id: 'A03',
            courseId: 'NET201',
            title: 'Bài tập chia subnet',
            description:
                'Chia mạng 192.168.10.0/24 thành các mạng con phù hợp.',
            dueDate: deadlineAfter(-1),
            completed: false,
        },
        {
            id: 'A04',
            courseId: 'ENG201',
            title: 'Thuyết trình về công nghệ',
            description:
                'Chuẩn bị bài thuyết trình tiếng Anh dài 5 phút.',
            dueDate: deadlineAfter(5),
            completed: true,
        },
        {
            id: 'A05',
            courseId: 'SWE301',
            title: 'Vẽ sơ đồ Use Case',
            description:
                'Phân tích tác nhân và chức năng của hệ thống thư viện.',
            dueDate: deadlineAfter(10),
            completed: false,
        },
    ];
}