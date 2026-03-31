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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import imageIndex from '../../../assets/imageIndex';
import { color } from '../../../constant';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../compoent/CustomHeader';
import LoadingModal from '../../../utils/Loader';
import CustomButton from '../../../compoent/CustomButton';

type RootStackParamList = {
  Home: undefined;
};

const SignUp: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <CustomHeader label={'Back'} />
        <LoadingModal visible={false} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}


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
                  placeholderTextColor="#B0C4C0"
                  value={firstName}
                  onChangeText={setFirstName}
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
                  placeholderTextColor="#B0C4C0"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
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
                placeholderTextColor="#ADA4A5"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <View style={styles.inputWrapper}>
              <Image source={imageIndex.Phone1}
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
                placeholder="Phone Number"
                placeholderTextColor="#ADA4A5"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreed(!agreed)}
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

            {/* Sign Up Button */}

            <View style={{ marginTop: 20 }}>
              <CustomButton title={"Sign Up"} 
              
               onPress={() => navigation.navigate(ScreenNameEnum.MyProfile as never)}
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
    </SafeAreaView>
  );
};

const PRIMARY_PINK = '#E8447A';
const PRIMARY_GREEN = '#4A90E2';
const INPUT_BG = '#F4F6F5';
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

  /* Back */
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backArrow: {
    fontSize: 26,
    color: '#ffffff',
    lineHeight: 30,
    marginTop: -2,
  },
  backText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },

  /* Logo */
  logoContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 120,
  },

  /* Title */
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

  /* Form */
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
    borderColor: '#E8EEEC',
    height: 60
  },
  inputIcon: {
    fontSize: 15,
    marginRight: 8,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    paddingVertical: 0,
  },

  /* Terms */
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

  /* Sign Up Button */
  signUpButton: {
    backgroundColor: PRIMARY_PINK,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: PRIMARY_PINK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* Sign In */
  signInText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#8A9BA8',
    marginTop: 6,
  },
  signInLink: {
    color: PRIMARY_GREEN,
    fontWeight: '700',
  },
});

export default SignUp;