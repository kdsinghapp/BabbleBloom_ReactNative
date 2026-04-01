import React from 'react';
import {
   View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import CustomHeader from '../../../compoent/CustomHeader';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { SafeAreaView } from 'react-native-safe-area-context';
import imageIndex from '../../../assets/imageIndex';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';

const scriptData = [
  '“Oh no! The bird fell down!”',
  '“Let’s help the bird get home.”',
  '“I want to help the birdie.”',
  '“You rescued the bird! Good job.”',
];

const MoreViewDetails = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
            <StatusBarComponent />
      <CustomHeader label="Activity Detail" />
      

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=800&auto=format&fit=crop',
              }}
              style={styles.mainImage}
            />
          </View>

          {/* Tag */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Bird Nest Rescue</Text>
          </View>
            <Text style={[styles.cardTitle,{
              marginTop:40
            }]}>✍️ What you’ll practice</Text>

          {/* Practice Card */}
          <View style={styles.card}>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.cardText}>
                Joint Attention: Following your child’s lead as they focus on the
                “rescue”.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.cardText}>
                Fine Motor: Gently picking up and placing the “bird”.
              </Text>
            </View>

            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.cardText}>
                Narrative Play: Building a simple story sequence together.
              </Text>
            </View>
          </View>

          {/* Scripts */}
          <View style={[styles.scriptHeaderRow,{
            flexDirection:"row" ,
            alignItems:"center"
          }]}>
            <Image source={imageIndex.Validation} 
            
            style={{width:22,height:22,marginRight:2}}
            />
            <View style={{
              flexDirection:"column",
              marginLeft:5
            }}>
            <Text style={styles.scriptTitle}>Scripts to Model</Text>
            <Text style={[styles.subText,{
            color:"#ADA4A5",
            marginLeft:1
          }]}>
            Tap the play icon to hear how to say these phrases naturally.
          </Text>
          </View>
          </View>

          

          {scriptData.map((item, index) => (
            <View key={index} style={styles.scriptItem}>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>

              <Text style={styles.scriptItemText}>{item}</Text>

              <TouchableOpacity style={styles.starButton}>
                <Text style={styles.starIcon}>☆</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Button */}
        <TouchableOpacity style={styles.bottomButton} 
        onPress={()=>navigation.navigate(ScreenNameEnum.BirdNestRescueScreen)}
        >
          <Text style={styles.bottomButtonText}>▷ Start Activity</Text>
        </TouchableOpacity>
 
    </SafeAreaView>
  );
};

export default MoreViewDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    margin: 12,
    backgroundColor: '#F6F6F6',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#8BC34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    
  },
  scrollContent: {
    paddingBottom: 20,
    marginHorizontal:15
  },
  imageWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  mainImage: {
    width: 145,
    height: 145,
    borderRadius: 72.5,
  },
  badge: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E03B65',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  position:"absolute",
  top:120
  },
  badgeText: {
    fontSize: 12,
    color: '#222',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  elevation: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 13,
    color: '#444',
    marginRight: 6,
    lineHeight: 18,
  },
  cardText: {
    flex: 1,
    fontSize: 12,
    color: 'black',
    lineHeight: 18,
  },
  scriptHeaderRow: {
    marginTop: 18,
    marginBottom: 4,
  },
  scriptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  subText: {
    fontSize: 11,
    color: '#A0A0A0',
    marginBottom: 12,
  },
  scriptItem: {
    backgroundColor: '#fff',
  borderRadius: 14,
  paddingHorizontal: 10,
  paddingVertical: 12,
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,

  // iOS Shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 6,

  // Android Shadow
  elevation: 8,

  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  playIcon: {
    color: '#6AA7FF',
    fontSize: 11,
    marginLeft: 2,
  },
  scriptItemText: {
    flex: 1,
    fontSize: 12,
    color: '#222',
    fontWeight: '500',
  },
  starButton: {
    marginLeft: 10,
  },
  starIcon: {
    fontSize: 18,
    color: '#F27A8A',
  },
  bottomButton: {
    backgroundColor: '#E03B65',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginHorizontal:15
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});