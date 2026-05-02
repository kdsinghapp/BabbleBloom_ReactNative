import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RegistrationRoutes from './RegistrationRoutes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../redux/store';
import Toast from 'react-native-toast-message';
import toastConfig from '../utils/customToast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NotificationHandler from './../../NotificationHandler'
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
const AppNavigator: React.FC = () => {
  return (


    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView  >

          <NavigationContainer>
            {/* <NetworkStatusModal
                modalVisible={!isConnected}
                offlineText="No Internet! Please check your connection."
              /> */}
            <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
              <RegistrationRoutes />
              <Toast config={toastConfig} />
              <NotificationHandler />
            </SafeAreaView>

          </NavigationContainer>
        </GestureHandlerRootView>

      </PersistGate>
    </Provider>
  );
};

export default AppNavigator;
