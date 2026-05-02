import React, { useState } from 'react';
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
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../compoent/CustomHeader';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import { useFocusEffect } from '@react-navigation/native';
import useDashboard from '../DashBoard/useDashboard';
import { GetActivitiesProgressApi, GetWeeklyFocusApi, GetWeeklyReportsApi } from '../../../Api/apiRequest';

type TabType = 'Activity' | 'Script' | 'Emotions';

const COLORS = {
  bg: 'white',
  card: '#FFFFFF',
  text: '#111111',
  subText: '#9A9A9A',
  border: '#EFEFEF',
  green: '#A1D14A',
  greenLight: '#EAF5D2',
  pink: '#E84A78',
  pinkLight: '#FDEEF3',
  blue: '#5A7DFF',
  blueLight: '#EEF3FF',
  orange: '#F5B84B',
  orangeLight: '#FFF6E8',
  purple: '#9C6BFF',
  purpleLight: '#F3EEFF',
  trendGreen: '#7ED957',
  lightGray: '#F0F0F0',
};

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const emotionalData = [
  { label: 'Happy', value: 82, color: COLORS.green },
  { label: 'Excited', value: 74, color: COLORS.blue },
  { label: 'Neutral', value: 68, color: COLORS.orange },
  { label: 'Sad', value: 79, color: COLORS.pink },
  { label: 'Anxious', value: 63, color: COLORS.purple },
];

