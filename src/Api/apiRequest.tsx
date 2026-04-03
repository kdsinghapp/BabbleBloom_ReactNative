
import { base_url } from './index';

// ─── BabbleBloom Auth Base URL ───────────────────────────────────────────────
const AUTH_BASE_URL = 'https://python.aitechnotech.in/bubblebloom/api/v1/auth';
import ScreenNameEnum from '../routes/screenName.enum';
import { loginSuccess, logout } from '../redux/feature/authSlice';
import { errorToast, successToast } from '../utils/customToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from '../utils/Toast';
import { color } from '../constant';
import axios from 'axios';
const handleLogout = async (dispatch: any, navigation: any, setvisible: (val: boolean) => void) => {
  try {
    // 1. Clear all persistence layers
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('authData');
    if (setvisible) setvisible(false);
    
    // 2. Reset Redux state
    dispatch(logout());    
 
    // 3. Reset navigation stack to the beginning
    navigation.reset({
      index: 0,
      routes: [{ name: ScreenNameEnum.OnboardingScreen }],
    });

    successToast('Logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
    errorToast('An error occurred during logout.');
  }
};

const saveAuthData = async (userData: any, token: any) => {
  try {
    await AsyncStorage.setItem('authData', JSON.stringify({ userData, token }));
    console.log('Auth data saved successfully');
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};
const getAuthData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('authData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading auth data:', error);
    return null;
  }
};

