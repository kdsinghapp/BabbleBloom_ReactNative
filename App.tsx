import React, { FunctionComponent } from 'react';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigators/AppNavigator';

LogBox.ignoreAllLogs();

const App: FunctionComponent = () => {
    return (
        <SafeAreaProvider>
            <AppNavigator />
        </SafeAreaProvider>
    );
};

export default App;

