import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';
import Constcounty from '../PhoneLogin/Constcounty';

import imageIndex from '../../../assets/imageIndex';
import { color } from '../../../constant';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../compoent/CustomHeader';
import LoadingModal from '../../../utils/Loader';
import CustomButton from '../../../compoent/CustomButton';
import { LogiApi, SignUpApi } from '../../../Api/apiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
};

const SignUp: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [callingCode, setCallingCode] = useState("+91");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(Constcounty);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error States
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  React.useEffect(() => {
    if (searchText === "") {
      setFilteredCountries(Constcounty);
    } else {
      const filtered = Constcounty?.filter((c) =>
        c?.country?.toLowerCase().includes(searchText?.toLowerCase()) ||
        c?.dial_code?.includes(searchText)
      );
      setFilteredCountries(filtered);
    }
  }, [searchText]);

  const handleSelectCountry = (country: any) => {
    setCallingCode(country.dial_code);
    setModalVisible(false);
    setSearchText("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <CustomHeader label={'Back'} />
        <LoadingModal visible={loading} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <FastImage
              style={styles.logo}
              source={imageIndex.appLogo}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Let's get started by creating your account</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* First Name & Last Name Row */}
            <View style={styles.row}>
              <View style={[styles.inputWrapper, styles.halfInput]}>
                <Image source={imageIndex.userLogo}
                  style={{
                    width: 22,
                    height: 22,
                    marginRight: 8,
                    opacity: 0.6,
                    tintColor: "#50C878"
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="black"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (firstNameError) setFirstNameError("");
                  }}
                  autoCapitalize="words"
                />
              </View>
              <View style={[styles.inputWrapper, styles.halfInput]}>
                <Image source={imageIndex.userLogo}
                  style={{
                    width: 22,
                    height: 22,
                    marginRight: 8,
                    opacity: 0.6,
                    tintColor: "#50C878"
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="black"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (lastNameError) setLastNameError("");
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>
            <View style={styles.errorRow}>
              <View style={styles.halfError}>
                {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
              </View>
              <View style={styles.halfError}>
                {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Image source={imageIndex.mess}
                style={{
                  width: 22,
                  height: 22,
                  marginRight: 8,
                  opacity: 0.6,
                  tintColor: "#50C878"
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="black"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Phone */}
            <View style={styles.inputWrapper}>
              <TouchableOpacity 
                onPress={() => setModalVisible(true)} 
                style={styles.countryPickerTrigger}
              >
                <Text style={styles.callingCodeText}>{callingCode}</Text>
                <Image 
                  source={imageIndex.dounArroww}
                  style={styles.dropdownIcon}
                />
                <View style={styles.verticalSeparator} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="black"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (phoneError) setPhoneError("");
                }}
                keyboardType="phone-pad"
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => {
                setAgreed(!agreed);
                if (termsError) setTermsError("");
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the Barber{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{'\n'}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}

            {/* Sign Up Button */}
            <View style={{ marginTop: 20 }}>
              <CustomButton title={"Sign Up"}
                onPress={async () => {
                  let hasError = false;
                  if (!firstName.trim()) {
                    setFirstNameError("First name required");
                    hasError = true;
                  }
                  if (!lastName.trim()) {
                    setLastNameError("Last name required");
                    hasError = true;
                  }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!email.trim() || !emailRegex.test(email)) {
                    setEmailError("Invalid email address");
                    hasError = true;
                  }
                  if (!phone.trim() || phone.length < 6 || phone.length > 15) {
                    setPhoneError("Valid phone (6-15 digits) required");
                    hasError = true;
                  }

                  if (!agreed) {
                    setTermsError("You must agree to continue");
                    hasError = true;
                  }

                  if (hasError) return;

                  try {
                    await SignUpApi(
                      {
                        full_name: `${firstName.trim()} ${lastName.trim()}`,
                        email: email.trim(),
                        country_code: callingCode.replace('+', ''),
                        phone_number: phone.trim(),
                        navigation,
                      },
                      setLoading,
                    );
                  } catch (err) {
                    console.log("Signup error:", err);
                  }
                }}
              />
            </View>

            {/* Sign In Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNameEnum.PhoneLogin as never)}
              activeOpacity={0.7}
            >
              <Text style={styles.signInText}>
                Already have an account?{' '}
                <Text style={styles.signInLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Selection Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Search country or code"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              placeholderTextColor={"#999"}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectCountry(item)}
                >
                  <Text style={styles.countryItemText}>
                    {item.flag} {item.country} ({item.dial_code})
                  </Text>
                </TouchableOpacity>
              )}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const PRIMARY_PINK = '#E8447A';
const PRIMARY_GREEN = '#A1D14A';
const BORDER_RADIUS = 14;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A9BA8',
    textAlign: 'center',
    marginBottom: 28,
  },
  form: {
    width: '100%',
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F7F8F8",
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 14,
    height: 60,
    borderWidth: 1,
    borderColor: '#E8EEEC',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    paddingVertical: 0,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C0D0CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 13,
    color: '#5A6A65',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: PRIMARY_GREEN,
    fontWeight: '700',
  },
  signInText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#8A9BA8',
    marginTop: 10,
  },
  signInLink: {
    color: PRIMARY_GREEN,
    fontWeight: '700',
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginLeft: 4,
    marginBottom: 4,
  },
  errorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: -8,
  },
  halfError: {
    flex: 1,
    paddingLeft: 4,
  },
  // Modal & Picker Styles
  countryPickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  callingCodeText: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '600',
  },
  dropdownIcon: {
    width: 14,
    height: 14,
    marginLeft: 6,
    tintColor: '#8A9BA8',
  },
  verticalSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#E8EEEC',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "70%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: "#1A1A2E",
  },
  modalCancel: {
    fontSize: 15,
    color: PRIMARY_PINK,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#F7F8F8',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1A1A2E",
    borderWidth: 1,
    borderColor: '#E8EEEC',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F8F8",
  },
  countryItemText: {
    fontSize: 16,
    color: "#1A1A2E",
    fontWeight: '500',
  },
});

export default SignUp;