// ─── Step 1: Signup (register user) ─────────────────────────────────────────
const SignUpApi = async (
  param: {
    full_name: string;
    email: string;
    country_code: string;
    phone_number: string;
    password: string;
    navigation: any;
  },
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  try {
    // API requires application/x-www-form-urlencoded
    const body = new URLSearchParams({
      full_name: param.full_name,
      email: param.email,
      country_code: param.country_code,
      phone_number: param.phone_number,
      password: param.password,
    }).toString();

    console.log('[SignUpApi] Calling POST /api/v1/auth/signup', {
      full_name: param.full_name,
      email: param.email,
      country_code: param.country_code,
      phone_number: param.phone_number,
    });

    const response = await fetch(`${AUTH_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      errorToast('Invalid server response');
      return;
    }

    console.log('[SignUpApi] Response:', parsedResponse);

    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message || 'Signup successful. Please verify OTP.');
      // Navigate to OTP screen with data from response
      param.navigation.navigate(ScreenNameEnum.OtpScreen, {
        country_code: parsedResponse?.data?.country_code || param.country_code,
        phone_number: parsedResponse?.data?.phone_number || param.phone_number,
        otp_code: parsedResponse?.data?.otp_code, // Pass the OTP code if provided (for testing)
        flowType: 'signup',
      });
    } else {
      const msg = parsedResponse?.message || 'Signup failed';
      errorToast(msg);
    }
  } catch (error) {
    console.error('[SignUpApi] error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ─── Step 2: Send OTP ────────────────────────────────────────────────────────
const SendSignupOtpApi = async (
  param: {
    country_code: string;
    phone_number: string;
    navigation: any;
  },
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  try {
    const body = new URLSearchParams({
      country_code: param.country_code,
      phone_number: param.phone_number,
    }).toString();

    console.log('[SendSignupOtpApi] Calling POST /api/v1/auth/signup/send-otp', {
      country_code: param.country_code,
      phone_number: param.phone_number,
    });

    const response = await fetch(`${AUTH_BASE_URL}/signup/send-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      errorToast('Invalid server response');
      return;
    }

    console.log('[SendSignupOtpApi] Response:', parsedResponse);

    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message || 'OTP sent successfully!');
      // Navigate to OTP screen with data from response
      param.navigation.navigate(ScreenNameEnum.OtpScreen, {
        country_code: parsedResponse?.data?.country_code || param.country_code,
        phone_number: parsedResponse?.data?.phone_number || param.phone_number,
        otp_code: parsedResponse?.data?.otp_code, // Pass the OTP code if provided (for testing)
        flowType: 'signup',
      });
    } else {
      const msg = parsedResponse?.message || 'Failed to send OTP';
      errorToast(msg);
    }
  } catch (error) {
    console.error('[SendSignupOtpApi] error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ─── Step 3: Verify OTP ──────────────────────────────────────────────────────
const VerifySignupOtpApi = async (
  param: {
    country_code: string;
    phone_number: string;
    code: string;          // the 4-digit OTP entered by the user
    navigation: any;
  },
  setLoading: (loading: boolean) => void,
  dispatch: any,
) => {
  setLoading(true);
  try {
    const body = new URLSearchParams({
      country_code: param.country_code,
      phone_number: param.phone_number,
      code: param.code,
    }).toString();

    console.log('[VerifySignupOtpApi] Calling POST /api/v1/auth/signup/verify-otp', {
      country_code: param.country_code,
      phone_number: param.phone_number,
      code: param.code,
    });

    const response = await fetch(`${AUTH_BASE_URL}/signup/verify-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      errorToast('Invalid server response');
      return;
    }

    console.log('[VerifySignupOtpApi] Response:', parsedResponse);

    if (parsedResponse?.status === 1) {
      const { access_token, user } = parsedResponse.data || {};

      console.log('[VerifySignupOtpApi] Success! Storing data:', {
        token: access_token ? 'Extracted' : 'Missing',
        user: user ? user.full_name : 'Missing'
      });

      if (access_token) {
        // 1. Store raw token for general API calls
        await AsyncStorage.setItem('token', access_token);

        // 2. Store full auth data for session restoration
        await saveAuthData(user, access_token);

        // 3. Update Redux state for UI reactivity
        dispatch(loginSuccess({ userData: user, token: access_token }));

        successToast(parsedResponse?.message || 'Verification successful!');

        // 4. Navigate to main app
        param.navigation.reset({
          index: 0,
          routes: [{ name: ScreenNameEnum.HomeDashboard }],
        });
      } else {
        // Some backends might just verify but not log you in yet. 
        // If no token, we might need to go to Login, but for most apps, verification = login.
        successToast(parsedResponse?.message || 'Verified! Please login.');
        param.navigation.navigate(ScreenNameEnum.PhoneLogin as never);
      }
    } else {
      errorToast(parsedResponse?.message || 'OTP verification failed');
    }
  } catch (error: any) {
    console.error('[VerifySignupOtpApi] error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ─── Step 4: Login ───────────────────────────────────────────────────────────
const LoginApi = async (
  param: {
    country_code: string;
    phone_number: string;
    navigation: any;
  },
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  try {
    const body = new URLSearchParams({
      country_code: param.country_code,
      phone_number: param.phone_number,
    }).toString();

    console.log('[LoginApi] Calling POST /api/v1/auth/login/send-otp', {
      country_code: param.country_code,
      phone_number: param.phone_number,
    });

    const response = await fetch(`${AUTH_BASE_URL}/login/send-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      errorToast('Invalid server response');
      return;
    }

    console.log('[LoginApi] Response:', parsedResponse);

    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message || 'OTP sent successfully!');
      // Navigate to OTP screen with data from response
      param.navigation.navigate(ScreenNameEnum.OtpScreen, {
        country_code: parsedResponse?.data?.country_code || param.country_code,
        phone_number: parsedResponse?.data?.phone_number || param.phone_number,
        otp_code: parsedResponse?.data?.otp_code, // Pass the OTP code if provided (for testing)
        flowType: 'login',
      });
    } else {
      errorToast(parsedResponse?.message || 'Login failed');
    }
  } catch (error) {
    console.error('[LoginApi] error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ─── Step 5: Verify Login OTP ────────────────────────────────────────────────
const VerifyLoginOtpApi = async (
  param: {
    country_code: string;
    phone_number: string;
    code: string;
    navigation: any;
  },
  setLoading: (loading: boolean) => void,
  dispatch: any,
) => {
  setLoading(true);
  try {
    const body = new URLSearchParams({
      country_code: param.country_code,
      phone_number: param.phone_number,
      code: param.code,
    }).toString();

    // console.log('[VerifyLoginOtpApi] Calling POST /api/v1/auth/login/verify-otp', {
    //   country_code: param.country_code,
    //   phone_number: param.phone_number,
    //   code: param.code,
    // });

    const response = await fetch(`${AUTH_BASE_URL}/login/verify-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      errorToast('Invalid server response');
      return;
    }

    console.log('[VerifyLoginOtpApi] Response:', parsedResponse);

    if (parsedResponse?.status === 1) {
      const { access_token, user } = parsedResponse.data || {};

      console.log('[VerifyLoginOtpApi] Success! Storing data:', {
        token: access_token ? 'Extracted' : 'Missing',
        user: user ? user.full_name : 'Missing'
      });

      if (access_token) {
        await AsyncStorage.setItem('token', access_token);
        await saveAuthData(user, access_token);

        dispatch(loginSuccess({ userData: user, token: access_token }));

        successToast(parsedResponse?.message || 'Login successful!');

        param.navigation.reset({
          index: 0,
          routes: [{ name: ScreenNameEnum.HomeDashboard }],
        });
      } else {
        errorToast('Token missing from server response');
      }
    } else {
      errorToast(parsedResponse?.message || 'OTP verification failed');
    }
  } catch (error: any) {
    console.error('[VerifyLoginOtpApi] error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ─── Legacy LogiApi (kept for PhoneLogin screen) ─────────────────────────────
const LogiApi = async (
  param: any,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);

  try {
    const formdata = new FormData();
    formdata.append('countryCode', param?.code || '');
    formdata.append('phoneNumber', param?.phone || '');
    formdata.append('Type', param?.type || '');

    const response = await fetch(`${base_url}/login`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formdata,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (error) {
      errorToast('Invalid server response');
      return;
    }

    if (parsedResponse?.status === 1) {
      successToast(parsedResponse.message);
      param.navigation.navigate(ScreenNameEnum.OtpScreen, {
        code: param?.code,
        phone: param?.phone,
      });
      return parsedResponse;
    } else {
      errorToast(parsedResponse.message);
      return parsedResponse;
    }
  } catch (error) {
    console.error('Login error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ─── Legacy Verifyotp (kept for backward compatibility) ───────────────────────
const Verifyotp = async (param: any, setLoading: any, dispatch: any) => {
  setLoading(true);
  try {
    const formdata = new FormData();
    formdata.append('countryCode', param?.code || '');
    formdata.append('phoneNumber', param?.phone || '');
    formdata.append('otp', param?.otp || '');

    const response = await fetch(`${base_url}/verify-otp`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formdata,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (error) {
      errorToast('Invalid server response');
      return;
    }
    if (parsedResponse?.status == 1) {
      successToast(parsedResponse?.message);
      await AsyncStorage.setItem('token', parsedResponse?.token);
      dispatch(loginSuccess({ userData: parsedResponse, token: parsedResponse?.token }));
      await saveAuthData(parsedResponse, parsedResponse?.token);
      if (parsedResponse?.type === 'Delivery') {
        param.navigation.navigate(ScreenNameEnum.DeliveryTabNavigator);
      } else {
        param.navigation.navigate(ScreenNameEnum.TabNavigator);
      }
    } else {
      errorToast(parsedResponse?.message);
    }
  } catch (error: any) {
    console.error('Verifyotp error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ─── Legacy Resend_otp (kept for backward compatibility) ──────────────────────
const Resend_otp = async (param: any, setLoading: any) => {
  setLoading(true);
  try {
    const formdata = new FormData();
    formdata.append('countryCode', param?.code || '');
    formdata.append('phoneNumber', param?.phone || '');

    const response = await fetch(`${base_url}/resend-otp`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formdata,
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch (error) {
      errorToast('Invalid server response');
      return;
    }
    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message);
    } else {
      errorToast(parsedResponse?.message);
    }
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

const UpdateProfile = async (
  param: any,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem("token");

    const formdata = new FormData();

    if (param.username) formdata.append("firstName", param.username);
    if (param.email) formdata.append("email", param.email);
    if (param.address) formdata.append("address", param.address);

    // ✅ Append image only if exists
    if (param.imagePrfoile && param.imagePrfoile.uri) {
      const fileName = param.imagePrfoile.fileName || "profile.jpg";
      const fileType = param.imagePrfoile.type || "image/jpeg";

      formdata.append("imageFile", {
        uri: param.imagePrfoile.uri,
        name: fileName,
        type: fileType,
      });
    }

    // ✅ Do NOT manually set 'Content-Type' header
    const headers: any = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    // ✅ Use POST (most servers expect POST for FormData upload)
    const response = await fetch(`${base_url}/setup-profile`, {
      method: "POST",
      headers,
      body: formdata,
    });
    console.log("response", response)
    const textResponse = await response.text();
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      throw new Error("Invalid server response");
    }
    console.log("parsedResponse", parsedResponse)

    if (parsedResponse.status == "1") {
      successToast(parsedResponse.message);
      return parsedResponse;
    } else {
      errorToast(parsedResponse.message);
      return parsedResponse;
    }
  } catch (error) {
    console.log("parsedResponse", error)

    console.error("UpdateProfile error:", error);
    errorToast("Something went wrong. Please try again.");
    return null;
  } finally {
    setLoading(false);
  }
};



const GetProfileApi = async (
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  console.log("token", token);
  try {
    const response = await fetch(`${base_url}/setup-profile`, {
      method: 'GET',  // agar get ho toh GET use karna
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("responseData", responseData);

    if (responseData.status === "1" || responseData.status === 1) {
      return responseData;
    } else {
      Toast(responseData.error || responseData.message || "Something went wrong", color.red, 10);
      return null;
    }
  } catch (error) {
    console.error("API call error:", error);
    errorToast("Network error");
    return null;
  } finally {
    setLoading(false);
  }
};


const Privacypolicy = async (setLoading: any) => {
  setLoading(true);
  try {
    const response = await fetch(`${base_url}/privacy-policy`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const textResponse = await response.text();
    const parsedResponse = JSON.parse(textResponse);

    console.log("parsedResponse", parsedResponse);

    if (parsedResponse?.status === 1) {
      // successToast(parsedResponse?.message);
      return parsedResponse; // ✅ Return the data
    } else {
      errorToast(parsedResponse?.message);
      return null; // Optional: return null on failure
    }

  } catch (error: any) {
    console.error('Privacy Policy error:', error);
    errorToast(error.message);
    return null;
  } finally {
    setLoading(false);
  }
};


const Termsconditions = async (setLoading: any) => {
  setLoading(true);
  try {
    const response = await fetch(`${base_url}/terms-and-conditions`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const textResponse = await response.text();
    const parsedResponse = JSON.parse(textResponse);

    console.log("parsedResponse", parsedResponse);

    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message);
      return parsedResponse; // ✅ Return the data
    } else {
      errorToast(parsedResponse?.message);
      return null; // Optional: return null on failure
    }

  } catch (error: any) {
    console.error('Privacy Policy error:', error);
    errorToast(error.message);
    return null;
  } finally {
    setLoading(false);
  }
};


const DeliveryUploadDocument = async (
  param: any,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    const formdata = new FormData();

    if (param.drivingLicense?.uri) {
      formdata.append("drivingLicense", {
        uri: param.drivingLicense.uri,
        name: param.drivingLicense.name || "license.jpg",
        type: param.drivingLicense.type || "image/jpeg",
      });
    }

    if (param.idDocument?.uri) {
      formdata.append("idDocument", {
        uri: param.idDocument.uri,
        name: param.idDocument.name || "id.jpg",
        type: param.idDocument.type || "image/jpeg",
      });
    }

    if (param.vehiclePapers?.uri) {
      formdata.append("vehiclePapers", {
        uri: param.vehiclePapers.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });
    }

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${base_url}/upload-document`, {
      method: "POST",
      headers,
      body: formdata,
    });

    const textResponse = await response.text();
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      throw new Error("Invalid server response");
    }
    console.log("parsedResponse", parsedResponse);
    if (parsedResponse.status == "1") {
      successToast(parsedResponse.message);
    }

    return parsedResponse;
  } catch (error) {
    console.error("DeliveryUploadDocument error:", error);
    errorToast("Something went wrong. Please try again.");
    return null;
  } finally {
    setLoading(false);
  }
};


const DeliveryVehicleDocument = async (
  param: any,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    const formdata = new FormData();

    if (param.vehicleType) {
      formdata.append("vehicleType", param.vehicleType);
    }

    if (param.vehicleNumber) {
      formdata.append("vehicleNumber", param.vehicleNumber);
    }

    if (param.vehicleRegistration?.uri) {
      formdata.append("vehicleRegistration", {
        uri: param.vehicleRegistration.uri,
        name: param.vehicleRegistration.name || "vehicle_registration.jpg",
        type: param.vehicleRegistration.type || "image/jpeg",
      });
    }
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${base_url}/vehicle-setup`, {
      method: "POST",
      headers,
      body: formdata,
    });

    const textResponse = await response.text();
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      throw new Error("Invalid server response");
    }

    console.log("Vehicle Upload Response:", parsedResponse);

    if (parsedResponse.status == "1") {
      successToast(parsedResponse.message || "Document uploaded successfully!");
    } else {
      errorToast(parsedResponse.message || "Upload failed.");
    }

    return parsedResponse;
  } catch (error) {
    console.error("DeliveryVehicleDocument error:", error);
    errorToast("Something went wrong. Please try again.");
    return null;
  } finally {
    setLoading(false);
  }
};

const GetuploadDocument = async (
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  console.log("token", token);
  try {
    const response = await fetch(`${base_url}/upload-document`, {
      method: 'GET',  // agar get ho toh GET use karna
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("responseData", responseData);

    if (responseData.status === "1" || responseData.status === 1) {
      return responseData;
    } else {
      Toast(responseData.error || responseData.message || "Something went wrong", color.red, 10);
      return null;
    }
  } catch (error) {
    console.error("API call error:", error);
    errorToast("Network error");
    return null;
  } finally {
    setLoading(false);
  }
};
const AddParcelApi = async (param: any, setLoading: (loading: boolean) => void) => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const formdata = new FormData();
    if (param?.image && param?.image?.uri) {
      const fileName = param.image.fileName || "profile.jpg";
      const fileType = param.image.type || "image/jpeg";
      formdata.append("imageFile", {
        uri: param.image.uri,
        name: fileName,
        type: fileType,
      });
    }
    if (param?.pickupLocation) formdata.append("pickupLocation", param.pickupLocation?.address);
    if (param?.dropLocation) formdata.append("dropLocation", param.dropLocation);
    // image
    if (param?.pickupLat?.latitude) formdata.append("pickupLocationLat", param.pickupLocation?.longitude);
    if (param?.pickupLat?.longitude) formdata.append("pickupLocationLon", param.pickupLocation?.latitude);
    if (param?.droplat?.latitude) formdata.append("dropLocationLat", param.droplat.latitude);
    if (param?.droplat.longitude) formdata.append("dropLocationLon", param.droplat.longitude);
    if (param.shipmentType) formdata.append("shipmentType", param.shipmentType);
    if (param.senderName) formdata.append("senderName", param.senderName);
    if (param.senderMobile) formdata.append("senderMobileNumber", param.senderMobile);
    if (param.senderAddress) formdata.append("senderAddress", param.senderAddress);
    if (param.pickupDate) {
      formdata.append("pickupDate", param.pickupDate instanceof Date ? param.pickupDate.toISOString() : param.pickupDate);
    }
    if (param.pickupTime) {
      formdata.append("pickupTime", param.pickupTime instanceof Date ? param.pickupTime.toISOString() : param.pickupTime);
    }
    if (param.consignmentType) formdata.append("consignmentType", param.consignmentType);
    if (param.packageSize) formdata.append("packageSize", param.packageSize);
    if (param.deliveryType) formdata.append("deliveryType", param.deliveryType);
    if (param.price) formdata.append("price", param.price);

    if (param.receiverName) formdata.append("receiverName", param.receiverName);
    if (param.receiverMobile) formdata.append("receiverMobileNumber", param.receiverMobile);
    if (param.receiverAddress) formdata.append("receiverAddress", param.receiverAddress);
    if (param.extraMessage) formdata.append("message", param.extraMessage);

    if (param.pickupLat) formdata.append("pickupLat", param.pickupLat.toString());
    if (param.droplat) formdata.append("droplat", param.droplat.toString());
    console.log("FormData:", formdata);
    const headers: any = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${base_url}/parcel-details`, {
      method: "POST",
      headers,
      body: formdata,
    });

    const textResponse = await response.text();
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      throw new Error("Invalid server response");
    }
    if (parsedResponse.status == "1") {
      successToast(parsedResponse.message);
      return parsedResponse;
    } else {
      errorToast(parsedResponse.message);
      return parsedResponse;
    }
  } catch (error) {
    console.error("AddParcelApi error:", error);
    errorToast("Something went wrong. Please try again.");
    return null;
  } finally {
    setLoading(false);
  }
};

