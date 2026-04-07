import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import imageIndex from '../../../assets/imageIndex';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { GetScriptDetailApi } from '../../../Api/apiRequest';
import moment from 'moment';
import LoadingModal from '../../../utils/Loader';


const ScriptDetailsScreen = () => {
  const route: any = useRoute();
  const { scriptItem } = route?.params || {};

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [scriptDetail, setScriptDetail] = React.useState<any>(null);

  const displayData = scriptDetail || scriptItem;

  React.useEffect(() => {
    if (scriptItem?.id) {
      fetchDetail();
    }
  }, [scriptItem?.id]);

  const fetchDetail = async () => {
    const res = await GetScriptDetailApi(scriptItem.id, setIsLoading);
    if (res) {
      setScriptDetail(res);
    }
  };

  React.useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.setDefaultLanguage('en-US');
      Tts.setDefaultRate(0.5);
      if (Platform.OS === 'ios') {
        Tts.setIgnoreSilentSwitch('ignore');
      }
    }).catch((err) => {
      if (err.code === 'no_engine') {
        Tts.requestInstallEngine();
      }
    });

    const onStart = () => setIsPlaying(true);
    const onFinish = () => setIsPlaying(false);
    const onCancel = () => setIsPlaying(false);

    Tts.addEventListener('tts-start', onStart);
    Tts.addEventListener('tts-finish', onFinish);
    Tts.addEventListener('tts-cancel', onCancel);

    return () => {
      if (Platform.OS === 'android') {
        Tts.stop();
      }
      // Remove specific listeners if the library supports it, or just stop
    };
  }, []);

  // Stop TTS when leaving the screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (Platform.OS === 'android') {
          Tts.stop();
        }
      };
    }, [])
  );

  const handleSpeech = () => {
    if (isPlaying) {
      Tts.stop();
      setIsPlaying(false);
    } else {
      if (!isMuted && displayData?.data?.script_text) {
        Tts.speak(displayData?.data?.script_text);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && isPlaying) {
      Tts.stop();
      setIsPlaying(false);
    }
  };

  const getEmotionImage = (state: string) => {
    if (!state) return imageIndex.Happy;
    const firstState = state.split(',')[0].toLowerCase().trim();
    switch (firstState) {
      case 'happy': return imageIndex.Happy;
      case 'sad': return imageIndex.Sad;
      case 'angry': return imageIndex.Angry;
      case 'anxious': return imageIndex.Anxious;
      case 'excited': return imageIndex.Excited;
      case 'neutral': return imageIndex.Neutral;
      default: return imageIndex.Happy;
    }
  };
  console.log("displayData", displayData)

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal visible={isLoading} />
      <StatusBarComponent />
      <CustomHeader label="Script Details" />


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Script Card */}
        <View style={styles.scriptCard}>
          <Text style={[styles.moodText, { textTransform: 'capitalize' }]}>
            {displayData?.data?.emotional_state || 'Happy'}
          </Text>

          <View style={styles.scriptRow}>
            <Image source={getEmotionImage(displayData?.data?.emotional_state)}
              style={styles.avatar}
            />

            <View style={styles.scriptInfo}>
              <Text style={styles.scriptTitle} numberOfLines={1}>
                {displayData?.data?.script_text}
              </Text>
              <Text style={styles.scriptTime}>
                {displayData?.data?.created_at ? moment(displayData.data.created_at).calendar() : 'Just now'}
              </Text>
            </View>

            <View style={styles.actionButtons}>

              <TouchableOpacity
                style={styles.playButton}
                onPress={handleSpeech}
              >
                <Image
                  source={imageIndex.voice1}
                  style={[
                    { width: 30, height: 30, tintColor: "black" },
                    isMuted && { tintColor: "#E03B65" }
                  ]}
                />
              </TouchableOpacity>

            </View>
          </View>

          <TouchableOpacity
            style={[styles.muteButton, {
              marginTop: 5
            }]}
            onPress={toggleMute}
          >
            <Icon
              name={isMuted ? "volume-off" : "volume-high"}
              size={20}
              color={isMuted ? "#FF6B6B" : "#E03B65"}
            />
          </TouchableOpacity>
        </View>

        {/* Additional Details */}


        {/* Meaning */}
        <Text style={styles.sectionTitle}>Meaning</Text>
        <View style={styles.meaningBox}>
          <Text style={styles.meaningText}>
            {displayData?.data?.ai_result?.interpreted_meaning || displayData?.data?.interpreted_meaning || 'Analyzing script meaning...'}
          </Text>
        </View>

        {/* Analysis */}
        <Text style={styles.sectionTitle}>Script Sense Analysis</Text>

        {displayData?.data?.ai_result?.suggestions?.validation && (
          <View style={[styles.analysisCard, { backgroundColor: '#FDF2F5' }]}>
            <View style={styles.analysisHeader}>
              <View style={styles.iconCircle}>
                <Image source={imageIndex.Validation} style={{ width: 25, height: 25 }} />
              </View>
              <View>
                <Text style={styles.analysisTitle}>Validation</Text>
                <Text style={styles.analysisSubtitle}>Acknowledge the feeling</Text>
              </View>
            </View>
            <Text style={styles.analysisText}>
              {displayData?.data?.ai_result.suggestions.validation}
            </Text>
          </View>
        )}

        {displayData?.data?.ai_result?.suggestions?.regulation && (
          <View style={[styles.analysisCard, { backgroundColor: '#EEFCFA' }]}>
            <View style={styles.analysisHeader}>
              <View style={styles.iconCircle}>
                <Image source={imageIndex.Regulation} style={{ width: 25, height: 25 }} />
              </View>
              <View>
                <Text style={styles.analysisTitle}>Regulation</Text>
                <Text style={styles.analysisSubtitle}>Calm down strategies</Text>
              </View>
            </View>
            <Text style={styles.analysisText}>
              {displayData?.data?.ai_result?.suggestions?.regulation}
            </Text>
          </View>
        )}

        {displayData?.data?.ai_result?.suggestions?.modeling && (
          <View style={[styles.analysisCard, { backgroundColor: '#F5F2FD' }]}>
            <View style={styles.analysisHeader}>
              <View style={styles.iconCircle}>
                <Image source={imageIndex.modelingIcon} style={{ width: 27, height: 27 }} />
              </View>
              <View>
                <Text style={styles.analysisTitle}>Modeling</Text>
                <Text style={styles.analysisSubtitle}>Demonstrate behavior</Text>
              </View>
            </View>
            <Text style={styles.analysisText}>
              {displayData?.data?.ai_result?.suggestions?.modeling}
            </Text>
          </View>
        )}

        {displayData?.data?.ai_result?.notes_for_parent && (
          <View style={[styles.analysisCard, { backgroundColor: '#FFF9E6' }]}>
            <View style={styles.analysisHeader}>
              <View style={styles.iconCircle}>
                <Icon name="notebook-outline" size={20} color="#FFB800" />
              </View>
              <View>
                <Text style={styles.analysisTitle}>Notes for Parent</Text>
                <Text style={styles.analysisSubtitle}>Additional guidance</Text>
              </View>
            </View>
            <Text style={styles.analysisText}>
              {displayData?.data?.ai_result?.notes_for_parent}
            </Text>
          </View>
        )}

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>See More Suggestions</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScriptDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#A7D63A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  scriptCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    shadowColor: '#BCDBFF',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 10,
  },
  moodText: {
    fontSize: 12,
    color: '#50C878',
    marginBottom: 8,
    marginLeft: 48,
    fontWeight: '600',
  },
  scriptRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D9D9D9',
    marginRight: 10,
  },
  scriptInfo: {
    flex: 1,
  },
  scriptTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },
  scriptTime: {
    marginTop: 3,
    fontSize: 11,
    color: '#9B9B9B',
  },
  playButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  muteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEFCFA',
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  meaningBox: {
    backgroundColor: '#F8F9FC',
    borderRadius: 12,
    padding: 14,
  },
  meaningText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#8A8A8A',
    width: 90,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  analysisCard: {
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  analysisTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  analysisSubtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 4,
  },
  analysisText: {
    fontSize: 13,
    color: 'black',
    lineHeight: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 14,
    paddingVertical: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#BCDBFF',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});