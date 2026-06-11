import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, CalendarDays, Users, ChevronLeft, MessageCircle } from 'lucide-react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import gatheringApi from '../../../api/gatheringApi'; // API 불러오기

const GatheringDetailPage = () => {
  const { id } = useParams(); // URL의 : room_id 값 추출
  const navigate = useNavigate();

  // 💡 실제 백엔드 데이터를 담을 상태관리 정의
  const [gathering, setGathering] = useState(null);
  const [loading, setLoading] = useState(true);

  // 💡 컴포넌트 로드시 백엔드 데이터 Fetch
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await gatheringApi.gatheringDetail(id);
        setGathering(data);
      } catch (error) {
        console.error("모임 상세 정보를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  // 1. 로딩 중일 때 UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--warm-white)] flex justify-center items-center">
        <div className="text-gray-500 font-bold text-xl animate-pulse">모임 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  // 2. 데이터를 찾지 못했을 때 UI
  if (!gathering) {
    return (
      <div className="min-h-screen bg-[var(--warm-white)] flex justify-center items-center">
        <p className="text-gray-700 text-lg font-bold">존재하지 않거나 삭제된 모임입니다.</p>
      </div>
    );
  }

  // 💡 참여자 명단 더미데이터 (참여자 목록 API 연동 전까지 임시 방어용)
  const dummyParticipants = [
    { id: 1, name: gathering.nickname || '방장', avatar: gathering.profile_image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner' },
    { id: 2, name: '페스티벌퀸', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
  ];

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9 space-y-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-[var(--festival-purple)] font-medium mb-4 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              목록으로 돌아가기
            </button>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              {/* 모임 메인 이미지 (우선 만든 사람 프로필 주소 매핑, 없을시 기본 썸네일) */}
              <img 
                src={gathering.profile_image_url || 'https://picsum.photos/seed/gathering/800/400'} 
                alt={gathering.room_title} 
                className="w-full h-80 object-cover rounded-2xl mb-6" 
              />

              {/* 백엔드 스네이크 케이스 필드 매핑 완료 */}
              <h1 className="text-3xl font-black text-gray-900 mb-4">{gathering.room_title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-lg mb-6">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.free_date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.free_location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.current_count || 1}/{gathering.max_capacity}명
                </span>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                <p>{gathering.room_description}</p>
              </div>

              {/* 참여자 명단 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">참여자 ({gathering.current_count || 1}명)</h3>
                <div className="flex flex-wrap gap-3">
                  {dummyParticipants.map(participant => (
                    <div key={participant.id} className="flex items-center gap-2">
                      <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--festival-yellow)]" />
                      <span className="text-sm font-medium text-gray-700">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 통합된 단일 참여 버튼 */}
              <div className="flex justify-end">
                <button
                  className="inline-flex items-center px-8 py-3.5 border border-transparent text-white font-black rounded-full shadow-lg shadow-purple-100 bg-[var(--festival-purple)] hover:bg-[var(--festival-purple-soft)] transition-all active:scale-95 text-base group"
                >
                  <MessageCircle className="w-5 h-5 mr-2 animate-bounce group-hover:animate-none" />
                  모임 참여 및 채팅방 입장하기
                </button>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GatheringDetailPage;