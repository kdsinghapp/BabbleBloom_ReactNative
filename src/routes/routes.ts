import OnboardingScreen from "../screen/auth/Onboarding/Onboarding";
import ScreenNameEnum from "./screenName.enum";
import NotificationsScreen from "../screen/Notification/Notification";
import Sinup from "../screen/auth/sinup/Sinup";
import ChangePassword from "../screen/Profile/ChangePassword/ChangePassword";
import HelpScreen from "../screen/Profile/Help/Helps";
import Splash from "../screen/auth/Splash/Splash";
import PhoneLogin from "../screen/auth/PhoneLogin/PhoneLogin";
import OtpScreen from "../screen/auth/OTPScreen/OtpScreen";
import LegalPoliciesScreen from "../screen/Profile/LegalPoliciesScreen";
import PrivacyPolicy from "../screen/Profile/PrivacyPolicy";
import EditProfile from "../screen/Profile/EditProfile/EditProfile";
import MyProfile from "../screen/auth/MyProfile/MyProfile";
import HomeDashboard from "../screen/BottomTab/DashBoard/HomeDashboard";
import AddNewScript from "../screen/BottomTab/DashBoard/AddNewScript/AddNewScript";
import ParentInfoScreen from "../screen/Profile/ParentInfo/ParentInfoScreen";
import ProgressScreen from "../screen/BottomTab/Progress/ProgressScreen";
import LibraryScreen from "../screen/BottomTab/LibraryScreen/LibraryScreen";
import Activity from "../screen/BottomTab/Activity/Activity";
import ActivityViewDetails from "../screen/BottomTab/ActivityViewDetails/ActivityViewDetails";
import MoreViewDetails from "../screen/BottomTab/MoreViewDetails/MoreViewDetails";
import ScriptDetailsScreen from "../screen/BottomTab/ScriptDetailsScreen/ScriptDetailsScreen";
import BirdNestRescueScreen from "../screen/BottomTab/BirdNestRescueScreen/BirdNestRescueScreen";
import ProfileSetting from "../screen/BottomTab/ProfileSetting/ProfileSetting";
import FAQs from "../screen/Profile/FAQ/FAQs";
import SupportScreen from "../screen/BottomTab/SupportScreen/SupportScreen";

const _routes: any = {
  REGISTRATION_ROUTE: [
    {
      name: ScreenNameEnum.SPLASH_SCREEN,
      Component: Splash,
    },
    {
      name: ScreenNameEnum.Sinup,
      Component: Sinup,
    },






    {
      name: ScreenNameEnum.MyProfile,
      Component: MyProfile,
    },
    {
      name: ScreenNameEnum.ProfileSetting,
      Component: ProfileSetting,
    },


    {
      name: ScreenNameEnum.OnboardingScreen,
      Component: OnboardingScreen,
    },

    {
      name: ScreenNameEnum.FAQs,
      Component: FAQs,
    },

    {
      name: ScreenNameEnum.SupportScreen,
      Component: SupportScreen,
    },


    {
      name: ScreenNameEnum.LibraryScreen,
      Component: LibraryScreen,
    },

    {
      name: ScreenNameEnum.MoreViewDetails,
      Component: MoreViewDetails,
    },

    {
      name: ScreenNameEnum.ScriptDetailsScreen,
      Component: ScriptDetailsScreen,
    },

    {
      name: ScreenNameEnum.BirdNestRescueScreen,
      Component: BirdNestRescueScreen,
    },


    {
      name: ScreenNameEnum.ActivityViewDetails,
      Component: ActivityViewDetails,
    },


    {
      name: ScreenNameEnum.Activity,
      Component: Activity,
    },


    {
      name: ScreenNameEnum.EditProfile,
      Component: EditProfile,
    },
    {
      name: ScreenNameEnum.OtpScreen,
      Component: OtpScreen,
    },
    {
      name: ScreenNameEnum.ProgressScreen,
      Component: ProgressScreen,
    },


    {
      name: ScreenNameEnum.PhoneLogin,
      Component: PhoneLogin,
    },

    {
      name: ScreenNameEnum.changePassword,
      Component: ChangePassword,
    },

    {
      name: ScreenNameEnum.Help,
      Component: HelpScreen,
    },


    {
      name: ScreenNameEnum.PrivacyPolicy,
      Component: PrivacyPolicy,
    },
    {
      name: ScreenNameEnum.HomeDashboard,
      Component: HomeDashboard,
    },
    {
      name: ScreenNameEnum.LegalPoliciesScreen,
      Component: LegalPoliciesScreen,
    },

    {
      name: ScreenNameEnum.NotificationsScreen,
      Component: NotificationsScreen,
    },


    {
      name: ScreenNameEnum.AddNewScript,
      Component: AddNewScript,
    },
    {
      name: ScreenNameEnum.ParentInfo,
      Component: ParentInfoScreen,
    },



    //    {
    //   name: ScreenNameEnum.DocumentShow,
    //   Component: DocumentShow,
    // },

  ],


};

export default _routes;
