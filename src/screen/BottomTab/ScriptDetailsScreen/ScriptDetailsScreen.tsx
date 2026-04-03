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
import { useFocusEffect } from '@react-navigation/native';
 

const ScriptDetailsScreen = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);

  const scriptText = "Nana... juice... gogo's";

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
      if (Platform.OS === 'android') {
        Tts.stop();
      }
      setIsPlaying(false);
    } else {
      if (!isMuted) {
        Tts.speak(scriptText);
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted && isPlaying) {
      if (Platform.OS === 'android') {
        Tts.stop();
      }
      setIsPlaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
   <StatusBarComponent />
      <CustomHeader label="Script Details" />

  
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Script Card */}
        <View style={styles.scriptCard}>
          <Text style={styles.moodText}>Happy</Text>

          <View style={styles.scriptRow}>
            <Image source={{uri:"https://i.pravatar.cc/200?img=11"}} 
            style={styles.avatar}
            />
            

            <View style={styles.scriptInfo}>
              <Text style={styles.scriptTitle} numberOfLines={1}>
                "Nana... juice... gogo's"
              </Text>
              <Text style={styles.scriptTime}>Today 6:29 PM</Text>
            </View>

            <View style={styles.actionButtons}>

              <TouchableOpacity 
                style={styles.playButton} 
                onPress={handleSpeech}
              >
                <Image 
                  source={imageIndex.voice1} 
                  style={[
                    { width: 30, height: 30 , tintColor: "black"  },
                    isMuted && { tintColor: "#E03B65" }
                  ]} 
                />
              </TouchableOpacity>
              
            </View>
          </View>
                       
 <TouchableOpacity 
                style={[styles.muteButton,{
                  marginTop:5
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

        {/* Meaning */}
        <Text style={styles.sectionTitle}>You Means</Text>
        <View style={styles.meaningBox}>
          <Text style={styles.meaningText}>
            "The child wants apple juice immediately from the fridge."
          </Text>
        </View>

        {/* Analysis */}
        <Text style={styles.sectionTitle}>Script Sense Analysis</Text>

        <View style={[styles.analysisCard, { backgroundColor: '#FDF2F5' }]}>
          <View style={styles.analysisHeader}>
            <View style={styles.iconCircle}>
            <Image source={imageIndex.Validation} style={{width:25,height:25}} />
            </View>
            <View>
              <Text style={styles.analysisTitle}>Validation</Text>
              <Text style={styles.analysisSubtitle}>Acknowledge the feeling</Text>
            </View>
          </View>

          <Text style={styles.analysisText}>
            This appears to be echolalia combined with a clear request. Try
            responding with:
          </Text>
        </View>

        <View style={[styles.analysisCard, { backgroundColor: '#EEFCFA' }]}>
          <View style={styles.analysisHeader}>
            <View style={styles.iconCircle}>
               <Image source={imageIndex.Regulation} style={{width:25,height:25}} />
            </View>
            <View>
              <Text style={styles.analysisTitle}>Regulation</Text>
              <Text style={styles.analysisSubtitle}>Acknowledge the feeling</Text>
            </View>
          </View>

          <Text style={styles.analysisText}>
            This appears to be echolalia combined with a clear request. Try
            responding with:
          </Text>
        </View>

        <View style={[styles.analysisCard, { backgroundColor: '#F5F2FD' }]}>
          <View style={styles.analysisHeader}>
            <View style={styles.iconCircle}>
             <Image source={imageIndex.modelingIcon} style={{width:27,height:27}} />
            </View>
            <View>
              <Text style={styles.analysisTitle}>Modeling</Text>
              <Text style={styles.analysisSubtitle}>Calm down strategies</Text>
            </View>
          </View>

          <Text style={styles.analysisText}>
            Take a deep breath with them. Let&apos;s wait 3 seconds while I open
            the fridge. 1... 2... 3...
          </Text>
        </View>

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