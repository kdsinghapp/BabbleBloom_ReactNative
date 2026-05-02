import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { useDispatch } from 'react-redux';
import { VerifySignupOtpApi, VerifyLoginOtpApi, SendSignupOtpApi, LoginApi } from '../../../Api/apiRequest';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOtpVerification = (cellCount: number = 4) => {
  const navigation = useNavigation();
  const route: any = useRoute();

  // Supports both new signup OTP params (country_code / phone_number)
  // and old legacy params (code / phone) for backward compatibility
  const {
    country_code,
    phone_number,
    otp_code,
    flowType, // 'signup' or 'login'
    // legacy fallbacks
    code: legacyCode,
    phone: legacyPhone,
  } = route.params || {};

  const resolvedCountryCode = country_code || legacyCode || '+91';
  const resolvedPhoneNumber = phone_number || legacyPhone || '';

  const [value, setValue] = useState('');
  // const [value, setValue] = useState(otp_code || '');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(30); // Start with 30 s countdown

  // Timer countdown logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Data for display in OTP screen
  const data = {
    mob: resolvedPhoneNumber,
    code: resolvedCountryCode,
  };

  const [errorMessage, setErrorMessage] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  const handleChangeText = (text: string) => {
    setValue(text);
    setErrorMessage(text.length < cellCount ? 'Please enter 4 digit otp' : '');
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    try {
      if (flowType === 'login') {
        await LoginApi(
          {
            country_code: resolvedCountryCode,
            phone_number: resolvedPhoneNumber,
            navigation,
          },
          setIsLoading,
        );
      } else {
        await SendSignupOtpApi(
          {
            country_code: resolvedCountryCode,
            phone_number: resolvedPhoneNumber,
            navigation,
          },
          setIsLoading,
        );
      }
      setTimer(30);
    } catch (error) {
      console.error('OTP resend error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (value.length !== cellCount) {
      setErrorMessage('Please enter 4 digit otp');
      return;
    }

    setIsLoading(true);
    try {
      const fcmToken = await AsyncStorage.getItem('fcmToken') || "";
      const deviceName = Platform.OS === 'android' ? 'android' : 'ios';

      if (flowType === 'login') {
        await VerifyLoginOtpApi(
          {
            country_code: resolvedCountryCode,
            phone_number: resolvedPhoneNumber,
            code: value,
            navigation,
            fcm_token: fcmToken,
            device_name: deviceName,
          },
          setIsLoading,
          dispatch,
        );
      } else {
        await VerifySignupOtpApi(
          {
            country_code: resolvedCountryCode,
            phone_number: resolvedPhoneNumber,
            code: value,
            navigation,
            fcm_token: fcmToken,
            device_name: deviceName,
          },
          setIsLoading,
          dispatch,
        );
      }
    } catch (error) {
      console.error('OTP verify error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return {
    value,
    setValue,
    isLoading,
    errorMessage,
    ref,
    props,
    getCellOnLayoutHandler,
    handleChangeText,
    handleVerifyOTP,
    navigation,
    handleResendOTP,
    data,
    timer,
  };
};
