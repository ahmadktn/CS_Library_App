import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../constants/Colors';
import { COURSE_DATA, Course } from '../constants/CourseData';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const LEVELS = [100, 200, 300, 400];

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLevelPress = (level: number) => {
        navigation.navigate('CourseList', { level });
    };

    const handleCoursePress = (course: Course) => {
        navigation.navigate('DocumentList', {
            courseCode: course.code,
            courseTitle: course.title,
            documents: course.documents,
        });
    };

    const filteredCourses = COURSE_DATA.flatMap(level => level.courses).filter(course => {
        const query = searchQuery.toLowerCase();
        return course.code.toLowerCase().includes(query) || course.title.toLowerCase().includes(query);
    });

    const renderSearchResult = ({ item }: { item: Course }) => (
        <TouchableOpacity
            style={styles.searchResultItem}
            onPress={() => handleCoursePress(item)}
        >
            <MaterialCommunityIcons name="file-document-outline" size={24} color={Colors.primary} />
            <View style={styles.searchResultTextContainer}>
                <Text style={styles.searchResultCode}>{item.code}</Text>
                <Text style={styles.searchResultTitle}>{item.title}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Logos Header */}
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../assets/umyu_logo.jpg')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Image 
                    source={require('../assets/nacos_logo.jpg')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.searchContainer}>
                <MaterialCommunityIcons name="magnify" size={24} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for courses..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {searchQuery.length > 0 ? (
                <FlatList
                    data={filteredCourses}
                    renderItem={renderSearchResult}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.content}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No courses found.</Text>
                        </View>
                    }
                />
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.headerTitle}>Select Level</Text>
                    <Text style={styles.headerSubtitle}>Computer Science Department</Text>

                    <View style={styles.grid}>
                        {LEVELS.map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={styles.card}
                                onPress={() => handleLevelPress(level)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="bookshelf" size={40} color={Colors.primary} />
                                </View>
                                <Text style={styles.levelText}>{level} Level</Text>
                                <Text style={styles.subText}>View Courses</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: Colors.cardBackground,
        gap: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    logo: {
        width: 80,
        height: 80,
    },
    content: {
        padding: 20,
        paddingTop: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        margin: 20,
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackground,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchResultTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    searchResultCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    searchResultTitle: {
        fontSize: 14,
        color: '#666',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
        marginTop: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: Colors.secondary,
        marginBottom: 30,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: Colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    levelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    subText: {
        fontSize: 12,
        color: '#888',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#999',
        fontSize: 16
    }
});
