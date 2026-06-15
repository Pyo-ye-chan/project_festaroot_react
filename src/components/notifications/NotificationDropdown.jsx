import React from 'react';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ isOpen, onClose, notifications }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-100 rounded-[24px] shadow-2xl z-50 overflow-hidden transition-all duration-300 origin-top-right
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
        <h3 className="text-lg font-black text-gray-900">알림 센터</h3>
        {unreadCount > 0 && (
          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-600 text-xs font-black rounded-full">
            {unreadCount}개 안읽음
          </span>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto bg-white custom-scrollbar">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-sm font-bold text-gray-400">새로운 알림이 없습니다.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50/50 text-center border-t border-gray-50">
        <Link 
          to="/mypage?tab=notifications" 
          onClick={onClose}
          className="text-xs font-black text-purple-600 hover:text-purple-700 transition-colors"
        >
          전체 알림 보기
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
