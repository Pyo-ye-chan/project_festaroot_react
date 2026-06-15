import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GatheringHeader = ({ onOpenModal }) => {

  const navigate = useNavigate();

  const handleCreateClick = () => {

    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);
    const userId = user?.userId || user?.id || user?.member_id;

    // 유저 정보가 없다면 (비로그인 상태)
    if (!storedUser) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    // 로그인 된 상태라면 상위 컴포넌트의 모달 열기 함수 실행
    onOpenModal();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">모임</h2>
        <p className="text-gray-500 font-medium">다양한 축제 메이트와 소통을 시작해보세요.</p>
      </div>
      <button
        onClick={handleCreateClick}
        className="h-14 px-8 bg-[var(--festival-purple)] text-white rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-[var(--festival-purple-soft)] transition-all shadow-xl shadow-[var(--festival-purple)]/20 active:scale-95"
      >
        <PlusCircle className="w-5 h-5" />
        자유 모임 만들기
      </button>
    </div>
  )
};

export default GatheringHeader;
