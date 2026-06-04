import React from 'react';
import { Construction, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommunitySidebar from '../components/CommunitySidebar';

const GatheringPage = () => {
  const navigate = useNavigate();

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
            <div className="max-w-md w-full text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              
              <div className="w-24 h-24 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Construction className="w-12 h-12 text-purple-600 animate-bounce" />
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">모임 페이지 준비 중</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  축제 메이트를 찾는 멋진 기능을 준비하고 있어요! <br />
                  조금만 기다려 주시면 곧 찾아뵙겠습니다.
                </p>
              </div>

              <button 
                onClick={() => navigate(-1)}
                className="w-full py-4 bg-gray-50 text-gray-600 font-black rounded-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 border border-gray-100 hover:border-purple-600 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                돌아가기
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GatheringPage;
