import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ListRenderItem,
  StatusBar,
} from 'react-native';

import imageIndex from '../../../assets/imageIndex';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { styles } from './style';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description?: string;
  img: any;
}

const slides: Slide[] = [
  {
    id: '1',
    title: "Track your child’s communication",
    description: 'Monitor communication patterns in a simple and clear way.',
    img: imageIndex.sp1,
  },
  {
    id: '2',
    title: 'Understand scripts\n& meaning',
    description: 'Learn the meaning behind every response with ease.',
    img: imageIndex.sp2,
  },
  {
    id: '3',
    title: 'Get simple responses',
    description: 'Receive simple and helpful responses for daily support.',
    img: imageIndex.sp3,
  },
];

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleNextPress = () => {
    if (currentIndex < slides.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      navigation.navigate(ScreenNameEnum.PhoneLogin);
    }
  };

  const renderSlide: ListRenderItem<Slide> = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.cardContainer}>

          {/* FULL IMAGE */}
          <View style={styles.imageContainer}>
            <Image source={item.img} style={styles.image} />
          </View>

          {/* BOTTOM CARD */}
          <View style={styles.bottomWhiteCard}>
            <View style={styles.miniIndicatorRow}>
              <View style={styles.miniIndicatorLine} />
              <View style={styles.miniIndicatorDot} />
            </View>

            <Text style={styles.title}>{item.title}</Text>

            <TouchableOpacity onPress={handleNextPress}>
              <Image
                source={imageIndex.buttonNext}
                style={{ height: 70, width: 70 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={renderSlide}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

export default OnboardingScreen;