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
const createIconComponent = (OriginalIcon: any) => {
  const IconComponent: React.FC<IconBaseProps> = (props) => {
    return React.createElement(OriginalIcon, props);
  };
  IconComponent.displayName = OriginalIcon.displayName || OriginalIcon.name;
  return IconComponent;
};

// Export individual icon components
export const FiUser = createIconComponent(FiUserOriginal);
export const FiMail = createIconComponent(FiMailOriginal);
export const FiLock = createIconComponent(FiLockOriginal);
export const FiEye = createIconComponent(FiEyeOriginal);
export const FiEyeOff = createIconComponent(FiEyeOffOriginal);
export const FiPhone = createIconComponent(FiPhoneOriginal);
export const FiMapPin = createIconComponent(FiMapPinOriginal);
export const FiCalendar = createIconComponent(FiCalendarOriginal);
export const FiClock = createIconComponent(FiClockOriginal);
export const FiUsers = createIconComponent(FiUsersOriginal);
export const FiStar = createIconComponent(FiStarOriginal);
export const FiFilter = createIconComponent(FiFilterOriginal);
export const FiSearch = createIconComponent(FiSearchOriginal);
export const FiGrid = createIconComponent(FiGridOriginal);
export const FiList = createIconComponent(FiListOriginal);
export const FiMenu = createIconComponent(FiMenuOriginal);
export const FiX = createIconComponent(FiXOriginal);
export const FiLogOut = createIconComponent(FiLogOutOriginal);
export const FiSettings = createIconComponent(FiSettingsOriginal);
export const FiEdit3 = createIconComponent(FiEdit3Original);
export const FiSave = createIconComponent(FiSaveOriginal);
export const FiCheck = createIconComponent(FiCheckOriginal);
export const FiCamera = createIconComponent(FiCameraOriginal);
export const FiPlay = createIconComponent(FiPlayOriginal);
export const FiArrowRight = createIconComponent(FiArrowRightOriginal);
export const FiCreditCard = createIconComponent(FiCreditCardOriginal);
export const FiDownload = createIconComponent(FiDownloadOriginal);
export const FiBarChart = createIconComponent(FiBarChartOriginal);
export const FiFacebook = createIconComponent(FiFacebookOriginal);
export const FiInstagram = createIconComponent(FiInstagramOriginal);
export const FiTwitter = createIconComponent(FiTwitterOriginal);
export const FiPlus = createIconComponent(FiPlusOriginal);
export const FiTrash2 = createIconComponent(FiTrash2Original);

// Export commonly used icons in an object for backward compatibility
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
} as const;
