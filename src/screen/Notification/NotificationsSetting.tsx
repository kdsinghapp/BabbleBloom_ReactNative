import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../compoent/StatusBarCompoent';
import CustomHeader from '../../compoent/CustomHeader';
import { GetNotificationSettingsApi, UpdateNotificationSettingsApi } from '../../Api/apiRequest';

const SettingItem = ({ label, value, onToggle, disabled }: { label: string; value: boolean; onToggle: (val: boolean) => void; disabled?: boolean }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      disabled={disabled}
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const data = await GetNotificationSettingsApi();
    if (data) {
      setNotification(data.push_enabled);
      setSound(data.sound_enabled);
      setVibrate(data.vibration_enabled);
      setAppUpdates(data.app_updates_enabled);
    }
  };

  const handleToggle = async (type: 'push' | 'sound' | 'vibrate' | 'appUpdates', newValue: boolean) => {
    // Current values
    const currentValues = {
      push_enabled: type === 'push' ? newValue : notification,
      sound_enabled: type === 'sound' ? newValue : sound,
      vibration_enabled: type === 'vibrate' ? newValue : vibrate,
      app_updates_enabled: type === 'appUpdates' ? newValue : appUpdates,
    };

    const data = await UpdateNotificationSettingsApi(currentValues);
    if (data) {
      setNotification(data.push_enabled);
      setSound(data.sound_enabled);
      setVibrate(data.vibration_enabled);
      setAppUpdates(data.app_updates_enabled);
    } else {
      // If update fails, we might want to refresh from server to ensure sync
      fetchSettings();
    }
  };

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
          onToggle={(val) => handleToggle('push', val)}
        />
        <SettingItem
          label="Sound"
          value={sound}
          onToggle={(val) => handleToggle('sound', val)}
        />
        <SettingItem
          label="Vibrate"
          value={vibrate}
          onToggle={(val) => handleToggle('vibrate', val)}
        />
        <SettingItem
          label="Application updates"
          value={appUpdates}
          onToggle={(val) => handleToggle('appUpdates', val)}
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