const milestones = [
  {
    emoji: '✍️',
    bg: '#FFF6E8',
    title: 'First two-word phrase',
    date: 'March 12',
  },
  {
    emoji: '⭐',
    bg: '#FFFBE6',
    title: 'Used phrase independently',
    date: 'March 18',
  },
  {
    emoji: '💬',
    bg: '#EEF3FF',
    title: 'Maintained eye contact during conversation',
    date: 'March 22',
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const TabBar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (t: TabType) => void;
}) => (
  <View style={styles.tabsWrap}>
    {(['Activity', 'Script', 'Emotions'] as TabType[]).map(tab => {
      const isActive = activeTab === tab;
      return (
        <TouchableOpacity
          key={tab}
          activeOpacity={0.85}
          onPress={() => setActiveTab(tab)}
          style={[styles.tabBtn, isActive && styles.tabBtnActive]}
        >
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const WeeklyBarsCard = ({ data, title }: { data: number[]; title?: string }) => {
  const bars = data && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const svgW = 300;
  const svgH = 130;
  const barW = 22;
  const maxBar = 104;
  const baseY = 112;
  const totalBars = bars.length;
  const spacing = (svgW - barW * totalBars) / (totalBars + 1);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title || 'Scripts this week'}</Text>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>7 days</Text>
        </View>
      </View>
      <Svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
        {[0, 1, 2, 3].map(i => (
          <Line
            key={i}
            x1="0"
            y1={20 + i * 24}
            x2={svgW}
            y2={20 + i * 24}
            stroke="#EEEEEE"
            strokeWidth="1"
          />
        ))}
        {bars.map((value, index) => {
          const x = spacing + index * (barW + spacing);
          const height = Math.min((value / 100) * maxBar, maxBar);
          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={baseY - height}
                width={barW}
                height={height}
                rx={8}
                fill={COLORS.pink}
                opacity={0.75 + index * 0.04}
              />
              <SvgText
                x={x + barW / 2}
                y={svgH}
                textAnchor="middle"
                fontSize="13"
                fill={"black"}
              >
                {weekDays[index] || ''}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const ScriptSummaryCard = ({ summary, insights }: { summary: any; insights?: any }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Script Summary</Text>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>Weekly</Text>
        </View>
      </View>
      <View style={styles.scriptSummaryBody}>
        <Text style={styles.scriptSummaryValue}>{summary?.total_scripts_this_week || 0}</Text>
        <Text style={styles.scriptSummaryLabel}>Total scripts this week</Text>

        {summary?.script_growth_percentage !== undefined && (
          <View style={[styles.cardBadge, { backgroundColor: COLORS.greenLight, marginTop: 12 }]}>
            <Text style={[styles.cardBadgeText, { color: COLORS.green }]}>
              +{summary.script_growth_percentage}% Growth
            </Text>
          </View>
        )}

        {insights?.repeated_script_names && (
          <View style={styles.insightsBox}>
            <Text style={styles.insightsTitle}>Most Repeated:</Text>
            <Text style={styles.insightsValue}>{insights.repeated_script_names}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const EmotionalPatternsCard = ({ data }: { data: any[] }) => {
  const emotions = data && data.length > 0 ? data : emotionalData;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Emotional patterns</Text>
      </View>
      <View style={{ marginTop: 4 }}>
        {emotions.map((item, index) => (
          <View key={index} style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>{item.label}</Text>
              <Text style={[styles.progressPercent, { color: item.color || COLORS.green }]}>{item.value}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${item.value}%`, backgroundColor: item.color || COLORS.green },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};


const MilestonesList = ({ data }: { data: any[] }) => {
  const list = data && data.length > 0 ? data : milestones;
  return (
    <>
      <Text style={styles.sectionTitle}>Recent Milestones</Text>
      {list.map((item, index) => (
        <View key={index} style={styles.milestoneCard}>
          <View style={[styles.milestoneIconWrap, { backgroundColor: COLORS.orangeLight }]}>
            <Text style={styles.milestoneEmoji}>{item.icon || item.emoji || '⭐'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.milestoneTitle}>{item.title}</Text>
            {item.date && <Text style={styles.milestoneDate}>{item.date}</Text>}
          </View>
        </View>
      ))}
    </>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

const ProgressScreen = () => {
  const { activeChild } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabType>('Activity');
  const [focusData, setFocusData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (activeChild?.id) {
        fetchProgressData(activeChild.id);
      }
    }, [activeChild])
  );

  const fetchProgressData = async (childId: number) => {
    setIsLoading(true);
    try {
      const [focus, report, progress] = await Promise.all([
        GetWeeklyFocusApi(childId, () => { }),
        GetWeeklyReportsApi(childId, () => { }),
        GetActivitiesProgressApi(childId, () => { })
      ]);
      if (focus) setFocusData(focus);
      if (report) setReportData(report);
      if (progress) setProgressData(progress);
    } catch (error) {
      console.error('[ProgressScreen] fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Activity':
        return <WeeklyBarsCard data={progressData?.data?.weekly_activity_chart?.values || []} title="Activities this week" />;
      case 'Script':
        return <ScriptSummaryCard summary={progressData?.data?.progress_summary} insights={progressData?.data?.script_insights} />;
      case 'Emotions':
        const emotionsMap = progressData?.data?.emotion_chart;
        const mappedEmotions = emotionsMap ? emotionsMap.labels.map((label: string, index: number) => ({
          label: label.charAt(0).toUpperCase() + label.slice(1),
          value: emotionsMap.values[index],
          color: emotionalData[index % emotionalData.length].color
        })) : emotionalData;
        return <EmotionalPatternsCard data={mappedEmotions} />;
      default:
        return null;
    }
  };

  const StatsRow = () => {
    const actProg = progressData?.data?.activity_progress;
    const progSum = progressData?.data?.progress_summary;
    const dynamicStats = [
      {
        img: imageIndex.Conservative,
        value: actProg?.total_activities || '0',
        label: 'Activities',
        valueColor: COLORS.blue
      },
      {
        value: (actProg?.completion_rate_percentage || progSum?.activity_completion_rate || 0) + '%',
        label: 'Completion',
        valueColor: '#40B36C',
        img: imageIndex.icons
      },
      {
        img: imageIndex.Positive,
        value: progSum?.total_scripts_this_week || '0',
        label: 'Scripts',
        valueColor: COLORS.orange
      },
    ];

    return (
      <View style={styles.statsRow}>
        {dynamicStats.map((item, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statIconCircle}>
              <Image
                source={item?.img}
                style={{
                  height: 58,
                  width: 58
                }}
              />
            </View>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={[styles.statValue, { color: item.valueColor }]}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />
      <CustomHeader label="Progress" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <StatsRow />
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}
        <MilestonesList data={progressData?.data?.recent_milestones || []} />
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: 16,
    paddingBottom: 36,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "black",
    fontWeight: '500',
  },
  // Tabs
  tabsWrap: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 50,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.green,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: "black",
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderColor: COLORS.border,
    marginBottom: 16,
    shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardBadge: {
    backgroundColor: COLORS.pinkLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  cardBadgeText: {
    fontSize: 11,
    color: COLORS.pink,
    fontWeight: '600',
  },
  // Emotions progress
  progressRow: {
    marginBottom: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: "black",
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 9,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 20,
  },
  // Trends legend
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  // Milestones
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 14,
  },
  milestoneCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  milestoneIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  milestoneEmoji: {
    fontSize: 18,
    fontWeight: '600',
    color: "black"
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: "black",
    marginBottom: 3,
  },
  milestoneDate: {
    fontSize: 11,
    color: COLORS.subText,
  },
  scriptSummaryBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  scriptSummaryValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.green,
  },
  scriptSummaryLabel: {
    fontSize: 14,
    color: COLORS.subText,
    marginTop: 8,
    fontWeight: '500',
  },
  insightsBox: {
    marginTop: 16,
    width: '100%',
    padding: 12,
    backgroundColor: COLORS.blueLight,
    borderRadius: 12,
  },
  insightsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.blue,
    marginBottom: 4,
  },
  insightsValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default ProgressScreen;