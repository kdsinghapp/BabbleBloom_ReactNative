import React, { memo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import font from '../theme/font';

const LogoutModal = ({ visible, onLogout, onCancel }: any) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.bottomContainer}>
          
          {/* Drag Indicator */}
          <View style={styles.dragLine} />

          <Text style={styles.title}>Log Out</Text>
          <Text style={styles.message}>
            Are you sure you want to log out?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // 👈 important (bottom pe laane ke liye)
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  bottomContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },

  dragLine: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
 
    marginBottom: 10,
  },

  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight:"500"
  },

  buttonContainer: {
    flexDirection: 'row',
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#EDEDED',
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 25,
    alignItems: 'center',
  },

  cancelText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },

  logoutButton: {
    flex: 1,
    backgroundColor: '#E03B65',
    paddingVertical: 15,
    marginLeft: 10,
    borderRadius: 25,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 15,
        fontWeight:"500"

  },
});

export default memo(LogoutModal);