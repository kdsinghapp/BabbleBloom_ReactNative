import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { GetChildrenApi, GetProfileApi, GetScriptsApi, } from '../../../Api/apiRequest';
import { loginSuccess } from '../../../redux/feature/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
 
const useDashboard = () => {
  const navigation = useNavigation();
 
  const [address, setAddress] = useState("");
  const [locationModal, setlocationModal] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentlocation, setcurrentlocation] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const locationRef: any = useRef(null);
  const [children, setChildren] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState<any>(null);
  const [scripts, setScripts] = useState<any[]>([]);

   
 


  useEffect(() => {
    getProfileApi();
    fetchChildren();
  }, []);

 

  useEffect(() => {
    if (activeChild?.id) {
      fetchScripts(activeChild.id);
    }
  }, [activeChild]);

  const getProfileApi = async () => {
    try {
      const response = await GetProfileApi(setLoading);
      if (response) {
        const token = await AsyncStorage.getItem('token') || "";
        dispatch(loginSuccess({ userData: response, token }));
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await GetChildrenApi(setLoading);
      if (response && response.length > 0) {
        setChildren(response);
        setActiveChild(response[0]);
      }
    } catch (error) {
      console.error('[useDashboard] fetchChildren error:', error);
    }
  };

  const fetchScripts = async (childId: number) => {
    const res = await GetScriptsApi(childId, setLoading);
    if (res) {
      setScripts(res);
    }
  };

 
  return {
    navigation,
    address,
    setAddress,
    location,
    setLocation,
    locationModal,
    setlocationModal,
    locationRef,
    currentlocation,
    isLoading,
 
    getParceldetailsApi: 
    children,
    activeChild,
    scripts,
    fetchScripts,
  };
};

export default useDashboard;
