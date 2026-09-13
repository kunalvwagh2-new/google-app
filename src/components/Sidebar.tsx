import React from 'react';
import { DesktopSidebar } from './navigation/sidebar.tsx';
import { User } from '../types.ts';
import { SupportedLanguage } from '../types/anant.ts';

interface SidebarProps {
  currentUser: User | null;
  activeTab: string;
  onSelectTab: (tab: string, path?: string) => void;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  pendingRequestsCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  language = 'EN',
  onLanguageChange = () => {},
  pendingRequestsCount = 0,
  onLogout,
}) => {
  return (
    <DesktopSidebar
      currentUser={currentUser}
      activeTab={activeTab}
      onSelectTab={onSelectTab}
      language={language}
      onLanguageChange={onLanguageChange}
      pendingRequestsCount={pendingRequestsCount}
      onLogout={onLogout}
    />
  );
};

export default Sidebar;
