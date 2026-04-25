import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import imageIndex from '../../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import { GetFAQsApi } from '../../../Api/apiRequest';
import LoadingModal from '../../../utils/Loader';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const FAQItem = ({ question, answer }: any) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(prev => !prev);
  };

  return (
    <View style={[styles.faqItem, open && styles.faqItemOpen]}>
      <TouchableOpacity onPress={toggle} style={styles.faqHeader} activeOpacity={0.7}>
        <Text style={styles.question}>{question}</Text>
        <Image
          source={imageIndex.dounArroww}
          style={[styles.arrow, open && { transform: [{ rotate: '180deg' }] }]}
        />
      </TouchableOpacity>
      {open && <Text style={styles.answer}>{answer}</Text>}
    </View>
  );
};
export default function FAQs() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFaqs = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    const data = await GetFAQsApi(setLoading);
    if (data) {
      setFaqs(data);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const onRefresh = React.useCallback(async () => {
    await fetchFaqs(true);
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />
      <CustomHeader label="FAQ" />
      {/* Header */}
      <LoadingModal visible={loading} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} colors={['#8BC34A']} />
        }
      >

        {/* Illustration */}
        <Image
          source={imageIndex.faq}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[styles.title, {
          marginBottom: 15
        }]}>FAQ</Text>
        {/* Title */}
        <Text style={styles.subtitle}>
          Most common question about our services
        </Text>

        {/* FAQ List */}
        <View style={styles.card}>
          {faqs.length > 0 ? (
            faqs.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question || item.title}
                answer={item.answer || item.description}
              />
            ))
          ) : !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.noData}>No FAQs found at the moment.</Text>
            </View>
          ) : null}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backBtn: {
    backgroundColor: '#8BC34A',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  backIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  image: {
    width: 155,
    height: 155,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 11
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },

  faqItem: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  faqItemOpen: {
    borderColor: '#8BC34A',
    backgroundColor: '#fff',
    shadowColor: '#8BC34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  question: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    color: '#333',
  },

  answer: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },

  arrow: {
    width: 20,
    height: 20,
    marginLeft: 10,
    tintColor: '#8BC34A',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noData: {
    textAlign: 'center',
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
});
