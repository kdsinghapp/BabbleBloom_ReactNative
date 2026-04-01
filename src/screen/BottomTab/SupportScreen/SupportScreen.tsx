import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomHeader from '../../../compoent/CustomHeader';
import CustomButton from '../../../compoent/CustomButton';
import imageIndex from '../../../assets/imageIndex';

const ContactItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.contactItem} onPress={onPress}>
    <View style={styles.left}>
      <Image source={icon} style={styles.icon} />
      <View>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSub}>{subtitle}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function SupportScreen() {
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      
 <StatusBarComponent />
      <CustomHeader label="Contact Us" />
      <ScrollView showsVerticalScrollIndicator={false} 
      style={{ paddingHorizontal: 20, marginTop: 10 }}
      >
        
        {/* Illustration */}
        <Image
          source={imageIndex.contact}
          style={styles.image}
          resizeMode="contain"
        />

       
        <View style={styles.card}>
          
        </View>

        {/* Message Box */}
        <View style={styles.card}>
          <Text style={styles.label}>How can we help?</Text>

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Write your message..."
            multiline
            style={styles.input}
          />

           
        </View>
      <View style={{ marginTop: 20 }}>
          <CustomButton title={"Continue"}  />
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
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },

  contactItem: {
    marginBottom: 15,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  contactSub: {
    fontSize: 12,
    color: '#888',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 15,
  },

  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8BC34A',
    padding: 12,
    borderRadius: 10,
  },

  sendIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginRight: 8,
  },

  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});