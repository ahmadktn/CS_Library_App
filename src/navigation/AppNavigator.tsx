// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import HomeScreen from '../screens/HomeScreen';
// import CourseListScreen from '../screens/CourseListScreen';
// import DocumentListScreen from '../screens/DocumentListScreen';
// import DocumentViewerScreen from '../screens/DocumentViewerScreen';
// import { Colors } from '../constants/Colors';

// export type RootStackParamList = {
//     Home: undefined;
//     CourseList: { level: number };
//     DocumentList: { courseCode: string; courseTitle: string; documents: any };
//     DocumentViewer: { courseCode: string; fileSource: any; documentName?: string };
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator
//                 initialRouteName="Home"
//                 screenOptions={{
//                     headerStyle: {
//                         backgroundColor: Colors.primary,
//                     },
//                     headerTintColor: Colors.white,
//                     headerTitleStyle: {
//                         fontWeight: 'bold',
//                     },
//                     cardStyle: { backgroundColor: Colors.background },
//                 }}
//             >
//                 <Stack.Screen
//                     name="Home"
//                     component={HomeScreen}
//                     options={{ title: 'UMYUK CS Digital Library' }}
//                 />
//                 <Stack.Screen
//                     name="CourseList"
//                     component={CourseListScreen}
//                     options={({ route }) => ({ title: `${route.params.level} Level Courses` })}
//                 />
//                 <Stack.Screen
//                     name="DocumentList"
//                     component={DocumentListScreen}
//                     options={({ route }) => ({ title: `${route.params.courseCode} Documents` })}
//                 />
//                 <Stack.Screen
//                     name="DocumentViewer"
//                     component={DocumentViewerScreen}
//                     options={({ route }) => ({ title: route.params.courseCode })}
//                 />
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CourseListScreen from '../screens/CourseListScreen';
import DocumentListScreen from '../screens/DocumentListScreen';
import DocumentViewerScreen from '../screens/DocumentViewerScreen';
import { Colors } from '../constants/Colors';

export type RootStackParamList = {
    Home: undefined;
    CourseList: { level: number };
    DocumentList: { 
        courseCode: string; 
        courseTitle: string;
        documents: { name: string; fileSource: any }[];
    };
    DocumentViewer: { 
        courseCode: string; 
        documentName: string;
        fileSource: any;
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
                <Stack.Screen 
                    name="DocumentViewer" 
                    component={DocumentViewerScreen}
                    options={{ 
                        title: 'Document Viewer'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}