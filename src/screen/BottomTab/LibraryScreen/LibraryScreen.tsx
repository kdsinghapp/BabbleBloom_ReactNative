import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Platform,
    ActivityIndicator,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';
import { GetLibraryResponsesApi } from '../../../Api/apiRequest';
import LoadingModal from '../../../utils/Loader';
import { useSelector } from 'react-redux';

const Tag = ({ label, color }: { label: string; color: string }) => {
    return (
        <View style={[styles.tag, { backgroundColor: color }]}>
            <Text style={styles.tagText}>{label}</Text>
        </View>
    );
};



const LibraryScreen = () => {
    const navigator = useNavigation();
    const [responses, setResponses] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const selectedChild = useSelector((state: any) => state.children.selectedChild);

    const fetchResponses = async (query = '', showLoader = true) => {
        const data = await GetLibraryResponsesApi(showLoader ? setLoading : () => { }, selectedChild?.id, query);
        console.log('[LibraryScreen] API Response Data:', data);
        if (data) {
            setResponses(data);
        }
    };

    useEffect(() => {
        fetchResponses();
    }, [selectedChild]);

    const handleSearch = (text: string) => {
        setSearchText(text);
        // Simple search triggering
        if (text.length > 2 || text.length === 0) {
            fetchResponses(text, false);
        }
    };

    const LibraryCard = ({ item }: { item: any }) => {
        return (
            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <Image
                        source={item.image ? { uri: item.image } : imageIndex.Happy}
                        style={styles.avatar}
                    />

                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                            {item.title}
                        </Text>

                        <Text style={styles.cardSubtitle} numberOfLines={3}>
                            {item.card_prompt || item.response_text || item.subtitle}
                        </Text>

                        <View style={styles.tagRow}>
                            {item.category && <Tag label={item.category} color="#FFE8EF" />}
                            {item.age_group && <Tag label={item.age_group} color="#E9F8EC" />}
                        </View>

                        <TouchableOpacity style={styles.button}

                            onPress={() => {
                                navigator.navigate(ScreenNameEnum.ActivityViewDetails)
                            }}
                        >
                            <Text style={styles.buttonText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBarComponent />
            <CustomHeader label="Library" />
            <View style={styles.container}>
                {/* Header */}

                {/* Search */}
                <View style={styles.searchRow}>
                    <View style={styles.searchBox}>
                        <Image source={imageIndex.search1}

                            style={{
                                height: 22,
                                width: 22
                            }}
                        />
                        <TextInput
                            placeholder="Search responses..."
                            placeholderTextColor="black"
                            style={[styles.input, {
                                marginLeft: 11
                            }]}
                            value={searchText}
                            onChangeText={handleSearch}
                        />
                    </View>

                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterIcon}>⌘</Text>
                    </TouchableOpacity>
                </View>

                {/* List */}
                <FlatList
                    data={responses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <LibraryCard item={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={!loading ? (
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: '#9A9A9A', fontSize: 16 }}>No items found in the library.</Text>
                        </View>
                    ) : null}
                />
            </View>
            <LoadingModal visible={loading} />
        </SafeAreaView>
    );
};

export default LibraryScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingHorizontal: 18,
        backgroundColor: 'white',
    },
    header: {
        height: 62,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#9ACD32',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        fontSize: 22,
        color: '#fff',
        marginTop: -2,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222222',
    },
    headerRightSpace: {
        width: 34,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 16,
    },
    searchBox: {
        flex: 1,
        height: 55,
        backgroundColor: '#EAF4FF',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
    },
    searchIcon: {
        fontSize: 18,
        color: '#8F9BB3',
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    filterButton: {
        width: 48,
        height: 48,
        marginLeft: 10,
        borderRadius: 14,
        backgroundColor: '#F54278',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterIcon: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        marginBottom: 14,
        shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",
        shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
        borderWidth: Platform.OS === 'android' ? 0.5 : 0,
        borderColor: "#BCDBFF"
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F1F1F',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#9A9A9A',
        lineHeight: 18,
        marginBottom: 10,
    },
    tagRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
        marginRight: 8,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
    },
    button: {
        alignSelf: 'flex-start',
        backgroundColor: '#F54278',
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 24,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
});