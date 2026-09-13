import React from 'react';
import { Deity } from '../../types/anant.ts';
import JaapMalaPage from '../../app/jaap/page.tsx';

interface JaapRosaryViewProps {
  initialDeity?: Deity;
  currentUserId?: string;
  currentUserName?: string;
  onPublishToFeed?: (content: string, milestoneData: any) => void;
  onBackToHome?: () => void;
}

export function JaapRosaryView({
  initialDeity,
  currentUserId,
  currentUserName,
  onPublishToFeed,
  onBackToHome,
}: JaapRosaryViewProps) {
  return (
    <JaapMalaPage
      initialDeityName={initialDeity?.nameEn || 'Lord Krishna / Vitthala'}
      initialMantraName={
        initialDeity?.popularMantras[0]
          ? `Om ${initialDeity.popularMantras[0]}`
          : 'Hare Krishna Hare Rama Mahamantra'
      }
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      onPublishToFeed={onPublishToFeed}
      onBackToHome={onBackToHome}
    />
  );
}

export default JaapRosaryView;
