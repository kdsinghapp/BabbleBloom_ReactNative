import React, { useEffect } from 'react';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType, Notification } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationHandler: React.FC = () => {

  useEffect(() => {
    const initialize = async () => {
      await setupNotifications();
    };

    initialize();

    // 1. Listen for foreground FCM messages
    const unsubscribeFCM = messaging().onMessage(async (remoteMessage) => {
      console.log('📩 Foreground FCM Message:', remoteMessage);
      await displayLocalNotification(remoteMessage);
    });

    // 2. Listen for token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      console.log('🔄 Token Refreshed:', token);
      await AsyncStorage.setItem('fcmToken', token);
    });

    // 3. Listen for Notifee foreground events (e.g., clicks)
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('👆 Notification pressed in foreground', detail.notification);
        handleNotificationPress(detail.notification);
      }
    });

    // 4. Handle notification that opened the app from a quit state
    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        console.log('📲 App opened from quit state:', remoteMessage);
        handleNotificationPress(remoteMessage);
      }
    });

    // 5. Handle notification that opened the app from background state
    const unsubscribeOnOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('📲 App opened from background state:', remoteMessage);
      handleNotificationPress(remoteMessage);
    });

    return () => {
      unsubscribeFCM();
      unsubscribeTokenRefresh();
      unsubscribeNotifee();
      unsubscribeOnOpen();
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

    // iOS Specific Setup
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
      // Note: setForegroundNotificationPresentationOptions is removed in latest versions
      // of @react-native-firebase/messaging in favor of Notifee handling foreground presentation.
    }

    // Get and store initial FCM Token
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('📲 Initial FCM Token:', token);
        await AsyncStorage.setItem('fcmToken', token);
      }
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
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

    // FCM Permission (iOS/Android)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Notification permission granted:', authStatus);
    }
  };

  const displayLocalNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Notification',
      body: remoteMessage.notification?.body || 'You have a new message',
      data: remoteMessage.data, // Pass custom data
      android: {
        channelId: 'BableBloom.channel',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const handleNotificationPress = (notification: any) => {
    console.log('➡️ Navigation Logic Here:', notification);
  };

  return null;
};

export default NotificationHandler;