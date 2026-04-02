import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageIndex from '../../../../assets/imageIndex';
import StatusBarComponent from '../../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../../compoent/CustomHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  primary: '#E03B65',
  primaryLight: '#FFF0F4',
  accent: '#E03B65',
  text: '#1A1D2E',
  sub: '#8A8FA8',
  border: '#E2E8F0',
  inputBg: '#F1F5F9',
  tagBg: '#F1F5F9',
  tagText: '#475569',
  happy: '#FFD93D',
  sad: '#74B9FF',
  angry: '#E03B65',
  anxious: '#A29BFE',
  excited: '#55EFC4',
  neutral: '#94A3B8',
};




const SOURCES = [
  { id: 'tv', label: 'TV', icon: imageIndex.tv },
  { id: 'song', label: 'Song', icon: imageIndex.Song },
  { id: 'parent', label: 'Parent', icon: imageIndex.Parent },
  { id: 'school', label: 'School', icon: imageIndex.School },
  { id: 'unknown', label: 'Unknown', icon: imageIndex.Unknown },
];

const FREQUENCIES = ['New', 'Repeated', 'Variation'];

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle }) => (
  <View style={s.sectionHeader}>
    {title && <Text style={s.sectionTitle}>{title}</Text>}
    {subtitle ? <Text style={[s.sectionSub,{
      color:"black",
      fontSize:15,
      fontWeight:"600",
      marginTop:7
    }]}>{subtitle}</Text> : null}
  </View>
);

