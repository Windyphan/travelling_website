import React from 'react';
import {
  FiUser as FiUserOriginal,
  FiMail as FiMailOriginal,
  FiLock as FiLockOriginal,
  FiEye as FiEyeOriginal,
  FiEyeOff as FiEyeOffOriginal,
  FiPhone as FiPhoneOriginal,
  FiMapPin as FiMapPinOriginal,
  FiCalendar as FiCalendarOriginal,
  FiClock as FiClockOriginal,
  FiUsers as FiUsersOriginal,
  FiStar as FiStarOriginal,
  FiFilter as FiFilterOriginal,
  FiSearch as FiSearchOriginal,
  FiGrid as FiGridOriginal,
  FiList as FiListOriginal,
  FiMenu as FiMenuOriginal,
  FiX as FiXOriginal,
  FiLogOut as FiLogOutOriginal,
  FiSettings as FiSettingsOriginal,
  FiEdit3 as FiEdit3Original,
  FiSave as FiSaveOriginal,
  FiCheck as FiCheckOriginal,
  FiCamera as FiCameraOriginal,
  FiPlay as FiPlayOriginal,
  FiArrowRight as FiArrowRightOriginal,
  FiCreditCard as FiCreditCardOriginal,
  FiDownload as FiDownloadOriginal,
  FiBarChart as FiBarChartOriginal,
  FiFacebook as FiFacebookOriginal,
  FiInstagram as FiInstagramOriginal,
  FiTwitter as FiTwitterOriginal,
  FiPlus as FiPlusOriginal,
  FiTrash2 as FiTrash2Original,
  FiSun as FiSunOriginal,
  FiMoon as FiMoonOriginal,
  FiChevronDown as FiChevronDownOriginal,
  FiDollarSign as FiDollarSignOriginal,
} from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';

// Create a wrapper component for icons that works with React 19
interface IconProps {
  icon: React.ComponentType<IconBaseProps>;
  className?: string;
  onClick?: () => void;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ icon: IconComponent, className, onClick, size }) => {
  return React.createElement(IconComponent, { className, onClick, size });
};

// Create functional components that properly wrap the original icons
export const FiUser: React.FC<IconBaseProps> = (props) => <FiUserOriginal {...props} />;
export const FiMail: React.FC<IconBaseProps> = (props) => <FiMailOriginal {...props} />;
export const FiLock: React.FC<IconBaseProps> = (props) => <FiLockOriginal {...props} />;
export const FiEye: React.FC<IconBaseProps> = (props) => <FiEyeOriginal {...props} />;
export const FiEyeOff: React.FC<IconBaseProps> = (props) => <FiEyeOffOriginal {...props} />;
export const FiPhone: React.FC<IconBaseProps> = (props) => <FiPhoneOriginal {...props} />;
export const FiMapPin: React.FC<IconBaseProps> = (props) => <FiMapPinOriginal {...props} />;
export const FiCalendar: React.FC<IconBaseProps> = (props) => <FiCalendarOriginal {...props} />;
export const FiClock: React.FC<IconBaseProps> = (props) => <FiClockOriginal {...props} />;
export const FiUsers: React.FC<IconBaseProps> = (props) => <FiUsersOriginal {...props} />;
export const FiStar: React.FC<IconBaseProps> = (props) => <FiStarOriginal {...props} />;
export const FiFilter: React.FC<IconBaseProps> = (props) => <FiFilterOriginal {...props} />;
export const FiSearch: React.FC<IconBaseProps> = (props) => <FiSearchOriginal {...props} />;
export const FiGrid: React.FC<IconBaseProps> = (props) => <FiGridOriginal {...props} />;
export const FiList: React.FC<IconBaseProps> = (props) => <FiListOriginal {...props} />;
export const FiMenu: React.FC<IconBaseProps> = (props) => <FiMenuOriginal {...props} />;
export const FiX: React.FC<IconBaseProps> = (props) => <FiXOriginal {...props} />;
export const FiLogOut: React.FC<IconBaseProps> = (props) => <FiLogOutOriginal {...props} />;
export const FiSettings: React.FC<IconBaseProps> = (props) => <FiSettingsOriginal {...props} />;
export const FiEdit3: React.FC<IconBaseProps> = (props) => <FiEdit3Original {...props} />;
export const FiSave: React.FC<IconBaseProps> = (props) => <FiSaveOriginal {...props} />;
export const FiCheck: React.FC<IconBaseProps> = (props) => <FiCheckOriginal {...props} />;
export const FiCamera: React.FC<IconBaseProps> = (props) => <FiCameraOriginal {...props} />;
export const FiPlay: React.FC<IconBaseProps> = (props) => <FiPlayOriginal {...props} />;
export const FiArrowRight: React.FC<IconBaseProps> = (props) => <FiArrowRightOriginal {...props} />;
export const FiCreditCard: React.FC<IconBaseProps> = (props) => <FiCreditCardOriginal {...props} />;
export const FiDownload: React.FC<IconBaseProps> = (props) => <FiDownloadOriginal {...props} />;
export const FiBarChart: React.FC<IconBaseProps> = (props) => <FiBarChartOriginal {...props} />;
export const FiFacebook: React.FC<IconBaseProps> = (props) => <FiFacebookOriginal {...props} />;
export const FiInstagram: React.FC<IconBaseProps> = (props) => <FiInstagramOriginal {...props} />;
export const FiTwitter: React.FC<IconBaseProps> = (props) => <FiTwitterOriginal {...props} />;
export const FiPlus: React.FC<IconBaseProps> = (props) => <FiPlusOriginal {...props} />;
export const FiTrash2: React.FC<IconBaseProps> = (props) => <FiTrash2Original {...props} />;
export const FiSun: React.FC<IconBaseProps> = (props) => <FiSunOriginal {...props} />;
export const FiMoon: React.FC<IconBaseProps> = (props) => <FiMoonOriginal {...props} />;
export const FiChevronDown: React.FC<IconBaseProps> = (props) => <FiChevronDownOriginal {...props} />;
export const FiDollarSign: React.FC<IconBaseProps> = (props) => <FiDollarSignOriginal {...props} />;

// Export an object with all icons for easier imports
export const Icons = {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiStar,
  FiFilter,
  FiSearch,
  FiGrid,
  FiList,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings,
  FiEdit3,
  FiSave,
  FiCheck,
  FiCamera,
  FiPlay,
  FiArrowRight,
  FiCreditCard,
  FiDownload,
  FiBarChart,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiPlus,
  FiTrash2,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiDollarSign,
};
