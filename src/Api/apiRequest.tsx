
import { base_url } from './index';

// ─── BabbleBloom Base URL ───────────────────────────────────────────────
const BUBBLEBLOOM_BASE_URL = 'https://python.aitechnotech.in/bubblebloom/api/v1';
export const BASE_URLIMAGE = 'https://python.aitechnotech.in/bubblebloom';

const AUTH_BASE_URL = `${BUBBLEBLOOM_BASE_URL}/auth`;

import ScreenNameEnum from '../routes/screenName.enum';
import { loginSuccess, logout } from '../redux/feature/authSlice';
import { errorToast, successToast } from '../utils/customToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from '../utils/Toast';

import axios from 'axios';
import { authEndpoints, commonEndpoints } from './endpoints';

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
          routes: [
            {
              name: ScreenNameEnum.MyProfile,
              params: {
                flowType: "signup",
              },
            },
          ],
        });
        // param.navigation.reset({
        //   index: 0,
        //   routes: [{ name: ScreenNameEnum.HomeDashboard }],
        // });
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

export const GetFAQsApi = async (setLoading: (loading: boolean) => void): Promise<any[] | null> => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  console.log('[GetFAQsApi] Fetching FAQs from:', `${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.faqs}`);
  try {
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.faqs}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    const textResponse = await response.text();
    console.log('[GetFAQsApi] Raw response:', textResponse);

    let parsed: any;
    try {
      parsed = JSON.parse(textResponse);
    } catch (e) {
      console.error('[GetFAQsApi] JSON parse error:', e);
      errorToast('Invalid server response');
      return null;
    }

    if (parsed?.status === 1) {
      console.log('[GetFAQsApi] FAQs fetched successfully:', parsed.data?.length, 'items');
      return parsed.data;
    } else {
      console.warn('[GetFAQsApi] API returned non-success status:', parsed?.status, parsed?.message);
      errorToast(parsed?.message || 'Failed to fetch FAQs');
      return null;
    }
  } catch (error: any) {
    console.error('[GetFAQsApi] Network error:', error);
    errorToast('Network error. Please check your connection.');
    return null;
  } finally {
    setLoading(false);
  }
};

export const ContactUsApi = async (
  param: { name: string; email?: string; message: string },
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  try {
    const body = new URLSearchParams({
      name: param.name,
      email: param.email || '',
      message: param.message,
    }).toString();

    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.contactUs}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body,
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      successToast(parsed?.message || 'Message sent successfully');
      return parsed;
    } else {
      errorToast(parsed?.message || 'Failed to send message');
      return parsed;
    }
  } catch (error) {
    console.error('[ContactUsApi] error:', error);
    errorToast('Network error. Please try again.');
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetParentProfileApi = async (
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.parentProfile}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      return parsed.data;
    } else {
      errorToast(parsed?.message || 'Failed to fetch profile');
      return null;
    }
  } catch (error) {
    console.error('[GetParentProfileApi] error:', error);
    errorToast('Network error. Please try again.');
    return null;
  } finally {
    setLoading(false);
  }
};