const GetApi = async (param: any, setLoading: (loading: boolean) => void) => {
  // console.log("API PARAM:", param);

  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: any = {
      method: param.method || "GET",
      headers: myHeaders,
    };

    // ✅ ADD BODY ONLY IF EXISTS
    if (param.data && Object.keys(param.data).length > 0) {
      requestOptions.body = JSON.stringify(param.data);
    }

    const response = await fetch(base_url + param.url, requestOptions);
    const resText = await response.text();
    const result = JSON.parse(resText);

    // console.log("API RESPONSE:", result);

    setLoading(false);
    return result;

  } catch (error) {
    setLoading(false);
    errorToast("Network error");
    return null;
  }
};

export const PostApi = async (param, setLoading) => {
  try {
    setLoading && setLoading(true);

    const headers = {
      Accept: "application/json",
      ...(param?.isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" }),
      ...(param?.token && { Authorization: `Bearer ${param.token}` }),
    };
    console.log(base_url + param.url,
      param.data,
      { headers })
    const response = await axios.post(
      base_url + param.url,
      param.data,
      { headers }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log("POST API ERROR 👉", error?.response || error);

    return {
      status: false,
      message:
        error?.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  } finally {
    setLoading && setLoading(false);
  }
};




const Parceldetails = async (
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(`${base_url}/parcel-details`, {
      method: 'GET',  // agar get ho toh GET use karna
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("responseData", responseData);

    if (responseData.status == "1" || responseData.status == 1) {
      return responseData;
    } else {
      Toast(responseData.error || responseData.message || "Something went wrong", color.red, 10);
      return null;
    }
  } catch (error) {
    console.error("API call error:", error);
    errorToast("Network error");
    return null;
  } finally {
    setLoading(false);
  }
};






const DeliveryAvailableRequests = async (
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(`${base_url}/delivery/available-requests`, {
      method: 'GET',  // agar get ho toh GET use karna
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("responseData", responseData);

    if (responseData.status === "1" || responseData.status === 1) {
      return responseData;
    } else {
      Toast(responseData.error || responseData.message || "Something went wrong", color.red, 10);
      return null;
    }
  } catch (error) {
    errorToast("Network error");
    return null;
  } finally {
    setLoading(false);
  }
};

export {
  // BabbleBloom Auth
  SignUpApi,
  SendSignupOtpApi,
  VerifySignupOtpApi,
  LoginApi,
  VerifyLoginOtpApi,
  // Legacy
  LogiApi,
  Verifyotp,
  handleLogout,
  getAuthData,
  Termsconditions,
  saveAuthData,
  Resend_otp,
  GetProfileApi,
  Privacypolicy,
  UpdateProfile,
  DeliveryUploadDocument,
  DeliveryVehicleDocument,
  GetuploadDocument,
  AddParcelApi,
  Parceldetails,
  DeliveryAvailableRequests,
  GetApi,
}