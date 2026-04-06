// PhoneLoginScreen.js
import React, { useState, useEffect } from "react";
import {
  View, Text, Image, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Modal, FlatList
} from "react-native";
import CustomButton from "../../../compoent/CustomButton";
import imageIndex from "../../../assets/imageIndex";
import font from "../../../theme/font";
import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Constcounty from "./Constcounty";
import { LogiApi, LoginApi } from "../../../Api/apiRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../../../utils/Loader";
import { color } from "../../../constant";
import ScreenNameEnum from "../../../routes/screenName.enum";
const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("787655445545");
  // 787655445545
  //  const [phoneNumber, setPhoneNumber] = useState("");  
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(Constcounty);
  const navigation = useNavigation();
  const [error, setError] = useState(""); // For error message

  useEffect(() => {
    if (searchText === "") {
      setFilteredCountries(Constcounty);
    } else {
      const filtered = Constcounty?.filter((c) =>
        c?.country?.toLowerCase().includes(searchText?.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchText]);

  const handleSelectCountry = (country: any) => {
    setCountryCode(country.code);
    setCallingCode(country.dial_code);
    setModalVisible(false);
    setSearchText(""); // reset search
    if (error) setError(""); // Clear error on interaction
  };

  const handleContinue = async () => {



    const trimmedNumber = phoneNumber.trim();

    // Local Validation for Inline Message
    if (!trimmedNumber) {
      setError("Please enter your phone number.");
      return;
    } else if (trimmedNumber.length < 6 || trimmedNumber.length > 15) {
      setError("Please enter a valid phone number (6-15 digits).");
      return;
    }

    setError(""); // Clear error if valid
    const userRole = await AsyncStorage.getItem('selectedRole') || 'User';

    let data = {
      code: `${callingCode}`,
      phone: trimmedNumber,
      navigation: navigation,
      type: userRole
    };

    try {
      // LogiApi handles Toasts for API responses (success/error)
      await LogiApi(data, setLoading);
    } catch (err) {
      console.log("API call error:", err);
      // Fallback if API handler fails to show toast
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBarComponent />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <LoadingModal visible={loading} />
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={imageIndex.phonLogoapp}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>We'll send you a code to verify it</Text>
        {/* Phone Input */}
        <Text style={{
          color: "#50C878",
          fontSize: 15,
          marginBottom: 15

        }}>Phone Number</Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.countryPicker}>
            <Text style={styles.callingCode}>{callingCode}</Text>
            <Image
              source={imageIndex.dounArroww}
              style={{ height: 22, width: 22, marginLeft: 5 }}
            />
            <View style={styles.separator} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (error) setError(""); // Real-time error clearing
            }}
            placeholderTextColor={"black"}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Continue Button */}
        <View style={{ marginTop: 20 }}>
          <CustomButton
            title={"Continue"}
            onPress={async () => {
              const trimmedNumber = phoneNumber.trim();
              if (!trimmedNumber) {
                setError("Please enter your phone number.");
                return;
              } else if (trimmedNumber.length < 6 || trimmedNumber.length > 15) {
                setError("Please enter a valid phone number (6-15 digits).");
                return;
              }
              setError("");
              await LoginApi(
                {
                  country_code: callingCode.replace('+', ''),
                  phone_number: trimmedNumber,
                  navigation: navigation,
                },
                setLoading,
              );
            }}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.emailText}>Don't have an account?

            <Text style={{
              color: color.protein,

            }}

              onPress={() => navigation.navigate(ScreenNameEnum.Sinup as never)}
            > Sign Up</Text>

          </Text>
        </TouchableOpacity>

        {/* Custom Country Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <TextInput
                placeholder="Search country"
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
                placeholderTextColor={"#999"}
              />

              {/* Country List */}
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 10 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectCountry(item)}
                  >
                    <Text style={styles.countryText}>
                      {item.flag} {item.country} ({item.dial_code})
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneLogin;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 12, paddingTop: 45 },
  logoContainer: { justifyContent: "center", alignItems: "center", marginBottom: 50 },
  logo: { height: 96, width: 167 },
  title: { marginBottom: 5, fontSize: 22, color: "black", fontWeight: '600' },
  subtitle: { fontSize: 14, color: "#9DB2BF", marginBottom: 30, marginTop: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1.2, borderColor: "#50C878", borderRadius: 40, paddingHorizontal: 10, marginBottom: 20 },
  countryPicker: { marginRight: 5, alignItems: "center", flexDirection: "row" },
  callingCode: { fontSize: 16, color: "black", fontWeight: '500' },
  separator: { borderWidth: 0.5, height: 22, borderColor: "#50C878", marginLeft: 5 },
  input: { fontWeight: '400', flex: 1, height: 50, fontSize: 16, marginLeft: 5, color: "black" },
  emailText: { color: "black", textAlign: "center", fontSize: 15, marginTop: 30, },

  /* Modal Styles */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", width: "85%", borderRadius: 15, maxHeight: "45%", padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontWeight: '500', fontSize: 18, color: "#000" },
  modalCancel: { fontWeight: '500', fontSize: 15, color: "#E03B65" },
  searchInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 15, fontSize: 14, color: "#000" },
  modalItem: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  countryText: { fontWeight: '500', fontSize: 16, color: "#000", fontFamily: font.MonolithRegular },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
    fontFamily: font.MonolithRegular
  },
});
