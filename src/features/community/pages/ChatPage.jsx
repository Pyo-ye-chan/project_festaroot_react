import React from 'react';
import CommunitySidebar from '../components/CommunitySidebar';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FD] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Grid Layout - Sidebar on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (3 cols) */}
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          {/* Main Content (9 cols) */}
          <div className="lg:col-span-9 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="p-8 bg-white rounded-[3rem] shadow-sm border border-gray-100 min-h-[500px] w-full flex items-center justify-center">
              <h2 className="text-3xl font-black text-gray-900">채팅 페이지 (준비 중)</h2>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;
