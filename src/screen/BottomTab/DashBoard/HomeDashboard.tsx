import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { SafeAreaView } from 'react-native-safe-area-context';
import screenNameEnum from '../../../routes/screenName.enum';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import useDashboard from './useDashboard';
import ScriptItem from '../../../compoent/ScriptItem';
import { BASE_URLIMAGE, GetDailyPromptApi } from '../../../Api/apiRequest';
import { useSelector } from 'react-redux';

const PlusCircle = () => (
  <View style={styles.iconCircle}>
    <Text style={styles.iconCircleText}>＋</Text>
  </View>
);
const BarChartIcon = () => <Image source={imageIndex.grap} style={{ width: 29, height: 29 }} />;
const LibraryIcon = () => <Image source={imageIndex.Library} style={{ width: 29, height: 29 }} />;
const ActivityIcon = () => <Image source={imageIndex.Activity} style={{ width: 29, height: 29 }} />;

// ─── Colour tokens ───────────────────────────────────────────────────────────
const C = {
  pink: '#E03B65',
  pinkLight: '#FDEEF4',
  pinkText: '#E03B65',
  cream: '#F8DAA6',
  brown: '#9C593E',
  brownDark: '#9C593E',
  teal: '#4DC8C8',
  green: '#6DC95A',
  white: '#FFFFFF',
  bg: 'white',
  textDark: '#1A1A1A',
  textGray: '#E03B65',
  insightBg: '#FFF5F5',
  insightText: '#E8336D',
  tagBg: '#FFE5EC',
  tagText: '#E8336D',
};


function TodayBanner({ prompt }: { prompt: any }) {
  const displayPrompt = prompt?.prompt || "Try this today: 'Let's\nplay together.";
  return (
    <View style={styles.banner}>
      <View style={[styles.bannerContent]}>
        <Text style={styles.bannerTitle}>{displayPrompt}</Text>
        <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.85}>
          <Text style={styles.bannerBtnText}>Let's play together</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.bannerIllustration, {
        marginTop: 8
      }]}>
        <Image source={imageIndex.family} style={styles.bannerImg} />
      </View>
    </View>
  );
}


function RecentScripts({ scripts }: { scripts: any[] }) {
  const navigator = useNavigation()
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Scripts</Text>
        <TouchableOpacity onPress={() => {
          navigator.navigate(screenNameEnum.AllRecentScripts as never, { scripts: scripts } as never)
        }}>
          <Text style={[styles.seeAll, {
            color: "#00D490"
          }]}>See All</Text>
        </TouchableOpacity>
      </View>
      {scripts && scripts.length > 0 ? (
        scripts.slice(0, 3).map((item) => (
          <ScriptItem key={item.id} item={item} navigator={navigator} />
        ))
      ) : (
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.emptyScriptsText}>No recent scripts found</Text>
        </View>
      )}
    </View>
  );
}

function WeeklyInsight() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weekly Insight</Text>
      <View style={styles.insightRow}>
        {/* Left card */}
        <View style={[styles.insightCard, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.insightLabel, {
            color: "#000000"
          }]}>Scripts this week</Text>
          <Text style={styles.insightNumber}>00</Text>
        </View>
        {/* Right card */}
        <View style={[styles.insightCard, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.insightLabel, {
            color: "#000000"

          }]}>Most repeated</Text>
          <View style={styles.insightTag}>
            <Text style={styles.insightTagText}>"Want juice"</Text>
          </View>
        </View>
      </View>
      <Text style={styles.insightNoteText}>
        Pattern found: Evenings show more overwhelm scripts than mornings. Consider adding sensory
        breaks at 5 PM.
      </Text>
    </View>
  );
}


