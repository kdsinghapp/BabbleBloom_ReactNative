import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import ScreenNameEnum from '../routes/screenName.enum';

export type RegistrationStackParamList = {
  [ScreenNameEnum.SPLASH_SCREEN]: undefined;
  [ScreenNameEnum.OnboardingScreen]: undefined;
  [ScreenNameEnum.ChooseRole]: undefined;
  [ScreenNameEnum.Sinup]: undefined;
  [ScreenNameEnum.TabNavigator]: undefined;
  [ScreenNameEnum.DeliveryTabNavigator]: undefined;
  [ScreenNameEnum.OtpScreen]: undefined;
  [ScreenNameEnum.PasswordReset]: undefined;
  [ScreenNameEnum.DrawerNavgation]: undefined;
  [ScreenNameEnum.setting]: undefined;
  [ScreenNameEnum.language]: undefined;
  [ScreenNameEnum.personalInfo]: undefined;
  [ScreenNameEnum.changePassword]: undefined;
  [ScreenNameEnum.HomeDashboard]: undefined;
  [ScreenNameEnum.MyProfile]: undefined;
  [ScreenNameEnum.ProfileSetting]: undefined;
  [ScreenNameEnum.FAQs]: undefined;
  [ScreenNameEnum.SupportScreen]: undefined;
  [ScreenNameEnum.ChildrenList]: undefined;
  [ScreenNameEnum.LibraryScreen]: undefined;
  [ScreenNameEnum.MoreViewDetails]: undefined;
  [ScreenNameEnum.ScriptDetailsScreen]: undefined;
  [ScreenNameEnum.ActivityPlayerScreen]: { scripts: any[], activityTitle: string };
  [ScreenNameEnum.ActivityViewDetails]: undefined;
  [ScreenNameEnum.Activity]: undefined;
  [ScreenNameEnum.EditProfile]: undefined;
  [ScreenNameEnum.ProgressScreen]: undefined;
  [ScreenNameEnum.PhoneLogin]: undefined;
  [ScreenNameEnum.Help]: undefined;
  [ScreenNameEnum.PrivacyPolicy]: undefined;
  [ScreenNameEnum.LegalPoliciesScreen]: undefined;
  [ScreenNameEnum.NotificationsScreen]: undefined;
  [ScreenNameEnum.NotificationsSetting]: undefined;
  [ScreenNameEnum.AddNewScript]: undefined;
  [ScreenNameEnum.ParentInfo]: undefined;
  DrawerNavDriver: undefined;
  DrawerNav: undefined;
};

type RegistrationRouteType = {
  name: keyof RegistrationStackParamList;
  Component: React.ComponentType<any>;
};

const Stack = createNativeStackNavigator<RegistrationStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  animation: 'slide_from_right',
};

const RegistrationRoutes: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={screenOptions}>
        {_routes.REGISTRATION_ROUTE.map((screen: RegistrationRouteType) => (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.Component}
            options={{
              animation: screen.name === ScreenNameEnum.SuccessScreen ? 'fade' : 'slide_from_right',
            }}
          />
        ))}
      </Stack.Navigator>

    </View>
  );
};

export default RegistrationRoutes;
