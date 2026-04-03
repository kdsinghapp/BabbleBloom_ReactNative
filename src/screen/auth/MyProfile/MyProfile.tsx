import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../../../compoent/CustomButton";
import ScreenNameEnum from "../../../routes/screenName.enum";
import { useNavigation } from "@react-navigation/native";
import imageIndex from "../../../assets/imageIndex";
import CustomHeader from "../../../compoent/CustomHeader";
import LoadingModal from "../../../utils/Loader";
import ImagePickerModal from "../../../compoent/ImagePickerModal";
import { openCamera, openGallery } from "../../../utils/cameraHelper";

const COLORS = {
  primary: "#A1D14A",       // green accent (profile border, back button)
  saveBtn: "#E8456A",       // pink-red save button
  labelBlue: "#4A90E2",     // "Child Name" label blue
  text: "#1A1A2E",
  subText: "#9E9E9E",
  border: "#E8EDF2",
  white: "#FFFFFF",
  bg: "#F7F9FC",
};

// ─── Age Calculation Helper ──────────────────────────────────────────────
const calculateAge = (birthDate: Date) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age === 1 ? "01 year old" : `${age.toString().padStart(2, '0')} years old`;
};

interface ProfileFieldProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  icon?: any;
  editable?: boolean;
  onPress?: () => void;
  placeholder?: any
}

// ─── Reusable field row ────────────────────────────────────────────────────
const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  onChangeText,
  icon,
  editable = true,
  onPress,
  placeholder
}) => (
  <TouchableOpacity
    activeOpacity={onPress ? 0.7 : 1}
    onPress={onPress}
    style={styles.fieldWrapper}
  >

    {label ? (
      <Text style={[styles.fieldLabel, label === "Child Name" && { color: COLORS.labelBlue }]}>
        {label}
      </Text>
    ) : null}
    <View style={styles.fieldBox}>
      {icon ? <Image source={icon}
        style={{
          width: 22,
          height: 22,
          marginRight: 8,
        }}
      /> : null}
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        editable={editable && !onPress}
        placeholderTextColor={"black"}
        placeholder={placeholder}
        pointerEvents={onPress ? "none" : "auto"}
      />
    </View>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────
const MyProfile = () => {
  const navigation = useNavigation();

  // States
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [interests, setInterests] = useState("");
  const [commLevel, setCommLevel] = useState("");

  // Error States
  const [childNameError, setChildNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [interestsError, setInterestsError] = useState("");
  const [commLevelError, setCommLevelError] = useState("");

  // Modal & Picker States
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/200?img=11");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(birthDate || new Date());

  // Handlers
  const handleImageResult = (result: any) => {
    if (result.asset) {
      setProfileImage(result.asset.uri);
    } else if (result.error) {
      console.log("Image Error:", result.error);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        setBirthDate(selectedDate);
        setAge(calculateAge(selectedDate));
        if (ageError) setAgeError("");
      }
    } else {
      // iOS: Just update temp date, don't close modal
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirmDate = () => {
    setBirthDate(tempDate);
    setAge(calculateAge(tempDate));
    if (ageError) setAgeError("");
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    setTempDate(birthDate || new Date());
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <CustomHeader label={'My Profile'} />
      <LoadingModal visible={false} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Avatar ── */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarRing}>
              <Image
                source={{ uri: profileImage }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              style={styles.editBadge}
              activeOpacity={0.8}
              onPress={() => setImageModalVisible(true)}
            >
              <Image source={imageIndex.Editpen} style={{ width: 18, height: 18, tintColor: "#FFFFFF" }} />
            </TouchableOpacity>
          </View>

          {/* ── Fields ── */}
          <View style={styles.fields}>
            <ProfileField
              label="Child Name"
              value={childName}
              placeholder={"Name"}
              onChangeText={(text) => {
                setChildName(text);
                if (childNameError) setChildNameError("");
              }}
              icon={imageIndex.profileChildName}
            />
            {childNameError ? <Text style={styles.errorText}>{childNameError}</Text> : null}

            <ProfileField
              label="Age"
              value={age}
              placeholder={"Age"}

              icon={imageIndex.age}
              onPress={() => {
                setTempDate(birthDate || new Date());
                setShowDatePicker(true);
              }}
            />
            {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
            <ProfileField
              label="Interests"
              value={interests}
              placeholder={"Interests"}

              onChangeText={(text) => {
                setInterests(text);
                if (interestsError) setInterestsError("");
              }}
              icon={imageIndex.Toys}
            />
            {interestsError ? <Text style={styles.errorText}>{interestsError}</Text> : null}

            <ProfileField
              label="Communication Level"
              placeholder={"Communication Level"}

              value={commLevel}
              onChangeText={(text) => {
                setCommLevel(text);
                if (commLevelError) setCommLevelError("");
              }}
              icon={imageIndex.cooment}
            />
            {commLevelError ? <Text style={styles.errorText}>{commLevelError}</Text> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 20 }}>
        <CustomButton
          title={"Save"}
          onPress={() => {
            let hasError = false;
            if (!childName.trim()) {
              setChildNameError("Child's name required");
              hasError = true;
            }
            if (!birthDate) {
              setAgeError("Date of birth required");
              hasError = true;
            } else {
              const years = new Date().getFullYear() - birthDate.getFullYear();
              if (years < 2 || years > 14) {
                setAgeError("Only for children aged 2-14 years");
                hasError = true;
              }
            }
            if (!interests.trim()) {
              setInterestsError("Interests required");
              hasError = true;
            }
            if (!commLevel.trim()) {
              setCommLevelError("Communication level required");
              hasError = true;
            }

            if (hasError) return;

            // Proper real-time feedback with Success Toast (once implementation is final)
            // successToast("Profile saved successfully");
            navigation.navigate(ScreenNameEnum.PhoneLogin as never);
          }}
        />
      </View>

      {/* ── Modals & Pickers ── */}
      <ImagePickerModal
        modalVisible={imageModalVisible}
        setModalVisible={setImageModalVisible}
        handleTakePhoto={() => openCamera(handleImageResult)}
        pickImageFromGallery={() => openGallery(handleImageResult)}
      />

      {/* ── iOS Date Picker Modal ── */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent
          visible={showDatePicker}
          animationType="slide"
          onRequestClose={handleCancelDate}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCancelDate}
          >
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={handleCancelDate}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmDate}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                maximumDate={new Date()}
                textColor={COLORS.text}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    alignItems: "center",
    paddingBottom: 24,
  },
  avatarSection: {
    marginTop: 24,
    marginBottom: 10,
    alignItems: "center",
    position: "relative",
  },
  avatarRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: COLORS.white,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  editBadge: {
    position: "absolute",
    bottom: -2,
    left: "20%",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  fields: {
    width: "90%",
    marginTop: 20,
    gap: 6,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 60,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  // iOS Picker Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  doneText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "700",
  },
  cancelText: {
    color: COLORS.subText,
    fontSize: 17,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
   },
});

export default MyProfile;