import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { openCamera } from "../../../utils/cameraHelper";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StatusBarComponent from "../../../compoent/StatusBarCompoent";
import CustomHeader from "../../../compoent/CustomHeader";
import CustomInput from "../../../compoent/CustomInput";
import CustomButton from "../../../compoent/CustomButton";
import ImagePickerModal from "../../../compoent/ImagePickerModal";
import imageIndex from "../../../assets/imageIndex";
import { BASE_URLIMAGE, GetParentProfileApi, UpdateParentProfileApi } from "../../../Api/apiRequest";
import { loginSuccess } from "../../../redux/feature/authSlice";
import { errorToast, successToast } from "../../../utils/customToast";

const EditProfile = () => {
  const navigation = useNavigation();
  const userData: any = useSelector((state: any) => state.auth.userData);

  const [fullName, setFullName] = useState(userData?.full_name || "");
  const [email, setEmail] = useState(userData?.email || "");
  console.log("userData", userData)
  const [countryCode, setCountryCode] = useState(userData?.country_code || userData?.countryCode || "");
  const [phoneNumber, setPhoneNumber] = useState(userData?.phone_number || userData?.phoneNumber || "");
  const [image, setImage] = useState<any>(userData?.profile_image || userData?.image || null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const getProfileData = async () => {
    try {
      const response = await GetParentProfileApi(setIsLoading);
      if (response) {
        const token = await AsyncStorage.getItem("token") || "";
        dispatch(loginSuccess({ userData: response, token }));
      }
    } catch (error) {
      console.error("GetProfileMeApi error:", error);
    }
  };
  const pickImageFromGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response: any) => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
        setIsModalVisible(false);
      }
    });
  };

  const takePhotoFromCamera = () => {
    openCamera((result: any) => {
      if ('cancelled' in result) return;
      if ('error' in result) {
        errorToast(result.error);
        return;
      }
      setImage(result.asset);
      setIsModalVisible(false);
    });
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setFullNameError("Full name required");
      return;
    }

    try {
      const params = {
        full_name: fullName,
        email: email,
        country_code: countryCode,
        phone_number: phoneNumber,
        profile_image: image,
      };

      const response = await UpdateParentProfileApi(params, setIsLoading);

      if (response) {
        await getProfileData();
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarComponent />
      <CustomHeader label="Profile" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          <View style={styles.profileContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                   image?.uri 
                    ? { uri: image.uri } 
                    : (typeof image === 'string' && image 
                        ? { uri: `${BASE_URLIMAGE}/${image}` } 
                        : imageIndex.prfile)
                }
                style={styles.profileImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.editIconContainer}
                onPress={() => setIsModalVisible(true)}
              >
                <Image
                  source={imageIndex.pencle}
                  style={styles.editIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <CustomInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (fullNameError) setFullNameError("");
                }}
                leftIcon={<Image source={imageIndex.profiel} style={styles.icon} />}
              />
              {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}

              <CustomInput
                placeholder="Email Address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                leftIcon={<Image source={imageIndex.mess} style={styles.icon} />}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>
          </View>

          {/* Image Picker Modal */}
          <ImagePickerModal
            modalVisible={isModalVisible}
            setModalVisible={setIsModalVisible}
            pickImageFromGallery={pickImageFromGallery}
            handleTakePhoto={takePhotoFromCamera}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Update Profile"
          onPress={handleSave}
          loading={isLoading}
          style={styles.updateBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',

  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E03B65',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editIcon: {
    width: 22,
    height: 22,
  },
  inputContainer: {
    marginTop: 20,
    width: "100%",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#E03B65",
  },
  buttonContainer: {
    paddingHorizontal: 25,
    paddingBottom: 35,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  updateBtn: {
    borderRadius: 16,
    backgroundColor: '#E03B65',
  },
  errorText: {
    color: "#E03B65",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 15,
    marginLeft: 5,
  },
});

export default EditProfile;