export const UpdateParentProfileApi = async (
  param: {
    full_name: string;
    email?: string;
    country_code: string;
    phone_number: string;
    profile_image?: any;
  },
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('full_name', param.full_name);
    if (param.email) formdata.append('email', param.email);
    formdata.append('country_code', param.country_code);
    formdata.append('phone_number', param.phone_number);

    if (param.profile_image?.uri) {
      formdata.append('profile_image', {
        uri: param.profile_image.uri,
        name: param.profile_image.fileName || 'profile.jpg',
        type: param.profile_image.type || 'image/jpeg',
      } as any);
    }

    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.parentProfile}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formdata,
    });

    const parsed = await response.json();
    console.log('[UpdateParentProfileApi] response:', parsed);
    if (parsed?.status === 1) {
      successToast(parsed?.message || 'Profile updated successfully');
      return parsed.data;
    } else {
      errorToast(parsed?.message || 'Update failed');
      return null;
    }
  } catch (error) {
    console.error('[UpdateParentProfileApi] error:', error);
    errorToast('Network error. Please try again.');
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetChildrenApi = async (setLoading: (loading: boolean) => void): Promise<any[] | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.children}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      return parsed.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[GetChildrenApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

export const AddChildApi = async (
  param: {
    full_name: string;
    date_of_birth: string;
    gender: string;
    interests: string;
    communication_level: string;
    profile_image?: any;
  },
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('full_name', param.full_name);
    formdata.append('date_of_birth', param.date_of_birth);
    formdata.append('gender', param.gender);
    formdata.append('interests', param.interests);
    formdata.append('communication_level', param.communication_level);

    if (param.profile_image?.uri) {
      formdata.append('profile_image', {
        uri: param.profile_image.uri,
        name: param.profile_image.fileName || 'child.jpg',
        type: param.profile_image.type || 'image/jpeg',
      } as any);
    }

    console.log("add formdata --  ", formdata)
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.children}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formdata,
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      successToast(parsed?.message || 'Child added successfully');
      return parsed.data;
    } else {
      errorToast(parsed?.message || 'Failed to add child');
      return null;
    }
  } catch (error) {
    console.error('[AddChildApi] error:', error);
    errorToast('Network error');
    return null;
  } finally {
    setLoading(false);
  }
};

