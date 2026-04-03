import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import _routes from '../routes/routes';
import ScreenNameEnum from '../routes/screenName.enum';
 import { DashboardProvider } from '../context/DashboardContext';
 
export type RegistrationStackParamList = {
  [ScreenNameEnum.SPLASH_SCREEN]: undefined;
  [ScreenNameEnum.OnboardingScreen]: undefined;
  [ScreenNameEnum.ChooseRole]: undefined;
  [ScreenNameEnum.ReadyScreen]: undefined;
  [ScreenNameEnum.LoginScreen]: undefined;
  [ScreenNameEnum.Sinup]: undefined;
  [ScreenNameEnum.TabNavigator]: undefined;
  [ScreenNameEnum.DeliveryTabNavigator]: undefined;
  [ScreenNameEnum.OtpScreen]: undefined;
  [ScreenNameEnum.CreatePassword]: undefined;
  [ScreenNameEnum.PasswordReset]: undefined;
  [ScreenNameEnum.DrawerNavgation]: undefined;
  [ScreenNameEnum.DashBoardScreen]: undefined;
  [ScreenNameEnum.DashBoardDetail]: undefined;
  [ScreenNameEnum.PatientScreen]: undefined;
  [ScreenNameEnum.NewTripScreen]: undefined;
  [ScreenNameEnum.AddPatient]: undefined;
  [ScreenNameEnum.AddContract]: undefined;
  [ScreenNameEnum.AddDriver]: undefined;
  [ScreenNameEnum.SuccessScreen]: undefined;
  [ScreenNameEnum.MapScreen]: undefined;
  [ScreenNameEnum.Billing]: undefined;
  [ScreenNameEnum.setting]: undefined;
  [ScreenNameEnum.language]: undefined;
  [ScreenNameEnum.personalInfo]: undefined;
  [ScreenNameEnum.changePassword]: undefined;
  [ScreenNameEnum.DriverHome]: undefined;
  [ScreenNameEnum.TripDetail]: undefined;
  [ScreenNameEnum.TripSuccess]: undefined;
  [ScreenNameEnum.TripMap]: undefined;
  [ScreenNameEnum.CaptureDoc]: undefined;
  [ScreenNameEnum.CaptureSuccess]: undefined;
  [ScreenNameEnum.Patient_Driver]: undefined;
  [ScreenNameEnum.RaceDetail]: undefined;
  [ScreenNameEnum.HomeDashboard]: undefined;
  [ScreenNameEnum.MyProfile]: undefined;
  [ScreenNameEnum.ProfileSetting]: undefined;
  [ScreenNameEnum.FAQs]: undefined;
  [ScreenNameEnum.SupportScreen]: undefined;
  [ScreenNameEnum.LibraryScreen]: undefined;
  [ScreenNameEnum.MoreViewDetails]: undefined;
  [ScreenNameEnum.ScriptDetailsScreen]: undefined;
  [ScreenNameEnum.BirdNestRescueScreen]: undefined;
  [ScreenNameEnum.ActivityViewDetails]: undefined;
  [ScreenNameEnum.Activity]: undefined;
  [ScreenNameEnum.EditProfile]: undefined;
  [ScreenNameEnum.ProgressScreen]: undefined;
  [ScreenNameEnum.PhoneLogin]: undefined;
  [ScreenNameEnum.Help]: undefined;
  [ScreenNameEnum.PrivacyPolicy]: undefined;
  [ScreenNameEnum.LegalPoliciesScreen]: undefined;
  [ScreenNameEnum.NotificationsScreen]: undefined;
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
       <DashboardProvider>
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
      </DashboardProvider>
   );
};

export default RegistrationRoutes;
