import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import imageIndex from '../../../assets/imageIndex';

const Activity = () => {

  const [activeTab, setActiveTab] = useState('Week');

  const previousReports = [
    { id: 1, title: 'Week of March 5', date: 'Generated Mar 12', type: 'Week' },
    { id: 2, title: 'Month of February', date: 'Generated Mar 5', type: 'Month' },
    { id: 3, title: 'Quarter Q1', date: 'Generated Mar 26', type: 'Quarter' },
    { id: 4, title: 'Week of Feb 19', date: 'Generated Feb 26', type: 'Week' },
  ];

  const filteredReports = previousReports.filter(
    item => item.type === activeTab
  );

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

       <Image source={imageIndex.share} 
       style={{
        height:22,
        width:22
       }}
       />
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
       <Image source={imageIndex.pinkDoc} 
       
       style={{
        height:55,
        width:55 ,
        marginRight:18
       }}
       />

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

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['Week', 'Month', 'Quarter'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Report Card */}
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
           <Image source={imageIndex.doc}  
            style={{
              width: 55,  
              height: 55,
              marginRight:8
           }}
           />

            <View style={styles.reportHeaderText}>
              <Text style={styles.reportTitle}>
                Communication Progress Report
              </Text>
              <Text style={styles.reportDate}>
                March 12 - March 19, 2026
              </Text>
            </View>
          </View>

          <StatRow label="Total Scripts" value="27" />
          <StatRow label="Positive Emotions" value="82%" />
          <StatRow label="Growth Rate" value="+18%" valueColor="#1FA971" />
          <StatRow label="New Milestones" value="3" />

          <TouchableOpacity activeOpacity={0.85} style={styles.generateButton}>
            <Text style={styles.generateButtonText}>
               Generate PDF Report
            </Text>
          </TouchableOpacity>
        </View>

        {/* Share Section */}
        <Text style={styles.sectionTitle}>Share Report With</Text>

        <ShareCard
          title="Email Report"
          subtitle="Send to therapist or school"
          leftBg="#50C878"
          icon="✉️"
        />

        <ShareCard
          title="Schedule Regular Reports"
          subtitle="Automatic weekly or monthly delivery"
          leftBg="#4A90E2"
          icon="📅"
        />

        {/* Previous Reports */}
        <Text style={styles.sectionTitle}>Previous Reports</Text>

        {filteredReports.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            No reports available
          </Text>
        ) : (
          filteredReports.map(item => (
            <PreviousReportItem
              key={item.id}
              title={item.title}
              date={item.date}
            />
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default Activity;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 30,
  },

  /* 🔥 Tabs */
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    padding: 5,
    marginBottom: 20,

 
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },

  activeTabButton: {
    backgroundColor: '#E83F77',
  },

  tabText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* 🔥 Report Card */
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,

    elevation: 15,
          shadowColor:  Platform.OS === 'android' ?'#BCDBFF' :"black",

    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  blueIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  reportDate: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
  },

  /* 🔥 Stats */
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE3EB',
  },

  statLabel: {
    fontSize: 13,
    color: '#473728',
    fontWeight: '500',
  },

  statValue: {
    fontSize: 13,
    color: '#111',
    fontWeight: '700',
  },

  /* 🔥 Button */
  generateButton: {
    marginTop: 18,
    backgroundColor: '#CCCA33',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',

   
  },

  generateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },

  /* 🔥 Section Title */
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },

  /* 🔥 Share Card */
  shareCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,

    elevation: 15,
        shadowColor:  Platform.OS === 'android' ?'#BCDBFF' :"black",

    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  shareIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  shareIcon: {
    fontSize: 18,
    color: '#FFF',
  },

  shareTextWrap: {
    flex: 1,
  },

  shareTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  shareSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  shareAction: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '700',
  },

  /* 🔥 Previous Reports */
  previousCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,

    elevation: 15,
          shadowColor:  Platform.OS === 'android' ?'#BCDBFF' :"black",
  
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  previousLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reportIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E83F77',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  reportIcon: {
    fontSize: 18,
    color: '#FFF',
  },

  previousTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  previousSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },

  downloadIcon: {
    fontSize: 18,
    color: '#6FA8FF',
    fontWeight: '700',
  },
});