import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
   Image,
} from 'react-native';
import Svg, { Rect, Line, Polyline } from 'react-native-svg';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageIndex from '../../../assets/imageIndex';

type TabType = 'Activity' | 'Emotions' | 'Trends';

const COLORS = {
  bg: 'white',
  card: '#FFFFFF',
  text: '#111111',
  subText: '#7B7B7B',
  border: '#ECECEC',
  green: '#9AD14B',
  greenDark: '#74B22C',
  pink: '#E84A78',
  blue: '#5A7DFF',
  orange: '#F5B84B',
  purple: '#9C6BFF',
  lightGray: '#F2F2F2',
};



const weeklyBars = [80, 92, 76, 90, 84, 94, 88];

const emotionalData = [
  { label: 'Happy', value: 82 },
  { label: 'Excited', value: 74 },
  { label: 'Neutral', value: 68 },
  { label: 'Sad', value: 79 },
  { label: 'Anxious', value: 63 },
];

const trendLines = {
  blue: [20, 35, 48, 62, 78, 95],
  purple: [20, 33, 44, 58, 73, 88],
  green: [20, 29, 39, 50, 63, 76],
};

const milestones = [
  {
    icon: '✍️',
    title: 'First two-word phrase',
    date: 'March 12',
  },
  {
    icon: '⭐',
    title: 'Used phrase independently',
    date: 'March 18',
  },
  {
    icon: '🔵',
    title: 'Maintained eye contact during conversation',
    date: 'March 22',
  },
];

const ProgressScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Activity');

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'Activity':
        return <WeeklyBarsCard />;
      case 'Emotions':
        return <EmotionalPatternsCard />;
      case 'Trends':
        return <CommunicationImprovementCard />;
      default:
        return null;
    }
  }, [activeTab]);
  const stats = [
    {
      img: imageIndex.Conservative,
      label: 'B', value: '27', color: COLORS.blue, bg: '#EEF3FF'
    },
    { label: '📊', value: '+18%', color: '#40B36C', bg: '#EEFBF2', img: imageIndex.icons, },
    { label: '☺', value: '82%', color: COLORS.orange, bg: '#FFF6E8', img: imageIndex.Positive, },
  ];
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />
      <CustomHeader label="Progress" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.statsRow}>
          {stats.map((item, index) => (
            <View key={index} style={styles.statCard}>
                 <Image source={item.img}  
                 style={{
                  height:55,
                  width:55
                 }}
                 />
                
       
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tabsWrap}>
          {(['Activity', 'Emotions', 'Trends'] as TabType[]).map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.85}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {renderContent}

        <Text style={styles.sectionTitle}>Recent Milestones</Text>

        {milestones.map((item, index) => (
          <View key={index} style={styles.milestoneCard}>
            <View style={styles.milestoneIcon}>
              <Text style={styles.milestoneEmoji}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.milestoneTitle}>{item.title}</Text>
              <Text style={styles.milestoneDate}>{item.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const WeeklyBarsCard = () => {
  const chartHeight = 130;
  const barWidth = 14;
  const gap = 18;
  const baseY = 120;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Scripts This Week</Text>

      <View style={styles.chartWrap}>
        <Svg width="100%" height={chartHeight} viewBox="0 0 220 130">
          {[0, 1, 2, 3].map(i => (
            <Line
              key={i}
              x1="0"
              y1={25 + i * 25}
              x2="220"
              y2={25 + i * 25}
              stroke="#EEEEEE"
              strokeWidth="1"
            />
          ))}

          {weeklyBars.map((value, index) => {
            const x = 18 + index * (barWidth + gap);
            const height = value;
            return (
              <Rect
                key={index}
                x={x}
                y={baseY - height}
                width={barWidth}
                height={height}
                rx={7}
                fill={COLORS.pink}
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const EmotionalPatternsCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Emotional Patterns</Text>

      <View style={{ marginTop: 8 }}>
        {emotionalData.map((item, index) => (
          <View key={index} style={styles.progressRow}>
            <Text style={styles.progressLabel}>{item.label}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${item.value}%` }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const CommunicationImprovementCard = () => {
  const width = 260;
  const height = 150;
  const padding = 20;

  const toPoints = (arr: number[]) => {
    const stepX = (width - padding * 2) / (arr.length - 1);
    return arr
      .map((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - (value / 100) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Communication Improvement</Text>

      <View style={styles.chartWrap}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {[0, 1, 2, 3].map(i => (
            <Line
              key={`h-${i}`}
              x1={padding}
              y1={padding + i * 28}
              x2={width - padding}
              y2={padding + i * 28}
              stroke="#EEEEEE"
              strokeWidth="1"
            />
          ))}

          {[0, 1, 2, 3, 4].map(i => (
            <Line
              key={`v-${i}`}
              x1={padding + i * 55}
              y1={padding}
              x2={padding + i * 55}
              y2={height - padding}
              stroke="#F3F3F3"
              strokeWidth="1"
            />
          ))}

          <Polyline
            points={toPoints(trendLines.green)}
            fill="none"
            stroke="#7ED957"
            strokeWidth="2.5"
          />
          <Polyline
            points={toPoints(trendLines.purple)}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth="2.5"
          />
          <Polyline
            points={toPoints(trendLines.blue)}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth="2.5"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statCard: {
   width: '31.5%',
  backgroundColor: COLORS.card,
  borderRadius: 16,
  paddingVertical: 14,
  alignItems: 'center',

  // Border (optional soft look)
  borderWidth: 1.5,
  borderColor: COLORS.border,

  // iOS Shadow (soft & natural)
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 5,
 
 
  },
  statIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  tabsWrap: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',  
  },
  tabBtnActive: {
    backgroundColor: COLORS.green,
        alignItems: 'center',
    justifyContent: 'center',  
    paddingVertical: 12,

 
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.subText,
  },
  tabTextActive: {
        fontSize: 14,

    color: '#FFFFFF',
  },
  card: {
   backgroundColor: COLORS.card,
  borderRadius: 18,
  padding: 14,
   borderColor: COLORS.border,
  marginBottom: 18,

  // iOS Shadow
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.1,
  shadowRadius: 6,
 borderWidth: 1.5,
 
  // Android Shadow
 
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  chartWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRow: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 11,
    color: COLORS.subText,
    marginBottom: 6,
  },
  progressTrack: {
    height: 10,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.green,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: "black",
    marginBottom: 15,
  },
  milestoneCard: {
   backgroundColor: COLORS.card,
  borderRadius: 16,
  padding: 15,
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,

  // Border (optional soft look)
  borderWidth: 1.5,
  borderColor: 'rgba(0,0,0,0.05)',

  // Shadow (iOS)
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 6,

  // Shadow (Android)
   },
  milestoneIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  milestoneEmoji: {
    fontSize: 16,
    color:"black",
    fontWeight:"500"
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  milestoneDate: {
    fontSize: 10,
    color: COLORS.subText,
  },
});

export default ProgressScreen;