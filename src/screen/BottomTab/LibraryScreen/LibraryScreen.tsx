import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Platform,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';

type ItemType = {
    id: string;
    title: string;
    subtitle: string;
    tag1: string;
    tag2: string;
    image: string;
};

const DATA: ItemType[] = [
    {
        id: '1',
        title: 'Requesting Items',
        subtitle: '"You want [item] Let me help you get it."',
        tag1: '10 Years',
        tag2: '2-3 years',
        image: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
    },
    {
        id: '2',
        title: 'Addressing Frustration',
        subtitle: '"I know it’s frustrating. Let’s take a deep breath together."',
        tag1: 'Emotions',
        tag2: '3-4 years',
        image: 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png',
    },
    {
        id: '3',
        title: 'Morning Routine',
        subtitle: '"Good morning! It’s time to start our day."',
        tag1: 'Routines',
        tag2: 'All Ages',
        image: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png',
    },
    {
        id: '4',
        title: 'Sharing Toys',
        subtitle: '"Can we share? Let’s take turns with the toy."',
        tag1: 'Social',
        tag2: '3-4 years',
        image: 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png',
    },
    {
        id: '5',
        title: 'Requesting Items',
        subtitle: '"You want [item] Let me help you get it."',
        tag1: '10 Years',
        tag2: '2-3 years',
        image: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
    },
];

const Tag = ({ label, color }: { label: string; color: string }) => {
    return (
        <View style={[styles.tag, { backgroundColor: color }]}>
            <Text style={styles.tagText}>{label}</Text>
        </View>
    );
};



const LibraryScreen = () => {
    const navigator = useNavigation();
    const LibraryCard = ({ item }: { item: ItemType }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardRow}>
                <Image source={imageIndex.moji} style={styles.avatar} />

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                    </Text>

                    <Text style={styles.cardSubtitle} numberOfLines={2}>
                        {item.subtitle}
                    </Text>

                    <View style={styles.tagRow}>
                        <Tag label={item.tag1} color="#FFE8EF" />
                        <Tag label={item.tag2} color="#E9F8EC" />
                    </View>

                    <TouchableOpacity style={styles.button} 
                    
                    onPress={()=>{
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
                        />
                    </View>

                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterIcon}>⌘</Text>
                    </TouchableOpacity>
                </View>

                {/* List */}
                <FlatList
                    data={DATA}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <LibraryCard item={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>
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
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
        borderWidth: Platform.OS === 'android' ? 1 : 0,
        borderColor: "#E0E0E0"
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