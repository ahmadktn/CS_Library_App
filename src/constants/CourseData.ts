export interface Course {
    id: string;
    code: string;
    title: string;
    semester: 1 | 2;
    fileSource: any;
}

export interface LevelData {
    level: number;
    courses: Course[];
}

export const COURSE_DATA: LevelData[] = [
    {
        level: 100,
        courses: [
            // First Semester
            { id: 'MTH1311', code: 'MTH 1311', title: 'Algebra & Trigonometry', semester: 1, fileSource: require('../assets/courses/100/MTH1311_sample.txt') },
            { id: 'STA1311', code: 'STA 1311', title: 'Probability I', semester: 1, fileSource: require('../assets/courses/100/STA1311_sample.txt') },
            { id: 'CHM1311', code: 'CHM 1311', title: 'Inorganic Chemistry', semester: 1, fileSource: require('../assets/courses/100/CHM1311_sample.txt') },
            { id: 'CHM1101', code: 'CHM 1101', title: 'Chemistry Laboratory I', semester: 1, fileSource: require('../assets/courses/100/CHM1101_sample.txt') },
            { id: 'PHY1311', code: 'PHY 1311', title: 'Mechanics', semester: 1, fileSource: require('../assets/courses/100/PHY1311_sample.txt') },
            { id: 'PHY1113', code: 'PHY 1113', title: 'Basic Experimental Physics I', semester: 1, fileSource: require('../assets/courses/100/PHY1113_sample.txt') },
            { id: 'GSP1211', code: 'GSP 1211', title: 'Communication in English I', semester: 1, fileSource: require('../assets/courses/100/GSP1211_sample.txt') },
            { id: 'GSP1215', code: 'GSP 1215', title: 'Moral Philosophy and Environmental Health', semester: 1, fileSource: require('../assets/courses/100/GSP1215_sample.txt') },

            // Second Semester
            { id: 'CSC1302', code: 'CSC 1302', title: 'Introduction to Computer Science', semester: 2, fileSource: require('../assets/courses/100/CSC1302_sample.txt') },
            { id: 'MTH1302', code: 'MTH 1302', title: 'Differential and Integral Calculus', semester: 2, fileSource: require('../assets/courses/100/MTH1302_sample.txt') },
            { id: 'CHM1304', code: 'CHM 1304', title: 'Physical Chemistry', semester: 2, fileSource: require('../assets/courses/100/CHM1304_sample.txt') },
            { id: 'MTH1322', code: 'MTH 1322', title: 'Vectors & Analytic Geometry', semester: 2, fileSource: require('../assets/courses/100/MTH1322_sample.txt') },
            { id: 'PHY1302', code: 'PHY 1302', title: 'Electric, Magnetism & Modern Physics', semester: 2, fileSource: require('../assets/courses/100/PHY1302_sample.txt') },
            { id: 'CHM1122', code: 'CHM 1122', title: 'Chemistry Laboratory II', semester: 2, fileSource: require('../assets/courses/100/CHM1122_sample.txt') },
            { id: 'PHY1122', code: 'PHY 1122', title: 'General Physics Laboratory II', semester: 2, fileSource: require('../assets/courses/100/PHY1122_sample.txt') },
            { id: 'GSP1212', code: 'GSP 1212', title: 'Communication in English II', semester: 2, fileSource: require('../assets/courses/100/GSP1212_sample.txt') },
        ]
    },
    {
        level: 200,
        courses: [
            // First Semester
            { id: 'CSC2311', code: 'CSC 2311', title: 'Computer Programming I', semester: 1, fileSource: require('../assets/courses/200/CSC2311_sample.txt') },
            { id: 'CSC2201', code: 'CSC 2201', title: 'Introduction to System Software', semester: 1, fileSource: require('../assets/courses/200/CSC2201_sample.txt') },
            { id: 'CSC2313', code: 'CSC 2313', title: 'Introduction to Computer Systems', semester: 1, fileSource: require('../assets/courses/200/CSC2313_sample.txt') },
            { id: 'MTH2211', code: 'MTH 2211', title: 'Linear Algebra I', semester: 1, fileSource: require('../assets/courses/200/MTH2211_sample.txt') },
            { id: 'EDS2211', code: 'EDS 2211', title: 'Entrepreneurship Studies', semester: 1, fileSource: require('../assets/courses/200/EDS2211_sample.txt') },
            { id: 'PHY2301', code: 'PHY 2301', title: 'Electrical Circuits/Electronics', semester: 1, fileSource: require('../assets/courses/200/PHY2301_sample.txt') },
            { id: 'GSP2211', code: 'GSP 2211', title: 'Peace and Conflict Resolution', semester: 1, fileSource: require('../assets/courses/200/GSP2211_sample.txt') },
            { id: 'GSP1211_200', code: 'GSP 1211', title: 'Communication in English II (DE)', semester: 1, fileSource: require('../assets/courses/200/GSP1211_sample.txt') }, // Note: Using GSP1211 file again if DE uses same material, renamed ID to avoid conflict

            // Second Semester
            { id: 'CSC2302', code: 'CSC 2302', title: 'Computer Programming II', semester: 2, fileSource: require('../assets/courses/200/CSC2302_sample.txt') },
            { id: 'CSC2322', code: 'CSC 2322', title: 'Programming in Visual Basic', semester: 2, fileSource: require('../assets/courses/200/CSC2322_sample.txt') },
            { id: 'CSC2304', code: 'CSC 2304', title: 'Application Packages', semester: 2, fileSource: require('../assets/courses/200/CSC2304_sample.txt') },
            { id: 'MTH2202', code: 'MTH 2202', title: 'Linear Algebra II', semester: 2, fileSource: require('../assets/courses/200/MTH2202_sample.txt') },
            { id: 'MTH2204', code: 'MTH 2204', title: 'Logic & Foundation of Mathematics', semester: 2, fileSource: require('../assets/courses/200/MTH2204_sample.txt') },
            { id: 'GSP2220', code: 'GSP 2220', title: 'Environmental Health', semester: 2, fileSource: require('../assets/courses/200/GSP2220_sample.txt') },
            { id: 'GSP2224', code: 'GSP 2224', title: 'Moral Philosophy', semester: 2, fileSource: require('../assets/courses/200/GSP2224_sample.txt') },
            { id: 'GSP1212_200', code: 'GSP 1212', title: 'Communication in English II (DE)', semester: 2, fileSource: require('../assets/courses/200/GSP1212_sample.txt') },
            { id: 'MTH2324', code: 'MTH 2324', title: 'Finite Mathematics (Elective)', semester: 2, fileSource: require('../assets/courses/200/MTH2324_sample.txt') },
        ]
    },
    {
        level: 300,
        courses: [
            // First Semester
            { id: 'CSC3311', code: 'CSC 3311', title: 'Internet Programming', semester: 1, fileSource: require('../assets/courses/300/CSC3311_sample.txt') },
            { id: 'CSC3301', code: 'CSC 3301', title: 'Data Structures and Algorithms', semester: 1, fileSource: require('../assets/courses/300/CSC3301_sample.txt') },
            { id: 'CSC3313', code: 'CSC 3313', title: 'Advanced Software Systems', semester: 1, fileSource: require('../assets/courses/300/CSC3313_sample.txt') },
            { id: 'CSC3303', code: 'CSC 3303', title: 'Computer Architecture', semester: 1, fileSource: require('../assets/courses/300/CSC3303_sample.txt') },
            { id: 'CSC3315', code: 'CSC 3315', title: 'Introduction to Computer Networks', semester: 1, fileSource: require('../assets/courses/300/CSC3315_sample.txt') },
            { id: 'MTH3301', code: 'MTH 3301', title: 'Numerical Analysis', semester: 1, fileSource: require('../assets/courses/300/MTH3301_sample.txt') },

            // Second Semester
            { id: 'CSC3202', code: 'CSC 3202', title: 'Introduction to Parallel Algorithm', semester: 2, fileSource: require('../assets/courses/300/CSC3202_sample.txt') },
            { id: 'CSC3422', code: 'CSC 3422', title: 'Introduction to Analysis of Algorithm', semester: 2, fileSource: require('../assets/courses/300/CSC3422_sample.txt') },
            { id: 'CSC3304', code: 'CSC 3304', title: 'Programming in Java', semester: 2, fileSource: require('../assets/courses/300/CSC3304_sample.txt') },
            { id: 'CSC3324', code: 'CSC 3324', title: 'Data Communication', semester: 2, fileSource: require('../assets/courses/300/CSC3324_sample.txt') },
            { id: 'CSC3306', code: 'CSC 3306', title: 'Compiler Theory', semester: 2, fileSource: require('../assets/courses/300/CSC3306_sample.txt') },
            { id: 'MTH3326', code: 'MTH 3326', title: 'Optimization Theory', semester: 2, fileSource: require('../assets/courses/300/MTH3326_sample.txt') },
            { id: 'EDS3222', code: 'EDS 3222', title: 'Entrepreneurship Development Studies', semester: 2, fileSource: require('../assets/courses/300/EDS3222_sample.txt') },
        ]
    },
    {
        level: 400,
        courses: [
            // First Semester
            { id: 'CSC4311', code: 'CSC 4311', title: 'Software Engineering', semester: 1, fileSource: require('../assets/courses/400/CSC4311_sample.txt') },
            { id: 'CSC4313', code: 'CSC 4313', title: 'Artificial Intelligence', semester: 1, fileSource: require('../assets/courses/400/CSC4313_sample.txt') },
            { id: 'CSC4301', code: 'CSC 4301', title: 'Operating System II', semester: 1, fileSource: require('../assets/courses/400/CSC4301_sample.txt') },
            { id: 'CSC4315', code: 'CSC 4315', title: 'Wireless Network and Protocol', semester: 1, fileSource: require('../assets/courses/400/CSC4315_sample.txt') },
            { id: 'CSC4317', code: 'CSC 4317', title: 'SIWES', semester: 1, fileSource: require('../assets/courses/400/CSC4317_sample.txt') },

            // Second Semester
            { id: 'CSC4302', code: 'CSC 4302', title: 'Introduction to Computer Graphics', semester: 2, fileSource: require('../assets/courses/400/CSC4302_sample.txt') },
            { id: 'CSC4322', code: 'CSC 4322', title: 'Introduction to Object Oriented Programming', semester: 2, fileSource: require('../assets/courses/400/CSC4322_sample.txt') },
            { id: 'CSC4304', code: 'CSC 4304', title: 'Computer Networks Design', semester: 2, fileSource: require('../assets/courses/400/CSC4304_sample.txt') },
            { id: 'CSC4323', code: 'CSC 4323', title: 'Database Design and Management', semester: 2, fileSource: require('../assets/courses/400/CSC4323_sample.txt') },
            { id: 'CSC4600', code: 'CSC 4600', title: 'Research Project', semester: 2, fileSource: require('../assets/courses/400/CSC4600_sample.txt') },
        ]
    }
];
