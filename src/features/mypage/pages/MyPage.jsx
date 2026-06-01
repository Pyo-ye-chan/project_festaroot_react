import React, { useState } from 'react';
import MyPageSidebar from '../components/MyPageSidebar';
import MyProfileTab from '../components/MyProfileTab';
import MyAchievementsTab from '../components/MyAchievementsTab';
import MyPostsTab from '../components/MyPostsTab';
import MyLikedFestivalsTab from '../components/MyLikedFestivalsTab';
import MyInquiryTab from '../components/MyInquiryTab';
import MySavedPlansTab from '../components/MySavedPlansTab';
import MyAccountSettingsTab from '../components/MyAccountSettingsTab';
import MyNotificationsTab from '../components/MyNotificationsTab';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Hardcoded data for demonstration
  const user = {
    nickname: '축제요정',
    email: 'festival_lover@example.com',
    joinDate: '2024.01.15',
    profileImg: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    level: 3,
    rank: '축제 마스터',
    currentExp: 450,
    nextLevelExp: 600,
    interests: {
      regions: ['서울', '강원', '제주'],
      themes: ['전통문화', 'K-POP', '불꽃놀이', '지역맛집']
    },
    stats: {
      posts: 12,
      comments: 45,
      likes: 8
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <MyProfileTab user={user} />;
      case 'achievements':
        return <MyAchievementsTab />;
      case 'posts':
        return <MyPostsTab postsCount={user.stats.posts} />;
      case 'saved-plans':
        return <MySavedPlansTab />;
      case 'likes':
        return <MyLikedFestivalsTab likesCount={user.stats.likes} />;
      case 'inquiry':
        return <MyInquiryTab />;
      case 'account':
        return <MyAccountSettingsTab user={user} />;
      case 'notifications':
        return <MyNotificationsTab />;
      default:
        return <MyProfileTab user={user} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-0 sm:px-6 lg:px-8 py-0 sm:py-10 flex-grow flex flex-col">
        <div className="flex flex-col md:flex-row bg-white sm:rounded-[32px] shadow-none sm:shadow-xl sm:shadow-gray-200/50 sm:border border-gray-100 overflow-hidden flex-grow">
          {/* Sidebar */}
          <MyPageSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Area */}
          <main className="flex-grow p-4 sm:p-6 md:p-10 bg-gray-50/20">
            <div className="max-w-4xl mx-auto h-full">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
