import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../../../compoent/CustomHeader';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageIndex from '../../../assets/imageIndex';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GetActivityDetailApi, BASE_URLIMAGE } from '../../../Api/apiRequest';
import Tts from 'react-native-tts';
import LoadingModal from '../../../utils/Loader';
import { useSelector } from 'react-redux';

const MoreViewDetails = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activity_id, child_id } = route.params || {};
  console.log('[MoreViewDetails] activity_id:', activity_id, 'child_id:', child_id);

  const [loading, setLoading] = useState(false);
  const [activityData, setActivityData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const selectedChild = useSelector((state: any) => state.children.selectedChild);
  const properChildId = child_id || selectedChild?.id || 4;

  useEffect(() => {
    if (activity_id) {
      fetchActivityDetail();
    }
  }, [activity_id]);

  const fetchActivityDetail = async () => {
    const res = await GetActivityDetailApi(activity_id, setLoading, properChildId);
    if (res) {
      setActivityData(res);
    }
  };

  useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.setDefaultLanguage('en-US');
      if (Platform.OS === 'ios') {
        Tts.setIgnoreSilentSwitch('ignore');
      }
    });

    const onStart = () => { };
    const onFinish = () => setIsPlaying(null);
    const onCancel = () => setIsPlaying(null);

    Tts.addEventListener('tts-start', onStart);
    Tts.addEventListener('tts-finish', onFinish);
    Tts.addEventListener('tts-cancel', onCancel);

    return () => {
      Tts.stop();
    };
  }, []);

  const handleSpeech = (text: string, id: number) => {
    if (isPlaying === id) {
      Tts.stop();
      setIsPlaying(null);
    } else {
      Tts.stop();
      setIsPlaying(id);
      Tts.speak(text);
    }
  };

  if (loading && !activityData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBarComponent />
        <CustomHeader label="Activity Detail" />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E03B65" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />
      <CustomHeader label="Activity Detail" />
      <LoadingModal visible={loading} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={
              activityData?.image
                ? { uri: activityData.image.startsWith('http') ? activityData.image : `${BASE_URLIMAGE}/${activityData.image}` }
                : { uri: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=800&auto=format&fit=crop' }
            }
            style={styles.mainImage}
          />
        </View>

        {/* Tag */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activityData?.title || 'Activity'}</Text>
        </View>

        <Text style={[styles.cardTitle, { marginTop: 40 }]}>✍️ What you’ll practice</Text>

        {/* Practice Card */}
        <View style={styles.card}>
          {activityData?.what_youll_practice?.map((item: string, index: number) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.cardText}>{item}</Text>
            </View>
          )) || (
              <Text style={styles.cardText}>Check activity details for practice points.</Text>
            )}
        </View>

        {/* Scripts */}
        <View style={[styles.scriptHeaderRow, { flexDirection: "row", alignItems: "center" }]}>
          <Image source={imageIndex.Validation} style={{ width: 22, height: 22, marginRight: 2 }} />
          <View style={{ flexDirection: "column", marginLeft: 5 }}>
            <Text style={styles.scriptTitle}>Scripts to Model</Text>
            <Text style={[styles.subText, { color: "#ADA4A5", marginLeft: 1 }]}>
              Tap the play icon to hear how to say these phrases naturally.
            </Text>
          </View>
        </View>

        {activityData?.scripts_to_model?.map((item: any, index: number) => (
          <View key={item.id || index} style={styles.scriptItem}>
            <TouchableOpacity
              style={[styles.playButton, isPlaying === item.id && { backgroundColor: '#E03B65' }]}
              onPress={() => handleSpeech(item.text, item.id)}
            >
              <Text style={[styles.playIcon, isPlaying === item.id && { color: '#FFF' }]}>
                {isPlaying === item.id ? '■' : '▶'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.scriptItemText}>{item.text}</Text>

            <TouchableOpacity style={styles.starButton}>
              <Text style={styles.starIcon}>☆</Text>
            </TouchableOpacity>
          </View>
        )) || (
            <Text style={{ textAlign: 'center', marginTop: 10, color: '#999' }}>No scripts available.</Text>
          )}
      </ScrollView>

      {/* Bottom Button */}
      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => navigation.navigate(ScreenNameEnum.ActivityPlayerScreen, {
          scripts: activityData?.scripts_to_model || [],
          activityTitle: activityData?.title,
          activity_id: activity_id,
          child_id: properChildId
        })}
      >
        <Text style={styles.bottomButtonText}>▷ Start Activity</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default MoreViewDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
    marginHorizontal: 15
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  mainImage: {
    width: 145,
    height: 145,
    borderRadius: 72.5,
  },
  badge: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E03B65',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: "absolute",
    top: 125
  },
  badgeText: {
    fontSize: 13,
    color: '#222',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 13,
    color: '#444',
    marginRight: 6,
    lineHeight: 18,
  },
  cardText: {
    flex: 1,
    fontSize: 12,
    color: 'black',
    lineHeight: 18,
    fontWeight: "500"
  },
  scriptHeaderRow: {
    marginTop: 18,
    marginBottom: 4,
  },
  scriptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  subText: {
    fontSize: 11,
    color: '#A0A0A0',
    marginBottom: 12,
  },
  scriptItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  playIcon: {
    color: '#6AA7FF',
    fontSize: 11,
    marginLeft: 2,
  },
  scriptItemText: {
    flex: 1,
    fontSize: 12,
    color: '#222',
    fontWeight: '500',
  },
  starButton: {
    marginLeft: 10,
  },
  starIcon: {
    fontSize: 18,
    color: '#F27A8A',
  },
  bottomButton: {
    backgroundColor: '#E03B65',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});