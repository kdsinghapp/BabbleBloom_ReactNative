import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import Tts from 'react-native-tts';
import { useSelector } from 'react-redux';
import { StartActivityApi, CompleteActivityApi } from '../../../Api/apiRequest';
import LoadingModal from '../../../utils/Loader';
import imageIndex from '../../../assets/imageIndex';

const ActivityPlayerScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { scripts = [], activityTitle = 'Activity', activity_id, child_id } = route.params || {};
    console.log('[ActivityPlayerScreen] activity_id:', activity_id, 'child_id:', child_id, 'scripts count:', scripts.length);

    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const selectedChild = useSelector((state: any) => state.children.selectedChild);

    const properChildId = child_id || selectedChild?.id || 4; // Fallback to 4 for testing if needed


    const totalSteps = scripts.length;
    const currentScript = scripts[currentStep];

    useEffect(() => {
        Tts.getInitStatus().then(() => {
            Tts.setDefaultLanguage('en-US');
            if (Platform.OS === 'ios') {
                Tts.setIgnoreSilentSwitch('ignore');
            }
        });

        const onStart = () => setIsPlaying(true);
        const onFinish = () => setIsPlaying(false);
        const onCancel = () => setIsPlaying(false);

        Tts.addEventListener('tts-start', onStart);
        Tts.addEventListener('tts-finish', onFinish);
        Tts.addEventListener('tts-cancel', onCancel);

        // Start Activity API
        if (activity_id && properChildId) {
            (async () => {
                const res = await StartActivityApi(activity_id, properChildId, setLoading);
                if (res?.session_id) {
                    setSessionId(res.session_id);
                }
            })();
        }

        return () => {
            Tts.stop();
        };
    }, []);

    const handleSpeech = () => {
        if (isPlaying) {
            Tts.stop();
            setIsPlaying(false);
        } else if (currentScript?.text) {
            Tts.speak(currentScript.text);
        }
    };

    const handleNext = async () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
            Tts.stop();
        } else {
            console.log('[ActivityPlayerScreen] Completing activity. activity_id:', activity_id, 'sessionId:', sessionId);
            if (activity_id && sessionId && properChildId) {
                await CompleteActivityApi(activity_id, sessionId, properChildId, setLoading);
            }
            navigation.goBack();
        }
    };


    if (totalSteps === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBarComponent />
                <CustomHeader label={activityTitle} />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No scripts found for this activity.</Text>
                    <TouchableOpacity style={styles.nextButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.nextButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBarComponent />
            <CustomHeader label={activityTitle} />
            <LoadingModal visible={loading} />

            <View style={styles.progressContainer}>
                <Text style={styles.stepText}>Step {currentStep + 1} of {totalSteps}</Text>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${((currentStep + 1) / totalSteps) * 100}%` },
                        ]}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Suggested Phrase Card */}
                <View style={styles.card}>
                    <View style={styles.illustrationContainer}>
                        <Image
                            source={imageIndex.bird}
                            style={{ width: 100, height: 100 }}
                        />
                    </View>
                    <Text style={styles.labelText}>Suggested Context</Text>
                    <Text style={styles.phraseText}>{currentScript?.stage_level || 'Keep going!'}</Text>
                </View>

                {/* Try Saying Card */}
                <View style={styles.card}>
                    <TouchableOpacity
                        style={[styles.trySayingRow, isPlaying && { opacity: 0.7 }]}
                        onPress={handleSpeech}
                    >
                        <Image source={imageIndex.speak} style={[styles.speakIcon, isPlaying && { tintColor: PINK }]} />
                    </TouchableOpacity>
                    <Text style={styles.labelText}>Try Saying</Text>
                    <Text style={styles.phraseText}>"{currentScript?.text}"</Text>

                    <TouchableOpacity style={styles.playButtonMini} onPress={handleSpeech}>
                        <Text style={styles.playButtonText}>{isPlaying ? '■ Stop Audio' : '▶ Play Audio'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Next Step Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                    activeOpacity={0.85}
                >
                    <Text style={styles.nextButtonText}>
                        {currentStep < totalSteps - 1 ? 'Next Step' : 'Finish Activity'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const PINK = '#E03B65';
const LIGHT_PINK = '#fce8ed';
const BG = '#fff';
const WHITE = '#fff';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },
    progressContainer: {
        backgroundColor: WHITE,
        paddingHorizontal: 20,
        paddingBottom: 14,
        paddingTop: 8,
    },
    stepText: {
        fontSize: 15,
        color: "black",
        marginBottom: 6,
        textAlign: 'center',
        fontWeight: "600"
    },
    progressBarBackground: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#eee',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: PINK,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 12,
        marginBottom: 20,
    },
    illustrationContainer: {
        marginBottom: 16,
    },
    phraseText: {
        fontSize: 19,
        fontWeight: '700',
        color: "black",
        textAlign: 'center',
        marginBottom: 6,
        lineHeight: 28,
    },
    labelText: {
        fontSize: 12,
        color: "#ADA4A5",
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    trySayingRow: {
        // marginBottom: 12,
        // backgroundColor: LIGHT_PINK,
        // width: 60,
        // height: 60,
        // borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    speakIcon: {
        width: 33,
        height: 33,
    },
    playButtonMini: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
    },
    playButtonText: {
        fontSize: 12,
        color: PINK,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 28,
        paddingTop: 12,
        backgroundColor: BG,
    },
    nextButton: {
        backgroundColor: PINK,
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
    },
    nextButtonText: {
        color: WHITE,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginBottom: 20,
        textAlign: 'center',
    }
});

export default ActivityPlayerScreen;
