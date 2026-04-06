import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
 import ScreenNameEnum from '../../../routes/screenName.enum';
import { RegistrationStackParamList } from '../../../navigators/RegistrationRoutes';
import { BASE_URLIMAGE } from '../../../Api/apiRequest';
 
const InfoItem = ({ label, value, icon, isLast = false }: { label: string; value: string; icon?: any; isLast?: boolean }) => (
  <View style={[styles.infoItem, !isLast && styles.borderBottom]}>
    <View style={styles.iconCircle}>
      {icon && <Image source={icon} style={styles.itemIcon} />}
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

const ParentInfoScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RegistrationStackParamList>>();
  const userData = useSelector((state: any) => state.auth.userData);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <CustomHeader label="Parent Information" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Profile Card Section */}
        <View style={styles.headerCard}>
          <View style={styles.avatarBorder}>
            {/* <Image
              source={userData.profile_image ? { uri: userData.profile_image } : imageIndex.prfile}
              style={styles.avatar}
            /> */}
            <Image
  source={
    userData?.profile_image
      ? { uri: `${BASE_URLIMAGE}/${userData.profile_image}` }
      : imageIndex.prfile
  }
  style={{ width: 100, height: 100, borderRadius: 50 }}
/>
          </View>
          <Text style={styles.userName}>{userData?.full_name || 'User Name'}</Text>
          <Text style={styles.userEmail}>{userData?.email || 'N/A'}</Text>

          <TouchableOpacity
            style={styles.headerEditBtn}
            onPress={() => navigation.navigate(ScreenNameEnum.EditProfile)}
          >
            <Image source={imageIndex.pencle} style={styles.editBtnIcon} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Detailed Information</Text>

          <View style={styles.infoCard}>
            <InfoItem
              label="Full Name"
              value={userData?.full_name || 'N/A'}
              icon={imageIndex.profiel}
            />
            <InfoItem
              label="Email"
              value={userData?.email || 'N/A'}
              icon={imageIndex.mess}
            />
            <InfoItem
              label="Phone Number"
              value={userData?.phone_number ? `+${userData.country_code} ${userData.phone_number}` : 'N/A'}
              icon={imageIndex.ContactUs}
            />
            {/* <InfoItem
              label="Account ID"
              value={`#BB-${userData?.id || '000'}`}
              icon={imageIndex.MyAccount}
            />
            <InfoItem
              label="Verification"
              value={userData?.is_verified ? 'Verified Parent' : 'Pending Verification'}
              icon={imageIndex.Validation}
              isLast={true}
            /> */}
          </View>
        </View>

        {/* Security / Status */}


      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 10,
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: '#E03B65',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 20,
  },
  headerEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  editBtnIcon: {
    width: 14,
    height: 14,
    tintColor: '#E03B65',
    marginRight: 8,
  },
  editBtnText: {
    fontSize: 14,
    color: '#E03B65',
    fontWeight: '700',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 15,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemIcon: {
    width: 20,
    height: 20,
    tintColor: '#E03B65',
  },
  textContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E03B65',
  },
  backBtn: {
    borderRadius: 20,
    backgroundColor: '#1F2937',
  },
});

export default ParentInfoScreen;
