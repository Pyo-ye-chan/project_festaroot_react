import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, CalendarDays, Users, ChevronLeft, MessageCircle } from 'lucide-react';
import CommunitySidebar from '../../community/components/CommunitySidebar';

const GatheringDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Data for a single gathering
  const gathering = {
    id: parseInt(id),
    title: '부산 록 페스티벌 같이 즐길 사람?!',
    festival: '부산 록 페스티벌',
    description: '8월 10일에 열리는 부산 록 페스티벌에 함께 갈 파티원을 모집합니다! 같이 신나게 놀고, 맛있는 것도 먹어요. 락 음악을 좋아하고 새로운 친구를 만나고 싶은 분들 환영합니다!',
    date: '2024년 8월 10일 (토)',
    location: '부산 삼락생태공원',
    current: 3,
    max: 5,
    author: '락앤롤',
    authorId: 1,
    createdAt: '2024.07.20 14:30',
    image: 'https://picsum.photos/seed/gatheringdetail/800/400',
    participantsList: [
      { id: 1, name: '락앤롤', avatar: 'https://picsum.photos/seed/avatar1/50/50' },
      { id: 2, name: '페스티벌퀸', avatar: 'https://picsum.photos/seed/avatar2/50/50' },
      { id: 3, name: '음악사랑', avatar: 'https://picsum.photos/seed/avatar3/50/50' },
    ],
  };

  if (!gathering) {
    return (
      <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] flex justify-center items-center">
        <p className="text-gray-700 text-lg">모임을 찾을 수 없습니다.</p>
      </div>
    );
  }

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
              {gathering.image && (
                <img src={gathering.image} alt={gathering.title} className="w-full h-80 object-cover rounded-2xl mb-6" />
              )}

              <h1 className="text-3xl font-black text-gray-900 mb-4">{gathering.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-lg mb-6">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.current}/{gathering.max}명
                </span>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                <p>{gathering.description}</p>
                {gathering.festival && (
                    <p className="mt-4 text-sm font-bold text-gray-500">
                        관련 축제: <span className="text-[var(--festival-purple)]">{gathering.festival}</span>
                    </p>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">참여자 ({gathering.current}명)</h3>
                <div className="flex flex-wrap gap-3">
                  {gathering.participantsList.map(participant => (
                    <div key={participant.id} className="flex items-center gap-2">
                      <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--festival-yellow)]" />
                      <span className="text-sm font-medium text-gray-700">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  채팅 참여
                </button>
                <button
                  className="inline-flex items-center px-6 py-3 border border-transparent text-white font-bold rounded-full shadow-sm bg-[var(--festival-purple)] hover:bg-[var(--festival-purple-soft)] transition-colors active:scale-95"
                >
                  모임 참여하기
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