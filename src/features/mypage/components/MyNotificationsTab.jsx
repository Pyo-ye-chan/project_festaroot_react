import React, { useState } from 'react';

const MyNotificationsTab = () => {
  // Hardcoded initial states for toggles
  const [settings, setSettings] = useState({
    pushEnabled: true,
    activityComments: true,
    activityLikes: false,
    serviceNotice: true,
    marketing: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ active, onClick }) => (
    <button 
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        active ? 'bg-purple-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          active ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <header className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">알림 설정</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">서비스 이용에 필요한 알림 권한을 관리하세요.</p>
      </header>

      <div className="space-y-6">
        {/* Master Push Switch */}
        <section className="bg-purple-50 p-6 sm:p-8 rounded-[32px] border border-purple-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              {settings.pushEnabled ? '🔔' : '🔕'}
            </div>
            <div>
              <h3 className="text-lg font-black text-purple-900">푸시 알림 전체 허용</h3>
              <p className="text-sm text-purple-600 font-medium">모든 서비스 알림을 실시간으로 받아봅니다.</p>
            </div>
          </div>
          <Toggle active={settings.pushEnabled} onClick={() => toggleSetting('pushEnabled')} />
        </section>

        {/* Activity Notifications */}
        <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <span className="text-xl">💬</span> 활동 알림
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">내 게시글 댓글 알림</p>
                <p className="text-xs text-gray-500 mt-0.5">내가 쓴 글에 새로운 댓글이 달리면 알려드립니다.</p>
              </div>
              <Toggle active={settings.activityComments} onClick={() => toggleSetting('activityComments')} />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div>
                <p className="font-bold text-gray-800">좋아요 알림</p>
                <p className="text-xs text-gray-500 mt-0.5">내 콘텐츠가 다른 유저에게 좋아요를 받으면 알려드립니다.</p>
              </div>
              <Toggle active={settings.activityLikes} onClick={() => toggleSetting('activityLikes')} />
            </div>
          </div>
        </section>

        {/* Service Notifications */}
        <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <span className="text-xl">📢</span> 서비스 소식
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">공지사항 및 업데이트</p>
                <p className="text-xs text-gray-500 mt-0.5">축제로 서비스의 주요 공지와 기능 업데이트를 알려드립니다.</p>
              </div>
              <Toggle active={settings.serviceNotice} onClick={() => toggleSetting('serviceNotice')} />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div>
                <p className="font-bold text-gray-800">마케팅 및 혜택 알림</p>
                <p className="text-xs text-gray-500 mt-0.5">맞춤 축제 정보 및 이벤트 혜택 소식을 받아보세요.</p>
              </div>
              <Toggle active={settings.marketing} onClick={() => toggleSetting('marketing')} />
            </div>
          </div>
        </section>

        <div className="px-4 text-center">
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            알림 설정은 기기별 설정에 따라 실제 수신 여부가 달라질 수 있습니다.<br/>
            중요한 공지 및 결제 관련 알림은 설정과 관계없이 발송될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyNotificationsTab;