const ContextChip = ({ item, selected, onPress }) => (
  <TouchableOpacity
    style={[s.contextChip, selected && s.contextChipSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={s.contextEmoji}>{item.emoji}</Text>
    <Text style={[s.contextLabel, selected && s.contextLabelSelected]}>
      {item.label}
    </Text>
  </TouchableOpacity>
);

const EmotionButton = ({ item, selected, onPress }) => (
  <TouchableOpacity
    style={[
      s.emotionBtn,
      selected && { borderColor: item.color, backgroundColor: item.color + '15' },
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image 
      source={item?.image} 
      style={{ width: 44, height: 44, marginBottom: 6,  }}
    />
    <Text style={[s.emotionLabel, selected && { color: item.color, fontWeight: '700' }]}>
      {item.label}
    </Text>
  </TouchableOpacity>
);

const SourceChip = ({ item, selected, onPress }) => (
  <TouchableOpacity
    style={[s.sourceChip, selected && s.sourceChipSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image source={item.icon}  style={{
      height:30,
      width:30
    }}  />
    <Text style={[s.sourceLabel, selected && s.sourceLabelSelected,{
      marginLeft:5 ,

    }]}>
      {item.label}
    </Text>
  </TouchableOpacity>
);

const FreqButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[s.freqBtn, selected && s.freqBtnSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[s.freqLabel, selected && s.freqLabelSelected]}>{label}</Text>
  </TouchableOpacity>
);

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AddNewScriptScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);
// ── Data ─────────────────────────────────────────────────────────────────────
const CONTEXTS = [
  { id: 'home', label: 'Home', emoji: '🏠', },
  { id: 'school', label: 'School', emoji: '🏫' },
  { id: 'car', label: 'Car', emoji: '🚗' },
  { id: 'bedtime', label: 'Bedtime', emoji: '🌙' },
 
];
  // Form States
  const [scriptText, setScriptText] = useState('');
  const [selectedContext, setSelectedContext] = useState('home');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedFreq, setSelectedFreq] = useState('New');
  const [meaning, setMeaning] = useState('');
  const [notes, setNotes] = useState('');

  const toggleEmotion = (id: string) =>
    setSelectedEmotions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );

  const goToStep = (step: number) => {
    if (step >= 0 && step <= 2) {
      setCurrentStep(step);
      flatListRef.current?.scrollToIndex({ index: step, animated: true });
    }
  };

  const handleSave = () => {
    const data = {
      scriptText,
      context: selectedContext,
      emotions: selectedEmotions,
      source: selectedSource,
      frequency: selectedFreq,
      meaning,
      notes,
    };
    console.log('Saved Script:', data);
    navigation?.goBack();
  };

  const renderStep = ({ item: stepIndex }: { item: number }) => {
    if (stepIndex === 0) {
      return (
        <View style={s.stepContainer}>
          <View style={s.card}>
            <SectionHeader title="" subtitle="What exactly did your child say?" />
            <View style={s.scriptInputContainer}>
              <TextInput
                multiline
                numberOfLines={6}
                placeholder="Type the script here…"
                placeholderTextColor={"black"}
                style={s.scriptInput}
                value={scriptText}
                onChangeText={setScriptText}
                textAlignVertical="top"
              />
              <View style={s.inputFooter}>
                <Text style={s.charCount}>{scriptText.length} / 500</Text>
                <TouchableOpacity style={s.micBtn}>
                  <Image source={imageIndex.voice} style={s.micIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={s.card}>
            <SectionHeader title="Context" subtitle="" />
            <View style={s.grid}>
              {CONTEXTS.map((item) => (
                <ContextChip
                  key={item.id}
                  item={item}
                  selected={selectedContext === item.id}
                  onPress={() => setSelectedContext(item.id)}
                />
              ))}
            </View>
          </View>
        </View>
      );
    }
const EMOTIONS = [
  { id: 'happy', label: 'Happy', color: C.happy , image :imageIndex.Happy },
  { id: 'sad', label: 'Sad', color: C.sad ,image :imageIndex.Sad  },
  { id: 'angry', label: 'Angry', color: C.angry,image :imageIndex.Angry  },
  { id: 'anxious', label: 'Anxious', color: C.anxious ,image :imageIndex.Anxious  },
  { id: 'excited', label: 'Excited', color: C.excited ,image :imageIndex.Excited },
  { id: 'neutral', label: 'Neutral', color: C.neutral ,image :imageIndex.Neutral },
];

    if (stepIndex === 1) {
      return (
        <View style={s.stepContainer}>
          <View style={s.card}>
            <SectionHeader title="Emotional State" subtitle="How were they feeling?" />
            <View style={s.emotionGrid}>
              {EMOTIONS.map((item) => (
                <EmotionButton
                  key={item.id}
                  item={item}
                  selected={selectedEmotions.includes(item.id)}
                  onPress={() => toggleEmotion(item.id)}
                />
              ))}
            </View>
          </View>

          <View style={s.card}>
            <SectionHeader title="Source" subtitle="" />
            <View style={s.sourceGrid}>
              {SOURCES.map((item) => (
                <SourceChip
                  key={item.id}
                  item={item}
                  selected={selectedSource === item.id}
                  onPress={() => setSelectedSource(item.id)}
                />
              ))}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={s.stepContainer}>
        <View style={s.card}>
          <SectionHeader title="Frequency" subtitle="" />
          <View style={s.freqRow}>
            {FREQUENCIES.map((f) => (
              <FreqButton
                key={f}
                label={f}
                selected={selectedFreq === f}
                onPress={() => setSelectedFreq(f)}
              />
            ))}
          </View>
        </View>

        <View style={s.card}>
          <SectionHeader title="" subtitle="What do you think it means?" />
          <TextInput
            style={s.textArea}
            placeholder="Explain the intended meaning…"
            placeholderTextColor={"black"}
            value={meaning}
            onChangeText={setMeaning}
            
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={s.card}>
          <SectionHeader title="Notes" />
          <TextInput
            style={s.textArea}
            placeholder="Any other observations?"
             value={notes}
            onChangeText={setNotes}
                        placeholderTextColor={"black"}

            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
     <StatusBarComponent />
      <CustomHeader label="Add New Script" />
      {/* ── Header ── */}
    
        <View style={[s.progressContainer,{
          alignItems:"center",
          justifyContent:"center"
        }]}>
           <View style={s.stepDots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[s.dot, currentStep === i && s.activeDot]} />
            ))}
          </View>
        </View>
  
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={[0, 1, 2]}
          renderItem={renderStep}
          horizontal
          pagingEnabled
          scrollEnabled={false} // Only allow navigation via buttons for a clean flow
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.toString()}
        />

        {/* ── Footer ── */}
        <View style={s.footer}>
          {currentStep > 0 ? (
            <TouchableOpacity 
              style={s.secondaryBtn} 
              onPress={() => goToStep(currentStep - 1)}
            >
              <Text style={s.secondaryBtnText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {currentStep < 2 ? (
            <TouchableOpacity 
              style={s.primaryBtn} 
              onPress={() => goToStep(currentStep + 1)}
            >
              <Text style={s.primaryBtnText}>Next Step</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
              <Text style={s.saveBtnText}>Save Script</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 6 },
  stepDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.border },
  activeDot: { width: 16, backgroundColor: C.primary },
  
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
          shadowColor:  Platform.OS === 'android' ?'#BCDBFF' :"black",

    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  backIcon: { fontSize: 28, color: C.text, marginTop: -4 },

  // Step Layout
  stepContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // Cards
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
          shadowColor:  Platform.OS === 'android' ?'#BCDBFF' :"black",

    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  // Sections
  sectionHeader: { marginBottom: 16, marginTop:11 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  sectionSub: { fontSize: 13, color: C.sub, marginTop: 4 },

  // Inputs
  scriptInputContainer: {
    borderWidth: 1,
    borderColor: "#67B3C8",
    borderRadius: 16,
    backgroundColor: C.bg,
    padding: 12,
  },
  scriptInput: { fontSize: 16, color: C.text, minHeight: 120 },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  charCount: { fontSize: 12, color: C.sub },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
     alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: { width: 44, height: 44,  },

  textArea: {
    backgroundColor: "#F8F9FC",
    borderRadius: 16,
    padding: 12,
    fontSize: 15,
    color: C.text,
    minHeight: 100,
   },

  // Context Chips
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  contextChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: C.tagBg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  contextChipSelected: {
    backgroundColor: "white",
    borderColor: C.primary,
  },
  contextEmoji: { fontSize: 18, marginRight: 8 },
  contextLabel: { fontSize: 14, fontWeight: '500', color: C.tagText },
  contextLabelSelected: { color: C.primary, fontWeight: '700' },

  // Emotions
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  emotionBtn: {
    width: '30%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: C.tagBg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emotionLabel: { fontSize: 14, color: "black", marginTop: 4 , },

  // Source
  sourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: C.tagBg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  sourceChipSelected: { backgroundColor: 'white', borderColor: C.accent },
  sourceIcon: { width: 18, height: 18, marginRight: 10, tintColor: C.sub },
  sourceLabel: { fontSize: 14, fontWeight: '500', color: C.tagText },
  sourceLabelSelected: { color: C.accent, fontWeight: '700' },

  // Frequency
  freqRow: { flexDirection: 'row', gap: 10 },
  freqBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: C.tagBg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  freqBtnSelected: { backgroundColor: "#E03B65",   },
  freqLabel: { fontSize: 14, fontWeight: '700', color: C.tagText },
  freqLabelSelected: { color: "white" },

  // Footer
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: C.bg,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: C.accent,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
 
     
  },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '800',  

textAlign:"center"

  },
  
  secondaryBtn: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
     borderColor: C.border,
     justifyContent:"center"
  },
  secondaryBtnText: { color: "black", fontSize: 16, fontWeight: '700' },

  saveBtn: {
    flex: 2,
    backgroundColor: C.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
   
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '800' },
});