import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
  },

  cardContainer: {
    flex: 1,
  },

  imageContainer: {
    flex: 1,
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  bottomWhiteCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: '#FFFFFF',
    minHeight: 180,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  miniIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  miniIndicatorLine: {
    width: 14,
    height: 6,
    borderRadius: 20,
    backgroundColor: '#A7CF45',
    marginRight: 6,
  },

  miniIndicatorDot: {
    width: 8,
    height: 4,
    borderRadius: 10,
    backgroundColor: '#A7CF45',
  },

  title: {
    fontSize: 24,
    lineHeight: 30,
    color: '#111',
    fontWeight: '700',
    marginBottom: 20,
  },
});