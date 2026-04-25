import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { color } from '../../../constant';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { styles } from './style';
import { useDispatch } from 'react-redux';
import { restoreLogin } from '../../../redux/feature/authSlice';
import { getAuthData } from '../../../Api/apiRequest';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegistrationStackParamList } from '../../../navigators/RegistrationRoutes';

const Splash: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RegistrationStackParamList>>();
  const dispatch = useDispatch();

  // Animation reference
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Timer for navigation
    const timer = setTimeout(async () => {
      try {
        const storedAuth = await getAuthData();

        if (storedAuth?.token) {
          dispatch(restoreLogin(storedAuth));
          console.log('[Splash] User session restored, navigating to Home');
          navigation.replace(ScreenNameEnum.HomeDashboard);
        } else {
          console.log('[Splash] No session found, navigating to Onboarding');
          navigation.replace(ScreenNameEnum.OnboardingScreen);
        }
      } catch (error) {
        console.error('Splash check failed:', error);
        navigation.replace(ScreenNameEnum.OnboardingScreen);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, dispatch]);

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBarComponent backgroundColor={color.white} />

      {/* Center content */}
      <View style={styles.centerContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <FastImage
            style={styles.logo}
            source={imageIndex.appLogo1}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Animated.View>
      </View>


    </SafeAreaView>
  );
};

export default Splash;
