import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type DocumentListScreenRouteProp = RouteProp<RootStackParamList, 'DocumentList'>;
type DocumentListNavigationProp = StackNavigationProp<RootStackParamList, 'DocumentList'>;

interface DocumentInfo {
    id: string;
    name: string;
    fileSource: any;
    size: string;
    localUri: string | null;
}

export default function DocumentListScreen() {
    const route = useRoute<DocumentListScreenRouteProp>();
    const navigation = useNavigation<DocumentListNavigationProp>();
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
                            const asset = Asset.fromModule(doc.fileSource);
                            await asset.downloadAsync();
                            const uri = asset.localUri || asset.uri;

                            let size = 'Unknown';
                            if (Platform.OS !== 'web') {
                                const fileInfo = await FileSystem.getInfoAsync(uri);
                                if (fileInfo.exists) {
                                    const sizeInKb = fileInfo.size / 1024;
                                    size = sizeInKb < 1024
                                        ? `${sizeInKb.toFixed(2)} KB`
                                        : `${(sizeInKb / 1024).toFixed(2)} MB`;
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
                            console.error('Error loading document:', error);
                            return {
                                id: `${courseCode}-doc-${index}`,
                                name: doc.name || `Document ${index + 1}`,
                                fileSource: doc.fileSource,
                                size: 'Error',
                                localUri: null,
                            };
                        }
                    })
                );
                setDocumentInfos(infos);
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

        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('Error', 'Sharing is not available on this device');
            return;
        }

        try {
            setDownloadingId(doc.id);
            await Sharing.shareAsync(doc.localUri, {
                dialogTitle: `Save ${doc.name}`,
                mimeType: 'text/plain',
                UTI: 'public.plain-text'
            });
        } catch (error) {
            console.error('Error sharing:', error);
            Alert.alert('Error', 'Failed to share/save document.');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleView = (doc: DocumentInfo) => {
        navigation.navigate('DocumentViewer', {
            courseCode,
            documentName: doc.name,
            fileSource: doc.fileSource,
        });
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
                    style={[styles.button, styles.viewButton]}
                    onPress={() => handleView(item)}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="eye" size={20} color={Colors.white} />
                    <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.downloadButton]}
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
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    viewButton: {
        backgroundColor: Colors.secondary,
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