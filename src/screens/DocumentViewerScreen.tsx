import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import Pdf from 'react-native-pdf';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../constants/Colors';

type DocumentViewerScreenRouteProp = RouteProp<RootStackParamList, 'DocumentViewer'>;

export default function DocumentViewerScreen() {
    const route = useRoute<DocumentViewerScreenRouteProp>();
    const { fileSource, courseCode, documentName } = route.params;
    const [content, setContent] = useState<string>('');
    const [pdfSource, setPdfSource] = useState<{ uri: string, cache: boolean } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPdf, setIsPdf] = useState(false);

    useEffect(() => {
        const loadDocument = async () => {
            try {
                const asset = Asset.fromModule(fileSource);
                await asset.downloadAsync();

                // Determine if it is a PDF based on the document name
                // This is a simple check; for more robustness, one might check MIME types or file headers
                const isPdfFile = documentName?.toLowerCase().endsWith('.pdf') || false;
                setIsPdf(isPdfFile);

                if (isPdfFile) {
                    if (Platform.OS === 'web') {
                        setPdfSource({ uri: asset.uri, cache: false });
                    } else {
                        const uri = asset.localUri || asset.uri;
                        setPdfSource({ uri: uri, cache: true });
                    }
                } else {
                    // Text file handling
                    let text;
                    if (Platform.OS === 'web') {
                        const response = await fetch(asset.uri);
                        text = await response.text();
                    } else {
                        const uri = asset.localUri || asset.uri;
                        text = await FileSystem.readAsStringAsync(uri);
                    }
                    setContent(text);
                }

            } catch (error) {
                console.error('Error loading document:', error);
                setContent('Error loading document. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadDocument();
    }, [fileSource, documentName]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading document...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.documentHeader}>
                <Text style={styles.documentTitle}>{documentName || 'Document'}</Text>
                <Text style={styles.courseCode}>{courseCode}</Text>
            </View>

            {isPdf && pdfSource ? (
                Platform.OS === 'web' ? (
                    <View style={styles.webPdfContainer}>
                        <iframe
                            src={pdfSource.uri}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title={documentName || 'PDF Document'}
                        />
                    </View>
                ) : (
                    <Pdf
                        source={pdfSource}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`Current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link pressed: ${uri}`);
                        }}
                        style={styles.pdf}
                    />
                )
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.paper}>
                        <Text style={styles.documentText}>{content}</Text>
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
    documentHeader: {
        backgroundColor: Colors.cardBackground,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        zIndex: 10,
    },
    documentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    courseCode: {
        fontSize: 14,
        color: '#666',
    },
    scrollContent: {
        padding: 20,
    },
    paper: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 8,
        minHeight: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    documentText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: Colors.background,
    },
    webPdfContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    }
});