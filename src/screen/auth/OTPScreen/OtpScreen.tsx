import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import {
  CodeField,
  Cursor,
} from 'react-native-confirmation-code-field';
import CustomButton from '../../../compoent/CustomButton';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { useOtpVerification } from './useOTPVerification';
import { color } from '../../../constant';
import CustomHeader from '../../../compoent/CustomHeader';
import LoadingModal from '../../../utils/Loader';

export default function OtpScreen() {
  const {
    value,
    isLoading,
    errorMessage,
    ref,
    props,
    timer,
    getCellOnLayoutHandler,
    handleChangeText,
    handleVerifyOTP,
    handleResendOTP,
    data,
  } = useOtpVerification();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBarComponent />
      <CustomHeader label={'Back'} />
      <LoadingModal visible={isLoading} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card */}
          <View style={styles.card}>
            {/* Heading */}
            <Text style={styles.txtHeading}>Enter the verification code</Text>
            <Text style={styles.txtDes}>
              We sent you a 4-digit code to {data?.code} {data?.mob}
            </Text>

            {/* OTP Cells */}
            <View style={styles.otpFieldContainer}>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={handleChangeText}
                cellCount={4}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoFocus
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    key={index}
                    style={[
                      styles.cellWrapper,
                      isFocused && styles.cellWrapperFocused,
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    <Text style={styles.cellText}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  </View>
                )}
              />
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
            </View>
            <View style={{ marginTop: 20 , marginBottom:10 }}>
              <CustomButton title={"Continue"} onPress={handleVerifyOTP} />
            </View>
            {/* Submit Button */}


            {/* Timer / Resend row */}
            <View style={styles.resendRow}>
              {timer > 0 ? (
                <Text style={styles.txtDes}>
                  Didn't receive the code?{' '}
                  <Text style={styles.timerText}>
                    ({String(Math.floor(timer / 60)).padStart(2, '0')}:
                    {String(timer % 60).padStart(2, '0')})
                  </Text>
                </Text>
              ) : (
                <Text style={styles.txtDes}>Didn't receive the code?</Text>
              )}
            </View>
          </View>

          {/* Resend OTP link — outside card */}
          {timer === 0 && (
            <TouchableOpacity 
            // onPress={handleResendOTP}
             style={styles.resendLink}>
              <Text style={styles.resendLinkText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}