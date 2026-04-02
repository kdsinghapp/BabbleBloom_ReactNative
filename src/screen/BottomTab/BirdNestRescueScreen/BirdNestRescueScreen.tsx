import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,

    StatusBar,
    Image,
    Platform,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';

// Replace with your actual bird nest image asset
// import BirdNestImage from './assets/bird_nest.png';

const BirdNestRescueScreen = () => {
    const navigation = useNavigation()
    const totalSteps = 4;
    const currentStep = 1;

    const suggestedPhrase = '"You want juice! Let me get you some juice."';
    const suggestedLabel = 'Suggested phrase: Oh no!';

    const tryPhrase = '"Bird fell down!"';
    const tryLabel = 'Try Saying';

    return (
        <SafeAreaView style={styles.safeArea}>

            <StatusBarComponent />
            <CustomHeader label="Bird Nest Rescue" />


             <View style={styles.progressContainer}>
                <Text style={styles.stepText}>Step {currentStep} of {totalSteps}</Text>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${(currentStep / totalSteps) * 100}%` },
                        ]}
                    />
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>

                {/* Suggested Phrase Card */}
                <View style={styles.card}>
                    {/* Bird Nest Illustration */}
                    <View style={styles.illustrationContainer}>
                        <Image source={imageIndex.bird}
                            style={{ width: 100, height: 100 }}
                        />
                    </View>

                    <Text style={styles.phraseText}>{suggestedPhrase}</Text>
                    <Text style={styles.labelText}>{suggestedLabel}</Text>
                </View>

                {/* Try Saying Card */}
                <View style={styles.card}>
                    <View style={styles.trySayingRow}>
                         <Image source={imageIndex.speak} style={{ width: 33, height: 33 }} />
                    </View>
                    <Text style={styles.phraseText}>{tryPhrase}</Text>
                    <Text style={styles.labelText}>{tryLabel}</Text>
                </View>
            </View>

            {/* Next Step Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => console.log('Next Step pressed')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.nextButtonText}>Next Step</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const PINK = '#E03B65';
const LIGHT_PINK = '#fce8ed';
const GRAY_TEXT = '#aaa';
const DARK_TEXT = '#222';
const BG = '#fff';
const WHITE = '#fff';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: PINK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        color: WHITE,
        fontSize: 22,
        fontWeight: '700',
        lineHeight: 26,
        marginTop: -2,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '700',
        color: DARK_TEXT,
        letterSpacing: 0.2,
    },
    headerRight: {
        width: 34,
    },

    // Progress
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
        fontWeight:"600"
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

    // Content
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 16,
    },

    // Cards
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor:  Platform.OS === 'android' ?'#BCDBFF' :"black",
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 12,
    },

    // Illustration
    illustrationContainer: {
        marginBottom: 16,
    },
    illustrationPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: LIGHT_PINK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationEmoji: {
        fontSize: 52,
    },

    // Phrase text
    phraseText: {
        fontSize: 17,
        fontWeight: '700',
        color: "black",
        textAlign: 'center',
        marginBottom: 6,
        lineHeight: 24,
    },
    labelText: {
        fontSize: 12,
        color: "#ADA4A5",
        textAlign: 'center',
    },

    // Try Saying row
    trySayingRow: {
        marginBottom: 12,
    },
    speakerIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: LIGHT_PINK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    speakerIcon: {
        fontSize: 22,
    },

    // Footer / Next button
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
});

export default BirdNestRescueScreen;