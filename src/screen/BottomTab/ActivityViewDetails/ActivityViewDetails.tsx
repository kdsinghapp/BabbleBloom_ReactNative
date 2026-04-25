import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
 
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';
import imageIndex from '../../../assets/imageIndex';
import { GetActivitiesApi } from '../../../Api/apiRequest';
import LoadingModal from '../../../utils/Loader';
import { useSelector } from 'react-redux';
 

const activities = [
  {
    id: '1',
    title: 'Bird Nest Rescue',
    description: 'Help the mama bird find her lost eggs using gentle movements.',
    age: '3–6 yrs',
    stage: 'Single 1–2',
    duration: '15–20 min play',
    image:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Rainbow Sorting',
    description: 'A colorful sensory game to practice naming and grouping.',
    age: '2–4 yrs',
    stage: 'Stage 1',
    duration: '15–20 min play',
    image:
      'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Moonlight Shadow',
    description: 'Explore light and dark while building descriptive vocabulary.',
    age: '4–6 yrs',
    stage: 'Stage 2',
    duration: '15–20 min play',
    image:
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Garden Whispers',
    description: 'Help the mama bird find her lost eggs using gentle movements.',
    age: '5+ yrs',
    stage: 'Stage 3+',
    duration: '15–20 min play',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
  },
];

const ActivityViewDetails = () => {
  const Navigator = useNavigation();
const [activities, setActivities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const selectedChild = useSelector((state: any) => state.children.selectedChild);
  useEffect(() => {
    // Simulate fetching reports based on activeTab
    // In real implementation, you would fetch from API here
    (async() => {
      setLoading(true);
     const data =  await GetActivitiesApi(selectedChild?.id || 4, setLoading);
      console.log("Activities fetched", data);
      setActivities(data);
      setLoading(false);
    })();
  }, [selectedChild]);
  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop' }} style={styles.cardImage} />

        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.short_description}
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.pinkBadge]}>
              {/* <Ionicons name="time-outline" size={12} color="#EF476F" /> */}
              <Text style={[styles.badgeText, { color: '#EF476F' }]}>
               {item.age_min} - {item.age_max} yrs
              </Text>
            </View>

            <View style={[styles.badge, styles.greenBadge]}>
              {/* <Ionicons name="leaf-outline" size={12} color="#2DBE60" /> */}
              <Text style={[styles.badgeText, { color: '#2DBE60' }]}>
                {item.stage_relevance}
              </Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.duration}>{item.duration}</Text>

            <TouchableOpacity 
            
            onPress={()=> Navigator.navigate(ScreenNameEnum.MoreViewDetails, {
              activity_id: item.id,
              child_id: selectedChild?.id
            })}
            style={styles.startBtn} activeOpacity={0.8}>
               <Text style={styles.startText}>start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <LoadingModal visible = {loading}/>
           <StatusBarComponent />
      <CustomHeader label="Activity View Details" />
      <View style={[styles.container,{
        marginTop:20
      }]}>
 
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Image source={imageIndex.search1} 
            
            style={{width:22,height:22}}
            />
              <TextInput
                placeholder="Search activities or skills..."
                placeholderTextColor="#7C8797"
                style={styles.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
          </View>

          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterIcon}>⌘</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={activities.filter((item: any) => 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery ? (
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Text style={{ color: '#9A9A9A', fontSize: 16 }}>No activities found for "{searchQuery}"</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ActivityViewDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
 marginHorizontal:15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 4,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D8F08A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2430',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  searchBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EAF0F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1F2430',
    marginLeft: 8,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EF476F',
    alignItems: 'center',
    justifyContent: 'center',
  },
      filterIcon: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
    },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    marginBottom: 14,
   // iOS Shadow
        shadowColor:  Platform.OS === 'android' ?'#BCDBFF' :"black",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 6,

  // Android Shadow
  elevation: 10,
  marginHorizontal:5
  },
  cardImage: {
    width: 100,
    height: 140,
    borderRadius: 16,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151515',
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    color: '#9A9A9A',
    marginTop: 4,
    marginBottom: 8,
    paddingRight: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  pinkBadge: {
    backgroundColor: '#FFE8EE',
    marginBottom:10
  },
  greenBadge: {
    backgroundColor: '#E6F8EC',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duration: {
    fontSize: 11,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  startBtn: {
    height: 32,
    borderRadius: 18,
    backgroundColor: '#EF476F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  startText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'lowercase',
  },
});