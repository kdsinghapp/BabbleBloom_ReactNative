import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const Activity = () => {
  const previousReports = [
    { id: 1, title: 'Week of March 5', date: 'Generated Mar 12' },
    { id: 2, title: 'Week of Feb 26', date: 'Generated Mar 5' },
    { id: 3, title: 'Week of Feb 19', date: 'Generated Feb 26' },
  ];

  const StatRow = ({
    label,
    value,
    valueColor,
  }: {
    label: string;
    value: string;
    valueColor?: string;
  }) => (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );

  const ShareCard = ({
    title,
    subtitle,
    leftBg,
    icon,
  }: {
    title: string;
    subtitle: string;
    leftBg: string;
    icon: string;
  }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.shareCard}>
      <View style={[styles.shareIconBox, { backgroundColor: leftBg }]}>
        <Text style={styles.shareIcon}>{icon}</Text>
      </View>

      <View style={styles.shareTextWrap}>
        <Text style={styles.shareTitle}>{title}</Text>
        <Text style={styles.shareSubtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.shareAction}>↗</Text>
    </TouchableOpacity>
  );

  const PreviousReportItem = ({
    title,
    date,
  }: {
    title: string;
    date: string;
  }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.previousCard}>
      <View style={styles.previousLeft}>
        <View style={styles.reportIconBox}>
          <Text style={styles.reportIcon}>📄</Text>
        </View>

        <View>
          <Text style={styles.previousTitle}>{title}</Text>
          <Text style={styles.previousSubtitle}>{date}</Text>
        </View>
      </View>

      <Text style={styles.downloadIcon}>↓</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
          <StatusBarComponent />
      <CustomHeader label="Activity" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
 
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabButton, styles.activeTabButton]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Week</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.tabText}>Month</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton}>
            <Text style={styles.tabText}>Quarter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.blueIconBox}>
              <Text style={styles.blueIcon}>📄</Text>
            </View>

            <View style={styles.reportHeaderText}>
              <Text style={styles.reportTitle}>Communication Progress Report</Text>
              <Text style={styles.reportDate}>March 12 - March 19, 2026</Text>
            </View>
          </View>

          <StatRow label="Total Scripts" value="27" />
          <StatRow label="Positive Emotions" value="82%" />
          <StatRow label="Growth Rate" value="+18%" valueColor="#1FA971" />
          <StatRow label="New Milestones" value="3" />

          <TouchableOpacity activeOpacity={0.85} style={styles.generateButton}>
            <Text style={styles.generateButtonText}>⭳  Generate PDF Report</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Share Report With</Text>

        <ShareCard
          title="Email Report"
          subtitle="Send to therapist or school"
          leftBg="#E8F6EE"
          icon="✉️"
        />

        <ShareCard
          title="Schedule Regular Reports"
          subtitle="Automatic weekly or monthly delivery"
          leftBg="#EAF1FF"
          icon="📅"
        />

        <Text style={styles.sectionTitle}>Previous Reports</Text>

        {previousReports.map(item => (
          <PreviousReportItem
            key={item.id}
            title={item.title}
            date={item.date}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Activity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F5',
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ECECE8',
    borderRadius: 30,
    padding: 4,
    marginBottom: 18,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#E83F77',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  reportCard: {
    backgroundColor: '#F4F4F1',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  blueIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#5C9DF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  blueIcon: {
    fontSize: 20,
  },
  reportHeaderText: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 11,
    color: '#8A8A8A',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2DD',
  },
  statLabel: {
    fontSize: 13,
    color: '#3A3A3A',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    color: '#111111',
    fontWeight: '700',
  },
  generateButton: {
    marginTop: 18,
    backgroundColor: '#C7C428',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  generateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  shareCard: {
    backgroundColor: '#F4F4F1',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shareIcon: {
    fontSize: 18,
  },
  shareTextWrap: {
    flex: 1,
  },
  shareTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  shareSubtitle: {
    fontSize: 11,
    color: '#949494',
  },
  shareAction: {
    fontSize: 18,
    color: '#74C67A',
    fontWeight: '700',
  },
  previousCard: {
    backgroundColor: '#F4F4F1',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previousLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E83F77',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  previousTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 3,
  },
  previousSubtitle: {
    fontSize: 11,
    color: '#9A9A9A',
  },
  downloadIcon: {
    fontSize: 18,
    color: '#6FA8FF',
    fontWeight: '700',
  },
});