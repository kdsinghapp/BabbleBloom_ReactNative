import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { GetChildrenApi, GetParentProfileApi, GetDashboardHomeApi } from '../../../Api/apiRequest';
import { setUserData } from '../../../redux/feature/authSlice';
import { setSelectedChild } from '../../../redux/feature/childrenSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


const useDashboard = () => {
  const navigation = useNavigation();
  const [address, setAddress] = useState("");
  const [locationModal, setlocationModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const locationRef: any = useRef(null);
  const [children, setChildren] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState<any>(null);
  const [scripts, setScripts] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    getProfileApi();
    fetchChildren();
  }, []);



  useEffect(() => {
    if (activeChild?.id) {
      fetchDashboardHome(activeChild.id);
    }
  }, [activeChild]);

  const getProfileApi = async () => {
    try {
      const response = await GetParentProfileApi(setLoading);
      if (response) {
        const token = await AsyncStorage.getItem('token') || "";
        dispatch(setUserData(response));
        // Also update stored authData if needed, though ProfileSetting handles it via updateReduxProfile
      }
    } catch (error) {
      console.error('[useDashboard] getProfileApi error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await GetChildrenApi(setLoading);
      if (response && response.length > 0) {
        setChildren(response);
        setActiveChild(response[0]);
        // Sync with Redux if not already set or to ensure consistency
        dispatch(setSelectedChild(response[0]));
      }
    } catch (error) {
      console.error('[useDashboard] fetchChildren error:', error);
    }
  };

  const fetchDashboardHome = async (childId: number) => {
    const res = await GetDashboardHomeApi(childId, setLoading);
    if (res) {
      setDashboardData(res);
      setScripts(res.recent_scripts || []);
    }
  };

  return {
    navigation,
    address,
    setAddress,
    locationModal,
    setlocationModal,
    locationRef,
    isLoading,
    getParceldetailsApi: children,
    activeChild,
    scripts,
    fetchScripts: fetchDashboardHome,
    dashboardData,
  };
};

export default useDashboard;