export default function HomeScreen() {
  const { activeChild, navigation: navigator, scripts, fetchScripts } = useDashboard();

  const [dailyPrompt, setDailyPrompt] = React.useState<any>(null);

  const fetchDailyPrompt = async (childId: number) => {
    const data = await GetDailyPromptApi(childId, () => { });
    if (data) {
      setDailyPrompt(data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (activeChild?.id) {
        fetchScripts(activeChild.id);
        fetchDailyPrompt(activeChild.id);
      }
    }, [activeChild])
  );
  function QuickActions() {
    const quickActions = [
      {

        name: screenNameEnum.ProgressScreen,
        label: 'Reports', color: "#67B3C8", Icon: BarChartIcon
      },
      {
        label: 'Library', color: "#A1D14A", Icon: LibraryIcon, name: screenNameEnum.LibraryScreen,
      },
      { label: 'Activity', color: "#E03B65", Icon: ActivityIcon, name: screenNameEnum.Activity, },
    ];

    return (
      <View style={[styles.section, { paddingBottom: 32 }]}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickRow}>
          {quickActions?.map(({ label, color, Icon, name }) => (
            <TouchableOpacity
              key={label}
              onPress={() => {
                navigator.navigate(name as never)
              }}
              style={[styles.quickCard, { backgroundColor: color }]}
              activeOpacity={0.85}
            >
              <Icon />
              <Text style={styles.quickLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
  function AddScriptButton() {
    return (
      <TouchableOpacity style={styles.addBtn} activeOpacity={0.88}
        onPress={() => {
          navigator.navigate(screenNameEnum.AddNewScript as never, { child_id: activeChild?.id } as never)
        }}
      >
        <View style={styles.addBtnInner}>
          <PlusCircle />
          <Text style={styles.addBtnText}>Add New Script</Text>
        </View>
      </TouchableOpacity>
    );
  }
  const userData = useSelector((state: any) => state.auth.userData);

  function Header() {
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.subGreeting}>Let's support {activeChild?.full_name || 'Emma'} today</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigator.navigate(screenNameEnum.NotificationsScreen as never)}
          >
            <Image source={imageIndex.NotificationIcon}

              style={{ width: 22, height: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigator.navigate(screenNameEnum.ProfileSetting as never)
          }}>
            <View style={styles.avatar}>
              <Image
                source={
                  userData?.profile_image
                    ? { uri: `${BASE_URLIMAGE}/${userData.profile_image}` }
                    : imageIndex.prfile
                }
                style={{ width: 55, height: 55, borderRadius: 50 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBarComponent />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <TodayBanner prompt={dailyPrompt} />
        <AddScriptButton />
        <RecentScripts scripts={scripts} />
        <WeeklyInsight />
        <QuickActions />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
    backgroundColor: C.white,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: C.pink,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subGreeting: {
    fontSize: 13,
    color: C.textGray,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {

    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {

    alignItems: 'center',
    justifyContent: 'center',

  },
  avatarImg: {
    width: 55,
    height: 55,
    borderRadius: 21,
  },

  banner: {
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 20,
    backgroundColor: C.cream,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 160,
    padding: 17,
  },
  bannerContent: {
    flex: 1,
    paddingRight: 8,
    bottom: 15
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.brown,
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 14,
    marginTop: 10
  },
  bannerBtn: {
    backgroundColor: C.brownDark,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: C.white,
    fontWeight: '700',
    fontSize: 13,
  },
  bannerIllustration: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  bannerImg: {
    height: 140,
    resizeMode: 'contain',
    right: 18
  },

  // Add Script
  addBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: C.pink,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',

  },
  addBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleText: {
    color: C.white,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
  },
  addBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.textDark,
    marginBottom: 12,
  },
  seeAll: {
    color: C.pink,
    fontWeight: '600',
    fontSize: 14,
  },


  // Weekly Insight
  insightRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  insightCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    shadowColor: Platform.OS === 'android' ? '#BCDBFF' : "black",

    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightLabel: {
    fontSize: 12,
    color: C.textGray,
    marginBottom: 6,
    textAlign: "center"
  },
  insightNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: C.textDark,
    textAlign: "center"

  },
  insightTag: {
    backgroundColor: C.tagBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  insightTagText: {
    color: C.tagText,
    fontWeight: '600',
    fontSize: 13,
  },
  insightNote: {
    backgroundColor: C.insightBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  insightNoteText: {
    color: "#E03B65",
    fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
  },

  // Quick Actions
  quickRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,

  },
  quickLabel: {
    color: C.white,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  emptyScriptsContainer: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderStyle: 'dashed',
  },
  emptyScriptsText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    textAlign: "center"
  },
});