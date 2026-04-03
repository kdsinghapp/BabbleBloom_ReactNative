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
import { GetProfileApi, UpdateProfile } from "../../../Api/apiRequest";
import { loginSuccess } from "../../../redux/feature/authSlice";
import { errorToast } from "../../../utils/customToast";

const EditProfile = () => {
  const navigation = useNavigation();
  const userData: any = useSelector((state: any) => state.auth.userData);

  const [fullName, setFullName] = useState(userData?.firstName || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [address, setAddress] = useState(userData?.address || "");
  const [image, setImage] = useState<any>(userData?.image || null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const getProfileApi = async () => {
    try {
      const response = await GetProfileApi(setIsLoading);
      if (response) {
        const token = await AsyncStorage.getItem("token") || "";
        dispatch(loginSuccess({ userData: response, token }));
      }
    } catch (error) {
      console.error("GetProfileApi error:", error);
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
    let hasError = false;
    if (!fullName.trim()) {
      setFullNameError("Full name required");
      hasError = true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError("Invalid email address");
      hasError = true;
    }

    if (hasError) return;

    try {
       const params = {
        username: fullName,
        email: email,
        address: address,
        imagePrfoile: image,
      };
      const response = await UpdateProfile(params, setIsLoading);

      if (response) {
        getProfileApi();
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // adjust offset if needed

      >
        <ScrollView contentContainerStyle={styles.container}

        >
          <View style={styles.profileContainer}>
            <Image
              source={image ? { uri: image.uri || image } : imageIndex.prfile}
              style={styles.profileImage}
              resizeMode="cover"
            />

            {/* Edit Icon */}
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() => setIsModalVisible(true)}
            >
              <Image
                source={imageIndex.eoditphots}
                style={styles.editIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

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
                placeholder="Email"
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
        <CustomButton title="Update" onPress={handleSave} loading={isLoading} />
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
    alignItems: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    position: "relative", // needed for absolute edit icon
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },
  editIconContainer: {
    position: "relative",
    bottom: 20,
    right: 0,
    padding: 5,
    left: 16

  },
  editIcon: {
    width: 33,
    height: 33,
    tintColor: "#E03B65"
  },
  inputContainer: {
    marginTop: 20,
    width: "90%",
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: "#E03B65"
  },
  buttonContainer: {
    marginBottom: 30,
    marginHorizontal: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default EditProfile;
