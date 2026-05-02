import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import moment from 'moment';
import imageIndex from '../assets/imageIndex';
import ScreenNameEnum from '../routes/screenName.enum';

const ScriptIcon = () => <Image source={imageIndex.Frame} style={{ width: 29, height: 29 }} />;

const C = {
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#E03B65',
};

export default function ScriptItem({ item, navigator }: { item: any; navigator: any }) {
  // Map emotional_state to corresponding image
  const emotions = {
    happy: { image: imageIndex.Happy, color: '#FFD93D' },
    sad: { image: imageIndex.Sad, color: '#74B9FF' },
    angry: { image: imageIndex.Angry, color: '#E03B65' },
    anxious: { image: imageIndex.Anxious, color: '#A29BFE' },
    excited: { image: imageIndex.Excited, color: '#55EFC4' },
    neutral: { image: imageIndex.Neutral, color: '#94A3B8' },
  };

  const getEmotionData = (state: string) => {
    if (!state) return emotions.happy;
    const key = state.split(',')[0].toLowerCase().trim() as keyof typeof emotions;
    return emotions[key] || emotions.happy;
  };

  const emotionData = getEmotionData(item.emotional_state);

  return (
    <View style={styles.scriptItem}>
      <View style={styles.scriptLeft}>
        <View style={[styles.emotionContainer, { backgroundColor: emotionData.color + '20' }]}>
          <Image
            source={emotionData.image}
            style={{ width: 32, height: 32 }}
          />
        </View>

        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.scriptText} numberOfLines={2}>{item.script_text}</Text>
          <Text style={[styles.scriptTime, {
            color: "#ADA4A5"
          }]}>{moment.utc(item.created_at).fromNow()}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.scriptIconBtn}
        onPress={() => {
          navigator.navigate(ScreenNameEnum.ScriptDetailsScreen, { scriptItem: item })
        }}
      >
        <ScriptIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  scriptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 10,
  },
  scriptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emotionContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scriptText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textDark,
  },
  scriptTime: {
    fontSize: 12,
    color: C.textGray,
    marginTop: 2,
  },
  scriptIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