export const UpdateChildApi = async (
  childId: number,
  param: {
    full_name: string;
    date_of_birth: string;
    gender: string;
    interests: string;
    communication_level: string;
    profile_image?: any;
  },
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('full_name', param.full_name);
    formdata.append('date_of_birth', param.date_of_birth);
    formdata.append('gender', param.gender);
    formdata.append('interests', param.interests);
    formdata.append('communication_level', param.communication_level);

    if (param.profile_image?.uri && (param.profile_image.uri.startsWith('file://') || param.profile_image.uri.startsWith('content://'))) {
      formdata.append('profile_image', {
        uri: param.profile_image.uri,
        name: param.profile_image.fileName || 'child.jpg',
        type: param.profile_image.type || 'image/jpeg',
      } as any);
    }

    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.children}/${childId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formdata,
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      successToast(parsed?.message || 'Child updated successfully');
      return parsed.data;
    } else {
      errorToast(parsed?.message || 'Failed to update child');
      return null;
    }
  } catch (error) {
    console.error('[UpdateChildApi] error:', error);
    errorToast('Network error');
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetChildDetailApi = async (
  childId: number,
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.children}/${childId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      return parsed.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[GetChildDetailApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

export const DeleteChildApi = async (
  childId: number,
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.children}/${childId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      successToast(parsed?.message || 'Child deleted successfully');
      return true;
    } else {
      errorToast(parsed?.message || 'Failed to delete child');
      return false;
    }
  } catch (error) {
    console.error('[DeleteChildApi] error:', error);
    errorToast('Network error');
    return false;
  } finally {
    setLoading(false);
  }
};

export const CreateScriptApi = async (
  param: {
    child_id: number;
    script_text: string;
    context: string;
    emotional_state: string;
    source: string;
    frequency: string;
    user_guess?: string;
    notes?: string;
    media_file?: any;
  },
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('child_id', param.child_id.toString());
    formdata.append('script_text', param.script_text);
    formdata.append('context', param.context);
    formdata.append('emotional_state', param.emotional_state);
    formdata.append('source', param.source);
    formdata.append('frequency', param.frequency);

    if (param.user_guess) formdata.append('user_guess', param.user_guess);
    if (param.notes) formdata.append('notes', param.notes);

    if (param.media_file?.uri) {
      formdata.append('media_file', {
        uri: param.media_file.uri,
        name: param.media_file.fileName || 'audio.mp3',
        type: param.media_file.type || 'audio/mpeg',
      } as any);
    }

    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.scripts}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formdata,
    });
    console.log("add response", response)

    const parsed = await response.json();
    if (parsed) {
      // successToast(parsed?.message || 'Script logged successfully');
      return parsed;
    }
  } catch (error) {
    console.error('[CreateScriptApi] error:', error);
    errorToast('Network error');
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetScriptsApi = async (
  child_id: number,
  setLoading: (loading: boolean) => void
): Promise<any[] | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.scripts}?child_id=${child_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      return parsed.data || [];
    } else {
      return null;
    }
  } catch (error) {
    console.error('[GetScriptsApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetScriptDetailApi = async (
  script_id: number,
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.scripts}/${script_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed) {
      return parsed;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[GetScriptDetailApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

const GetActivitiesApi = async (
  child_id: number,
  setLoading: (loading: boolean) => void
): Promise<any[] | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.activities}?child_id=${child_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      return parsed.data || [];
    } else {
      return null;
    }
  } catch (error) {
    console.error('[GetActivitiesApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetLibraryResponsesApi = async (
  setLoading: (loading: boolean) => void,
  child_id?: number,
  search?: string,
  category?: string
): Promise<any[] | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const queryParams = new URLSearchParams();
    if (child_id) queryParams.append('child_id', child_id.toString());
    if (search) queryParams.append('search', search);
    if (category) queryParams.append('category', category);

    const url = `${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.libraryResponses}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('[GetLibraryResponsesApi] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      console.log('[GetLibraryResponsesApi] Success:', parsed.data?.length, 'items');
      return parsed.data || [];
    } else {
      errorToast(parsed?.message || 'Failed to fetch library responses');
      return null;
    }
  } catch (error) {
    console.error('[GetLibraryResponsesApi] error:', error);
    errorToast('Network error');
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetActivityDetailApi = async (
  activity_id: number,
  setLoading: (loading: boolean) => void,
  child_id?: number
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    let url = `${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.activities}/${activity_id}`;
    if (child_id) {
      url += `?child_id=${child_id}`;
    }
    console.log('[GetActivityDetailApi] Requesting URL:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    console.log('[GetActivityDetailApi] Response:', parsed);

    if (parsed?.status === 1) {
      return parsed.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[GetActivityDetailApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

const GetWeeklyFocusApi = async (
  child_id: number,
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.focus}/weekly?child_id=${child_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed) {
      return parsed; // Returning full response as focus might have different structure
    } else {
      return null;
    }
  } catch (error) {
    console.error('[GetWeeklyFocusApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

const GetWeeklyReportsApi = async (
  child_id: number,
  setLoading: (loading: boolean) => void,
  period: string = 'weekly'
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const url = `${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.reports}/weekly?child_id=${child_id}&period=${period}`;
    console.log('[GetWeeklyReportsApi] Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    console.log('[GetWeeklyReportsApi] Response:', JSON.stringify(parsed, null, 2));

    if (parsed) {
      return parsed;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[GetWeeklyReportsApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

const ExportReportDataApi = async (
  child_id: number,
  setLoading: (loading: boolean) => void,
  period: string = 'weekly'
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const url = `${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.exportData}?child_id=${child_id}&period=${period}`;
    console.log('[ExportReportDataApi] Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const textLine = await response.text();
    console.log('[ExportReportDataApi] Raw response:', textLine);

    let parsed: any;
    try {
      parsed = JSON.parse(textLine);
      const urlValue = parsed?.data?.pdf_url || parsed?.data?.url;
      if (typeof urlValue === 'string') {
        const cleanedUrl = urlValue.startsWith('blob:') ? urlValue.replace('blob:', '') : urlValue;
        if (!parsed.data) parsed.data = {};
        parsed.data.url = cleanedUrl;
        parsed.data.pdf_url = cleanedUrl;
      }
    } catch (e) {
      let url = textLine;
      if (textLine.startsWith('blob:')) {
        url = textLine.replace('blob:', '');
      }
      parsed = { status: 1, data: { url, pdf_url: url } };
    }

    console.log('[ExportReportDataApi] Final parsed:', JSON.stringify(parsed, null, 2));

    if (parsed) {
      return parsed;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[ExportReportDataApi] error:', error);
    return null;
  } finally {
    setLoading(false);
  }
};

const ExportReportPdfApi = async (
  child_id: number,
  setLoading: (loading: boolean) => void,
  period: string = 'weekly'
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const url = `${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.exportPdf}?child_id=${child_id}&period=${period}`;
    console.log('[ExportReportPdfApi] Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const textLine = await response.text();
    console.log('[ExportReportPdfApi] Raw response:', textLine);

    let parsed: any;
    try {
      parsed = JSON.parse(textLine);
      const urlValue = parsed?.data?.pdf_url || parsed?.data?.url;
      if (typeof urlValue === 'string') {
        const cleanedUrl = urlValue.startsWith('blob:') ? urlValue.replace('blob:', '') : urlValue;
        if (!parsed.data) parsed.data = {};
        parsed.data.url = cleanedUrl;
        parsed.data.pdf_url = cleanedUrl;
      }
    } catch (e) {
      let url = textLine;
      if (textLine.startsWith('blob:')) {
        url = textLine.replace('blob:', '');
      }
      parsed = { status: 1, data: { url, pdf_url: url } };
    }

    console.log('[ExportReportPdfApi] Final parsed:', JSON.stringify(parsed, null, 2));

    if (parsed) {
      return parsed;
    } else {
      return null;
    }
  } catch (error) {
    console.error('[ExportReportPdfApi] error:', error);
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

export const StartActivityApi = async (
  activity_id: number,
  child_id: number,
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const url = `${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.activities}/${activity_id}/start?child_id=${child_id}`;
    console.log('[StartActivityApi] Requesting URL:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    console.log('[StartActivityApi] Response:', parsed);
    if (parsed?.status === 1) {
      return parsed.data;
    } else {
      errorToast(parsed?.message || 'Failed to start activity');
      return null;
    }
  } catch (error) {
    console.error('[StartActivityApi] error:', error);
    errorToast('Network error');
    return null;
  } finally {
    setLoading(false);
  }
};

export const CompleteActivityApi = async (
  activity_id: number,
  session_id: number,
  child_id: number,
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const url = `${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.activities}/${activity_id}/complete?session_id=${session_id}&child_id=${child_id}`;
    console.log('[CompleteActivityApi] Requesting URL:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    console.log('[CompleteActivityApi] Response:', parsed);
    if (parsed?.status === 1) {
      successToast(parsed?.message || 'Activity completed successfully');
      return parsed.data;
    } else {

      errorToast(parsed?.message || 'Failed to complete activity');
      return null;
    }
  } catch (error) {
    console.error('[CompleteActivityApi] error:', error);
    errorToast('Network error');
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetNotificationsApi = async (
  setLoading: (loading: boolean) => void
): Promise<any[] | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.notifications}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      return parsed.data;
    } else {
      errorToast(parsed?.message || 'Failed to fetch notifications');
      return null;
    }
  } catch (error) {
    console.error('[GetNotificationsApi] error:', error);
    errorToast('Network error');
    return null;
  } finally {
    setLoading(false);
  }
};

export const MarkNotificationReadApi = async (
  notificationId: number,
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.notifications}/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      return parsed.data;
    } else {
      errorToast(parsed?.message || 'Failed to mark notification as read');
      return null;
    }
  } catch (error) {
    console.error('[MarkNotificationReadApi] error:', error);
    errorToast('Network error');
    return null;
  } finally {
    setLoading(false);
  }
};

export const GetDailyPromptApi = async (
  childId: number,
  setLoading: (loading: boolean) => void
): Promise<any | null> => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BUBBLEBLOOM_BASE_URL}/${commonEndpoints.dailyPrompt}?child_id=${childId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    if (parsed?.status === 1) {
      return parsed.data;
    } else {
      // Don't show toast for daily prompt failure to avoid annoying user on dashboard
      return null;
    }
  } catch (error) {
    console.error('[GetDailyPromptApi] error:', error);
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
  GetActivitiesApi,
  GetActivityDetailApi,
  GetWeeklyFocusApi,
  GetWeeklyReportsApi,
  ExportReportDataApi,
  ExportReportPdfApi,
  StartActivityApi,
  CompleteActivityApi,
  GetNotificationsApi,
  MarkNotificationReadApi,
  GetDailyPromptApi,
};