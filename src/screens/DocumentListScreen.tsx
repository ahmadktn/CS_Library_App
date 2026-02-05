import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform, PermissionsAndroid } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import RNFS from 'react-native-fs';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type DocumentListScreenRouteProp = RouteProp<RootStackParamList, 'DocumentList'>;

interface DocumentInfo {
    id: string;
    name: string;
    fileSource: any;
    size: string;
    localUri: string | null;
}

export default function DocumentListScreen() {
    const route = useRoute<DocumentListScreenRouteProp>();
    const navigation = useNavigation();
    const { courseCode, courseTitle, documents } = route.params;
    const [documentInfos, setDocumentInfos] = useState<DocumentInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    useEffect(() => {
        const loadDocumentInfos = async () => {
            try {
                const infos = await Promise.all(
                    documents.map(async (doc: any, index: number) => {
                        try {
                            if (!doc.fileSource) return null;
                            const asset = Asset.fromModule(doc.fileSource);
                            await asset.downloadAsync();
                            const uri = asset.localUri || asset.uri;

                            let size = 'Unknown';
                            if (Platform.OS !== 'web') {
                                const fileInfo = await FileSystemLegacy.getInfoAsync(uri);
                                if (fileInfo.exists) {
                                    const sizeInKb = fileInfo.size / 1024;
                                    size = sizeInKb < 1024 ? `${sizeInKb.toFixed(2)} KB` : `${(sizeInKb / 1024).toFixed(2)} MB`;
                                }
                            }

                            return {
                                id: `${courseCode}-doc-${index}`,
                                name: doc.name || `Document ${index + 1}`,
                                fileSource: doc.fileSource,
                                size,
                                localUri: uri,
                            };
                        } catch (error) {
                            return null;
                        }
                    })
                );
                setDocumentInfos(infos.filter(doc => doc !== null) as DocumentInfo[]);
            } catch (error) {
                console.error('Error loading documents:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDocumentInfos();
    }, [documents, courseCode]);

    const handleDownload = async (doc: DocumentInfo) => {
        if (!doc.localUri) {
            Alert.alert('Error', 'Document not available');
            return;
        }

        if (Platform.OS === 'web') {
            Alert.alert('Download', 'Download not supported in web preview mode.');
            return;
        }

        try {
            setDownloadingId(doc.id);

            if (Platform.OS === 'android') {
                // Request storage permission
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'App needs access to download files to your device',
                        buttonPositive: 'OK',
                    }
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Permission Denied', 'Storage permission is required to download files.');
                    return;
                }

                // Remove file:// prefix if present
                let sourcePath = doc.localUri;
                if (sourcePath.startsWith('file://')) {
                    sourcePath = sourcePath.replace('file://', '');
                }

                // Destination in Downloads folder
                const destPath = `${RNFS.DownloadDirectoryPath}/${doc.name}`;
                
                console.log('Copying from:', sourcePath);
                console.log('Copying to:', destPath);

                // Copy file directly to Downloads
                await RNFS.copyFile(sourcePath, destPath);

                console.log('File saved to Downloads successfully');
                Alert.alert('Success', `"${doc.name}" has been saved to Downloads folder.`);
            } else {
                // iOS: Copy to Documents directory
                let sourcePath = doc.localUri;
                if (sourcePath.startsWith('file://')) {
                    sourcePath = sourcePath.replace('file://', '');
                }

                const destPath = `${RNFS.DocumentDirectoryPath}/${doc.name}`;
                await RNFS.copyFile(sourcePath, destPath);
                
                Alert.alert('Success', `"${doc.name}" has been saved to Files app.`);
            }
        } catch (error: any) {
            console.error('Download error:', error);
            Alert.alert('Error', `Failed to download: ${error?.message || 'Unknown error'}`);
        } finally {
            setDownloadingId(null);
        }
    };

    const renderDocument = ({ item }: { item: DocumentInfo }) => (
        <View style={styles.documentCard}>
            <View style={styles.documentHeader}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="file-document" size={32} color={Colors.primary} />
                </View>
                <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{item.name}</Text>
                    <Text style={styles.documentSize}>{item.size}</Text>
                </View>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.viewButton]} 
                    onPress={() => {
                        // @ts-ignore - Navigation will be typed in your app
                        navigation.navigate('DocumentViewer', {
                            documentName: item.name,
                            documentUri: item.localUri
                        });
                    }}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="eye" size={20} color={Colors.white} />
                    <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.actionButton, styles.downloadButton]} 
                    onPress={() => handleDownload(item)}
                    activeOpacity={0.7}
                    disabled={downloadingId === item.id}
                >
                    {downloadingId === item.id ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="download" size={20} color={Colors.white} />
                            <Text style={styles.buttonText}>Download</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading documents...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{courseCode}</Text>
                <Text style={styles.headerSubtitle}>{courseTitle}</Text>
                <Text style={styles.documentCount}>
                    {documentInfos.length} {documentInfos.length === 1 ? 'Document' : 'Documents'}
                </Text>
            </View>

            <FlatList
                data={documentInfos}
                renderItem={renderDocument}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="file-alert-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No documents available</Text>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: Colors.cardBackground,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    documentCount: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    documentCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    documentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    documentInfo: {
        flex: 1,
    },
    documentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    documentSize: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    viewButton: {
        backgroundColor: '#4CAF50',
    },
    downloadButton: {
        backgroundColor: Colors.primary,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
});
