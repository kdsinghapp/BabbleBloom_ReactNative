import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import CustomHeader from '../../compoent/CustomHeader';

const SettingItem = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: (val: boolean) => void }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#D1D1D1', true: '#A1D14A' }}
      thumbColor={'#FFFFFF'}
    />
  </View>
);

export default function NotificationsSetting() {
  const [notification, setNotification] = useState(true);
  const [sound, setSound] = useState(false);
  const [vibrate, setVibrate] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />

      <CustomHeader
        label={"Notification"}
      />
      <View style={styles.content}>
        <SettingItem
          label="Notification"
          value={notification}
          onToggle={setNotification}
        />
        <SettingItem
          label="Sound"
          value={sound}
          onToggle={setSound}
        />
        <SettingItem
          label="Vibrate"
          value={vibrate}
          onToggle={setVibrate}
        />
        <SettingItem
          label="Application updates"
          value={appUpdates}
          onToggle={setAppUpdates}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A1D14A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E3E5C',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  label: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
});
