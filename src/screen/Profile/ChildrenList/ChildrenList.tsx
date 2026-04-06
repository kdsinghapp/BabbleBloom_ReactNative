import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { GetChildrenApi, DeleteChildApi, BASE_URLIMAGE } from '../../../Api/apiRequest';
import CustomHeader from '../../../compoent/CustomHeader';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import imageIndex from '../../../assets/imageIndex';
import LoadingModal from '../../../utils/Loader';

// ─── Age Calculation Helper ──────────────────────────────────────────────
const calculateDetailedAge = (dob: string) => {
  if (!dob) return "Age not set";
  const birthDate = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }
  if (years > 0) {
    return `${years} ${years === 1 ? 'Year' : 'Years'}${months > 0 ? `, ${months} ${months === 1 ? 'Month' : 'Months'}` : ''}`;
  }
  return `${months} ${months === 1 ? 'Month' : 'Months'}`;
};

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

  const handleDeleteChild = (id: number) => {
    Alert.alert(
      'Delete Child',
      'Are you sure you want to delete this child profile? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await DeleteChildApi(id, setIsLoading);
            if (success) {
              fetchChildrenData();
            }
          }
        },
      ]
    );
  };


  const renderChildItem = ({ item }: { item: any }) => {
    const isMale = item.gender === 'Male';
    return (
      <View style={styles.childCard}>
        <View style={styles.cardHeader}>
          <Image
            source={item.profile_image ? { uri: `${BASE_URLIMAGE}/${item.profile_image}` } : imageIndex.prfile}
            style={styles.childImage}
          />
          <View style={styles.childMainInfo}>
            <Text style={styles.childName} numberOfLines={1}>{item.full_name}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.childDetailText}>
                {calculateDetailedAge(item.date_of_birth)}
              </Text>
              {item.gender && (
                <>
                  <View style={styles.dotSeparator} />
                  <Text style={styles.childDetailText}>{item.gender}</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ScreenNameEnum.MyProfile, { childData: item })}
            >
              <Image source={imageIndex.Editpen} style={styles.editIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.7}
              onPress={() => handleDeleteChild(item.id)}
            >
              <Image source={imageIndex.delete} style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.detailRow}>
            {/* <Image source={imageIndex.Toys} style={styles.detailIcon} /> */}
            <Text style={styles.detailText} numberOfLines={1}>Interests: {item.interests || 'Not set'}</Text>
          </View>
          <View style={styles.detailRow}>
            {/* <Image source={imageIndex.speak} style={styles.detailIcon} /> */}
            <Text style={styles.detailText} numberOfLines={1}>Comm: {item.communication_level || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={[
            styles.statusBadge,

          ]}>
            <View style={[styles.statusDot, { backgroundColor: '#E03B65' }]} />
            <Text style={[
              styles.statusText,
              { color: '#E03B65' }
            ]}>
              {item.gender || 'Unknown'}
            </Text>
          </View>
          <Text style={styles.timeText}>
            Added {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
<CustomHeader label="My Child Profile" />   

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
        <Text style={styles.fabIcon}>+</Text>
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
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  shadowColor:  Platform.OS === 'android' ?'#BCDBFF' :"black",
 
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.06,
     shadowRadius: 4,
     elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  childImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  childMainInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childDetailText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  cardContent: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F9FAFB',
    paddingVertical: 12,
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 14,
    height: 14,
    marginRight: 8,
    tintColor: '#9CA3AF',
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#4B5563',
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#E03B65',
  },
  addFAB: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E03B65',
    justifyContent: 'center',
    alignItems: 'center',

  },
  fabIcon: {

    color: 'white',
    textAlign: "center",
    fontSize: 24 ,
    fontWeight:"600"
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ChildrenList;
