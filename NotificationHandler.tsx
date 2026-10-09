import React, { useEffect } from 'react';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

const NotificationHandler: React.FC = () => {

  useEffect(() => {
    const initialize = async () => {
      await setupNotifications();
    };

    initialize();

    // 3. Listen for Notifee foreground events (e.g., clicks)
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('👆 Notification pressed in foreground', detail.notification);
        handleNotificationPress(detail.notification);
      }
    });

    return () => {
      unsubscribeNotifee();
    };
  }, []);

  const setupNotifications = async () => {
    // Request permissions
    await requestPermission();

    // Create Android Notification Channel
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'BableBloom.channel',
        name: 'BableBloom Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
      console.log('✅ Notifee channel initialized');
    }
  };

  const requestPermission = async () => {
    // Android 13+ Permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('⚠️ Notification permission denied on Android');
      }
    }
  };

  const handleNotificationPress = (notification: any) => {
    console.log('➡️ Navigation Logic Here:', notification);
  };

  return null;
};

export default NotificationHandler;