import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyPageSidebar from '../components/MyPageSidebar';
import MyProfileTab from '../components/MyProfileTab';
import MyAchievementsTab from '../components/MyAchievementsTab';
import MyPostsTab from '../components/MyPostsTab';
import MyLikedFestivalsTab from '../components/MyLikedFestivalsTab';
import MyInquiryTab from '../components/MyInquiryTab';
import MySavedPlansTab from '../components/MySavedPlansTab';
import MyAccountSettingsTab from '../components/MyAccountSettingsTab';
import MyNotificationsTab from '../components/MyNotificationsTab';
import useAuthStore from '../../../store/useAuthStore';
import { getMemberProfile } from '../../../api/memberApi';
import { getMyPost } from '../../../api/boardApi';
import LoginMessage from '../../../components/LoginMessage';

const MyPage = () => {
  const { user, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(!isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  }, [isLoggedIn]);
  

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const userId = user.member_id || user.id;
      const resp = await getMemberProfile(userId);
      setUserDetails(resp.data);
     
    } catch (error) {
      console.error('마이페이지 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && (user?.member_id || user?.id)) {
      fetchUserData();
    }
  }, [isLoggedIn, user?.member_id, user?.id]);

  const renderTabContent = () => {
    if (isLoading && !userDetails) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return <MyProfileTab userDetails={userDetails} onRefresh={fetchUserData} />;
      case 'achievements':
        return <MyAchievementsTab />;
      case 'posts':
        return <MyPostsTab  />;
      case 'saved-plans':
        return <MySavedPlansTab />;
      case 'likes':
        return <MyLikedFestivalsTab userDetails={userDetails} onRefresh={fetchUserData} />;
      case 'inquiry':
        return <MyInquiryTab />;
      case 'account':
        return <MyAccountSettingsTab userDetails={userDetails} onRefresh={fetchUserData} />;
      case 'notifications':
        return <MyNotificationsTab />;
      default:
        return <MyProfileTab userDetails={userDetails} onRefresh={fetchUserData} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginMessage
        isOpen={isLoginModalOpen}
        onClose={() => navigate('/')}
      />
    );
  }

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
