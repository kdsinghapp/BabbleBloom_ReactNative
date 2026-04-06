
import { base_url } from './index';

// ─── BabbleBloom Auth Base URL ───────────────────────────────────────────────
const AUTH_BASE_URL = 'https://python.aitechnotech.in/bubblebloom/api/v1/auth';

import ScreenNameEnum from '../routes/screenName.enum';
import { loginSuccess, logout } from '../redux/feature/authSlice';
import { errorToast, successToast } from '../utils/customToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from '../utils/Toast';

import axios from 'axios';
import { authEndpoints } from './endpoints';

// ─── Session Management ──────────────────────────────────────────────────────

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

// ─── BabbleBloom Auth APIs ───────────────────────────────────────────────────

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
    const body = new URLSearchParams({
      full_name: param.full_name,
      email: param.email,
      country_code: param.country_code,
      phone_number: param.phone_number,
      password: param.password,
    }).toString();

    const response = await fetch(`${AUTH_BASE_URL}/${authEndpoints.signup}`, {
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

    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message || 'Signup successful. Please verify OTP.');
      param.navigation.navigate(ScreenNameEnum.OtpScreen, {
        country_code: parsedResponse?.data?.country_code || param.country_code,
        phone_number: parsedResponse?.data?.phone_number || param.phone_number,
        otp_code: parsedResponse?.data?.otp_code,
        flowType: 'signup',
      });
    } else {
      errorToast(parsedResponse?.message || 'Signup failed');
    }
  } catch (error) {
    console.error('[SignUpApi] error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

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

    const response = await fetch(`${AUTH_BASE_URL}/${authEndpoints.signupSendOtp}`, {
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

    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message || 'OTP sent successfully!');
      param.navigation.navigate(ScreenNameEnum.OtpScreen, {
        country_code: parsedResponse?.data?.country_code || param.country_code,
        phone_number: parsedResponse?.data?.phone_number || param.phone_number,
        otp_code: parsedResponse?.data?.otp_code,
        flowType: 'signup',
      });
    } else {
      errorToast(parsedResponse?.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('[SendSignupOtpApi] error:', error);
    errorToast('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

const VerifySignupOtpApi = async (
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

    const response = await fetch(`${AUTH_BASE_URL}/${authEndpoints.signupVerifyOtp}`, {
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

    if (parsedResponse?.status === 1) {
      const { access_token, user } = parsedResponse.data || {};
      if (access_token) {
        await AsyncStorage.setItem('token', access_token);
        await saveAuthData(user, access_token);
        dispatch(loginSuccess({ userData: user, token: access_token }));
        successToast(parsedResponse?.message || 'Verification successful!');
        param.navigation.reset({
          index: 0,
          routes: [{ name: ScreenNameEnum.HomeDashboard }],
        });
      } else {
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

    const response = await fetch(`${AUTH_BASE_URL}/${authEndpoints.loginSendOtp}`, {
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

    if (parsedResponse?.status === 1) {
      successToast(parsedResponse?.message || 'OTP sent successfully!');
      param.navigation.navigate(ScreenNameEnum.OtpScreen, {
        country_code: parsedResponse?.data?.country_code || param.country_code,
        phone_number: parsedResponse?.data?.phone_number || param.phone_number,
        otp_code: parsedResponse?.data?.otp_code,
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

    const response = await fetch(`${AUTH_BASE_URL}/${authEndpoints.loginVerifyOtp}`, {
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

    if (parsedResponse?.status === 1) {
      const { access_token, user } = parsedResponse.data || {};
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

export const GetProfileMeApi = async (
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${AUTH_BASE_URL}/${authEndpoints.me}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const textResponse = await response.text();
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(textResponse);
    } catch {
      throw new Error('Invalid server response');
    }

    if (parsedResponse?.status === 1) {
      return parsedResponse.data;
    } else {
      errorToast(parsedResponse?.message || 'Failed to fetch profile');
      return null;
    }
  } catch (error) {
    console.error('[GetProfileMeApi] error:', error);
    errorToast('Network error. Please try again.');
    return null;
  } finally {
    setLoading(false);
  }
};

// ─── Legacy APIs (Keeping as per user request for "proper all api call") ───

const LogiApi = async (param: any, setLoading: (loading: boolean) => void) => {
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
    const parsed = await response.json();
    if (parsed?.status === 1) {
      successToast(parsed.message);
      param.navigation.navigate(ScreenNameEnum.OtpScreen, { code: param?.code, phone: param?.phone });
    } else {
      errorToast(parsed?.message);
    }
  } catch (error) {
    errorToast('Network error');
  } finally {
    setLoading(false);
  }
};

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
    const parsed = await response.json();
    if (parsed?.status == 1) {
      successToast(parsed?.message);
      await AsyncStorage.setItem('token', parsed?.token);
      dispatch(loginSuccess({ userData: parsed, token: parsed?.token }));
      await saveAuthData(parsed, parsed?.token);
      param.navigation.navigate(parsed?.type === 'Delivery' ? ScreenNameEnum.DeliveryTabNavigator : ScreenNameEnum.TabNavigator);
    } else {
      errorToast(parsed?.message);
    }
  } catch (error) {
    errorToast('Network error');
  } finally {
    setLoading(false);
  }
};

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
    const parsed = await response.json();
    if (parsed?.status === 1) successToast(parsed?.message);
    else errorToast(parsed?.message);
  } catch (error) {
    errorToast('Network error');
  } finally {
    setLoading(false);
  }
};

const UpdateProfile = async (param: any, setLoading: (loading: boolean) => void) => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const formdata = new FormData();
    if (param.username) formdata.append("firstName", param.username);
    if (param.email) formdata.append("email", param.email);
    if (param.address) formdata.append("address", param.address);
    if (param.imagePrfoile?.uri) {
      formdata.append("imageFile", {
        uri: param.imagePrfoile.uri,
        name: param.imagePrfoile.fileName || "profile.jpg",
        type: param.imagePrfoile.type || "image/jpeg",
      } as any);
    }
    const response = await fetch(`${base_url}/setup-profile`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      body: formdata,
    });
    const parsed = await response.json();
    if (parsed.status == "1") {
      successToast(parsed.message);
      return parsed;
    } else {
      errorToast(parsed.message);
      return parsed;
    }
  } catch (error) {
    errorToast("Something went wrong");
    return null;
  } finally {
    setLoading(false);
  }
};

const GetProfileApi = async (setLoading: (loading: boolean) => void) => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(`${base_url}/setup-profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const parsed = await response.json();
    if (parsed.status === "1" || parsed.status === 1) return parsed;
    else return null;
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

const Privacypolicy = async (setLoading: any) => {
  setLoading(true);
  try {
    const response = await fetch(`${base_url}/privacy-policy`, { method: 'GET' });
    const parsed = await response.json();
    return parsed?.status === 1 ? parsed : null;
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

const Termsconditions = async (setLoading: any) => {
  setLoading(true);
  try {
    const response = await fetch(`${base_url}/terms-and-conditions`, { method: 'GET' });
    const parsed = await response.json();
    return parsed?.status === 1 ? parsed : null;
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

const DeliveryUploadDocument = async (param: any, setLoading: (loading: boolean) => void) => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem("token");
    const formdata = new FormData();
    ['drivingLicense', 'idDocument', 'vehiclePapers'].forEach(key => {
      if (param[key]?.uri) {
        formdata.append(key, {
          uri: param[key].uri,
          name: param[key].name || "doc.jpg",
          type: param[key].type || "image/jpeg",
        } as any);
      }
    });
    const response = await fetch(`${base_url}/upload-document`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formdata,
    });
    const parsed = await response.json();
    if (parsed.status == "1") successToast(parsed.message);
    return parsed;
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

const DeliveryVehicleDocument = async (param: any, setLoading: (loading: boolean) => void) => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem("token");
    const formdata = new FormData();
    if (param.vehicleType) formdata.append("vehicleType", param.vehicleType);
    if (param.vehicleNumber) formdata.append("vehicleNumber", param.vehicleNumber);
    if (param.vehicleRegistration?.uri) {
      formdata.append("vehicleRegistration", {
        uri: param.vehicleRegistration.uri,
        name: param.vehicleRegistration.name || "reg.jpg",
        type: param.vehicleRegistration.type || "image/jpeg",
      } as any);
    }
    const response = await fetch(`${base_url}/vehicle-setup`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formdata,
    });
    const parsed = await response.json();
    if (parsed.status == "1") successToast(parsed.message);
    return parsed;
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

const GetuploadDocument = async (setLoading: (loading: boolean) => void) => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(`${base_url}/upload-document`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

const AddParcelApi = async (param: any, setLoading: (loading: boolean) => void) => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem("token");
    const formdata = new FormData();
    if (param?.image?.uri) {
      formdata.append("imageFile", {
        uri: param.image.uri,
        name: param.image.fileName || "parcel.jpg",
        type: param.image.type || "image/jpeg",
      } as any);
    }
    const fields = [
      'shipmentType', 'senderName', 'senderMobileNumber', 'senderAddress',
      'pickupDate', 'pickupTime', 'consignmentType', 'packageSize',
      'deliveryType', 'price', 'receiverName', 'receiverMobileNumber',
      'receiverAddress', 'message', 'pickupLocation', 'dropLocation',
      'pickupLocationLat', 'pickupLocationLon', 'dropLocationLat', 'dropLocationLon'
    ];
    fields.forEach(f => { if (param[f]) formdata.append(f, param[f]); });
    const response = await fetch(`${base_url}/parcel-details`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formdata,
    });
    const parsed = await response.json();
    if (parsed.status == "1") successToast(parsed.message);
    return parsed;
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

const GetApi = async (param: any, setLoading: (loading: boolean) => void) => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(base_url + param.url, {
      method: param.method || "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      ...(param.data && { body: JSON.stringify(param.data) })
    });
    return await response.json();
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

export const PostApi = async (param: any, setLoading?: (loading: boolean) => void) => {
  if (setLoading) setLoading(true);
  try {
    const headers = {
      Accept: "application/json",
      ...(param?.isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" }),
      ...(param?.token && { Authorization: `Bearer ${param.token}` }),
    };
    const response = await axios.post(base_url + param.url, param.data, { headers });
    return response.data;
  } catch (error: any) {
    return { status: false, message: error?.response?.data?.message || "Something went wrong" };
  } finally {
    if (setLoading) setLoading(false);
  }
};

const Parceldetails = async (setLoading: (loading: boolean) => void) => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(`${base_url}/parcel-details`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

const DeliveryAvailableRequests = async (setLoading: (loading: boolean) => void) => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  try {
    const response = await fetch(`${base_url}/delivery/available-requests`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return null;
  } finally {
    setLoading(false);
  }
};

export {
  SignUpApi,
  SendSignupOtpApi,
  VerifySignupOtpApi,
  LoginApi,
  VerifyLoginOtpApi,
  handleLogout,
  saveAuthData,
  getAuthData,
  LogiApi,
  Verifyotp,
  Resend_otp,
  UpdateProfile,
  GetProfileApi,
  Privacypolicy,
  Termsconditions,
  DeliveryUploadDocument,
  DeliveryVehicleDocument,
  GetuploadDocument,
  AddParcelApi,
  Parceldetails,
  DeliveryAvailableRequests,
  GetApi,
};