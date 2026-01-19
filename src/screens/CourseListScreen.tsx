import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COURSE_DATA, Course } from '../constants/CourseData';
import { Colors } from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CourseListScreenRouteProp = RouteProp<RootStackParamList, 'CourseList'>;
type CourseListNavigationProp = StackNavigationProp<RootStackParamList, 'CourseList'>;

interface SectionData {
    title: string;
    data: Course[];
    semester: number;
}

export default function CourseListScreen() {
    const route = useRoute<CourseListScreenRouteProp>();
    const navigation = useNavigation<CourseListNavigationProp>();
    const { level } = route.params;

    const sections: SectionData[] = useMemo(() => {
        const levelData = COURSE_DATA.find((d) => d.level === level);
        if (!levelData) return [];

        const firstSemester = levelData.courses.filter(c => c.semester === 1);
        const secondSemester = levelData.courses.filter(c => c.semester === 2);

        const result = [];
        if (firstSemester.length > 0) {
            result.push({ title: 'First Semester', data: firstSemester, semester: 1 });
        }
        if (secondSemester.length > 0) {
            result.push({ title: 'Second Semester', data: secondSemester, semester: 2 });
        }
        return result;
    }, [level]);

    const handleCoursePress = (course: Course) => {
        navigation.navigate('DocumentList', {
            courseCode: course.code,
            courseTitle: course.title,
            documents: [{ name: course.title, fileSource: course.fileSource }],
        });
    };

    const renderItem = ({ item }: { item: Course }) => (
        <TouchableOpacity
            style={styles.courseItem}
            onPress={() => handleCoursePress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="file-document-outline" size={24} color={Colors.white} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.courseCode}>{item.code}</Text>
                <Text style={styles.courseTitle}>{item.title}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title, semester } }: { section: SectionData }) => (
        <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
                name={semester === 1 ? 'numeric-1-circle' : 'numeric-2-circle'}
                size={24}
                color={Colors.primary}
                style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No courses found for this level.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 12,
        paddingVertical: 8,
    },
    sectionHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    courseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    courseCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 2,
    },
    courseTitle: {
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});