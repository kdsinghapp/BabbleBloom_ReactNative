import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { GetChildrenApi, BASE_URLIMAGE } from '../../../Api/apiRequest';
import CustomHeader from '../../../compoent/CustomHeader';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import LoadingModal from '../../../utils/Loader';

const ChildrenList = () => {
  const navigation = useNavigation<any>();
  const [children, setChildren] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChildrenData = async () => {
    const res = await GetChildrenApi(setIsLoading);
    if (res) {
      setChildren(res);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchChildrenData();
    }, [])
  );


  const renderChildItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.childCard}>
        <View style={styles.cardHeader}>
          <Image
            source={item.profile_image ? { uri: `${BASE_URLIMAGE}/${item.profile_image}` } : imageIndex.prfile}
            style={styles.childImage}
          />
          <View style={styles.childMainInfo}>
            <Text style={styles.childName}>{item.full_name}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.childDetailText}>
                {item.age ? `${item.age} years old` : 'Age not set'}
              </Text>
              {item.gender && (
                <>
                  <View style={styles.dotSeparator} />
                  <Text style={styles.childDetailText}>{item.gender}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.gender === 'Male' ? '#EBF5FF' : '#FFF1F2' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.gender === 'Male' ? '#2563EB' : '#E03B65' }
            ]}>
              {item.gender || 'Unknown'}
            </Text>
          </View>
          <Text style={styles.timeText}>
            Added {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <CustomHeader label="My Children" />
      <LoadingModal visible={isLoading} />

      <FlatList
        data={children}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChildItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No children added yet.</Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.addFAB}
        onPress={() => navigation.navigate(ScreenNameEnum.MyProfile)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  childCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E03B65',
  },
  childMainInfo: {
    flex: 1,
    marginLeft: 15,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  childDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  addFAB: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E03B65',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#E03B65',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});

export default ChildrenList;
