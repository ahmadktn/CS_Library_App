import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CourseListScreen from '../screens/CourseListScreen';
import DocumentListScreen from '../screens/DocumentListScreen';
import { Colors } from '../constants/Colors';

export type RootStackParamList = {
    Home: undefined;
    CourseList: { level: number };
    DocumentList: {
        courseCode: string;
        courseTitle: string;
        documents: { name: string; fileSource: any }[];
    };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.primary,
                    },
                    headerTintColor: Colors.white,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'Course Materials',
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="CourseList"
                    component={CourseListScreen}
                    options={({ route }) => ({
                        title: `${route.params.level} Level Courses`
                    })}
                />
                <Stack.Screen
                    name="DocumentList"
                    component={DocumentListScreen}
                    options={{
                        title: 'Documents'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
