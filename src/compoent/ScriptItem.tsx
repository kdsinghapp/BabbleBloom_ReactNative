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

  return (
    <View style={styles.scriptItem}>
      <View style={styles.scriptLeft}>
        <Image
          source={getEmotionImage(item.emotional_state)}
          style={{ width: 42, height: 42 }}
        />

        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.scriptText} numberOfLines={2}>{item.script_text}</Text>
          <Text style={[styles.scriptTime, {
            color: "#ADA4A5"
          }]}>{moment(item.created_at).fromNow()}</Text>
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
