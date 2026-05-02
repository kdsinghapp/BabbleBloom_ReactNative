import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../compoent/CustomHeader';
import { GetNotificationsApi, MarkNotificationReadApi } from '../../Api/apiRequest';
import moment from 'moment';
import LoadingModal from '../../utils/Loader';

const NotificationItem = ({ item, onPress }: { item: any; onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.itemContainer,
        !item.is_read && styles.unreadBackground
      ]}
    >
      <View style={styles.dot} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message || item.content}</Text>
        <Text style={styles.date}>{moment.utc(item.created_at).local().format('MMM D, YYYY [at] hh:mm A')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificationsScreen = () => {
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async (showLoading = true) => {
    const data = await GetNotificationsApi(showLoading ? setIsLoading : () => { });
    if (data) {
      setNotificationsData(groupNotifications(data));
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const groupNotifications = (data: any[]) => {
    if (!data || !Array.isArray(data)) return [];

    const today: any[] = [];
    const thisWeek: any[] = [];
    const earlier: any[] = [];

    const now = moment();
    data.forEach(item => {
      const date = moment(item.created_at);
      if (now.isSame(date, 'day')) {
        today.push(item);
      } else if (now.diff(date, 'days') < 7) {
        thisWeek.push(item);
      } else {
        earlier.push(item);
      }
    });

    const sections = [];
    if (today.length > 0) sections.push({ title: 'Today', data: today });
    if (thisWeek.length > 0) sections.push({ title: 'This week', data: thisWeek });
    if (earlier.length > 0) sections.push({ title: 'Earlier', data: earlier });
    return sections;
  };

  const handleMarkAsRead = async (id: number) => {
    await MarkNotificationReadApi(id, setIsLoading);
    fetchNotifications(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal visible={isLoading} />
      <CustomHeader
        label={"Notification"}
      />
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 10 }}>
        {notificationsData.length > 0 ? (
          <SectionList
            sections={notificationsData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <NotificationItem
                item={item}
                onPress={() => {
                  if (!item.is_read) {
                    handleMarkAsRead(item.id);
                  }
                }}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={false}
            onRefresh={() => fetchNotifications(false)}
          />
        ) : (
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notifications found</Text>
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#555',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  unreadBackground: {
    backgroundColor: '#F0F8F5',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6FCF97',
    marginTop: 6,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default NotificationsScreen;


