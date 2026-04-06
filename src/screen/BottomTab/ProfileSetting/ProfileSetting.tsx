import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import ScreenNameEnum from '../../../routes/screenName.enum';
import LogoutModal from '../../../compoent/LogoutModal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RegistrationStackParamList } from '../../../navigators/RegistrationRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URLIMAGE, GetProfileMeApi, handleLogout } from '../../../Api/apiRequest';
import { loginSuccess } from '../../../redux/feature/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from '../../../constant';

const MenuItem = ({ icon, title, subtitle, onPress }: { icon: any; title: string; subtitle?: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Image source={icon} style={styles.icon} />
      <View>
        <Text style={styles.menuText}>{title}</Text>
        {subtitle && <Text style={styles.subText}>{subtitle}</Text>}
      </View>
    </View>
    <Image source={imageIndex.black} style={styles.arrow} />
  </TouchableOpacity>
);


export default function ProfileSetting() {
  const dispatch = useDispatch()
  const navigation = useNavigation<NativeStackNavigationProp<RegistrationStackParamList>>();
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const userData = useSelector((state: any) => state.auth.userData);

  const getProfileData = async () => {
    try {
      const response = await GetProfileMeApi(setLoading);
      if (response) {
        const token = await AsyncStorage.getItem("token") || "";
        dispatch(loginSuccess({ userData: response, token }));
      }
    } catch (error) {
      console.error("[ProfileSetting] Fetch error:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getProfileData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <CustomHeader label="Profile" />

      <ScrollView showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20, marginTop: 10 }}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={
              userData?.profile_image
                ? { uri: `${BASE_URLIMAGE}/${userData.profile_image}` }
                : imageIndex.prfile
            }
            style={styles.avatar}

          />


          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{userData?.full_name || 'User Name'}</Text>
            <Text style={styles.username}>{userData?.email || userData?.phone_number || ''}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(ScreenNameEnum.EditProfile)}>
            <Image source={imageIndex.pencle} style={styles.editIcon} />
          </TouchableOpacity>
        </View>

        {loading && !userData ? (
          <ActivityIndicator color={color.primary} size="large" style={{ marginVertical: 20 }} />
        ) : (
          <>

            {/* Menu */}
            <View style={styles.card}>
              <MenuItem
                icon={imageIndex.MyAccount}
                title="Parent info"
                onPress={() => navigation.navigate(ScreenNameEnum.ParentInfo)}
              />
              <MenuItem
                icon={imageIndex.MyAccount}
                title="Add Child"
                onPress={() => navigation.navigate(ScreenNameEnum.MyProfile)}
              />
              <MenuItem
                icon={imageIndex.MyAccount}
                title="Child info"
                onPress={() => navigation.navigate(ScreenNameEnum.ChildrenList)}
              />
              <MenuItem
                icon={imageIndex.nofication}
                title="Notification"
                onPress={() => navigation.navigate(ScreenNameEnum.NotificationsScreen)}
              />
              <MenuItem
                icon={imageIndex.ContactUs}
                title="Contact Us"
                onPress={() => navigation.navigate(ScreenNameEnum.SupportScreen)}
              />
            </View>

            <View style={styles.card}>
              <MenuItem
                icon={imageIndex.FAQs}
                title="FAQs"
                onPress={() => navigation.navigate(ScreenNameEnum.FAQs)}
              />
              <MenuItem
                icon={imageIndex.logout}
                title="Log out"
                subtitle="Further secure your account for safety"
                onPress={() => setVisible(true)}
              />
            </View>
          </>
        )}

        <LogoutModal visible={visible}
          onLogout={() => {
            handleLogout(dispatch, navigation, setVisible);
          }}
          onCancel={() => setVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#484C52',
    padding: 15,
    borderRadius: 40,
    marginBottom: 20,
    marginTop: 12
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 55,
    marginRight: 10,
  },
  name: {
    color: '#fff',
    fontWeight: '600',
  },
  username: {
    color: '#ccc',
    fontSize: 12,
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  arrow: {
    width: 16,
    height: 16,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  subText: {
    fontSize: 11,
    color: 'black',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
});