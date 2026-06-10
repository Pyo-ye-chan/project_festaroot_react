import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  PlusCircle,
  CalendarDays,
  MapPin,
  Sparkles,
  ChevronRight,
  Search,
  MessageSquare,
  LayoutGrid,
  Info
} from 'lucide-react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import CreateGatheringModal from '../../community/components/CreateGatheringModal';

const GatheringPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('전체 모임');
  const [keyword, setKeyword] = useState('');

  const categories = ['전체 모임', '축제별 모임', '자유 모임', '참여중인 모임'];

  // 축제별 모임 (시스템 제공 - 축제당 하나씩 고정된 채팅방/모임)
  const festivalRooms = [
    { 
      id: 101, 
      type: 'festival',
      festivalName: '부산 록 페스티벌', 
      title: '부산 록 페스티벌 공식 오픈 채팅방', 
      location: '부산 삼락생태공원', 
      date: '2026.08.10 - 08.12',
      current: 156, 
      max: 500,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=200',
      isJoined: true
    },
    { 
      id: 102, 
      type: 'festival',
      festivalName: '태안 세계 튤립 축제', 
      title: '태안 튤립 축제 정보 공유 및 메이트 찾기', 
      location: '태안 코리아플라워파크', 
      date: '2026.04.10 - 05.10',
      current: 84, 
      max: 200,
      image: 'https://images.unsplash.com/photo-1554123168-b400f9c806ca?auto=format&fit=crop&q=80&w=200',
      isJoined: false
    },
    { 
      id: 103, 
      type: 'festival',
      festivalName: '서울 재즈 페스티벌', 
      title: '서재페 라인업 공유 및 동행 모집방', 
      location: '서울 올림픽공원', 
      date: '2026.05.28 - 05.30',
      current: 243, 
      max: 1000,
      image: 'https://images.unsplash.com/photo-1514525253361-bee8a19744c1?auto=format&fit=crop&q=80&w=200',
      isJoined: false
    },
  ];

  // 자유 모임 (사용자 생성)
  const freeGatherings = [
    { 
      id: 1, 
      type: 'free',
      title: '이번 주말 한강 치맥 파티 하실 분?! 🍗🍺', 
      date: '2026.06.15', 
      location: '반포 한강공원', 
      current: 7, 
      max: 10,
      creator: { name: '치킨마스터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
      isJoined: true
    },
    { 
      id: 2, 
      type: 'free',
      title: '보드게임 동호회 멤버 모집합니다 🎲', 
      date: '2026.06.20', 
      location: '강남역 인근', 
      current: 3, 
      max: 6,
      creator: { name: '게임광', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe' },
      isJoined: false
    },
    { 
      id: 3, 
      type: 'free',
      title: '경복궁 야간개장 사진 같이 찍어요 🏯', 
      date: '2026.06.18', 
      location: '서울 경복궁', 
      current: 2, 
      max: 4,
      creator: { name: '셔터보이', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
      isJoined: false
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const GatheringItem = ({ item, isFestival }) => (
    <Link 
      to={`/community/gathering/${item.id}`}
      className="flex items-center gap-4 py-3 px-6 hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-none"
    >
      {isFestival ? (
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
          <img src={item.image} alt={item.festivalName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
          <img src={item.creator.avatar} alt={item.creator.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {isFestival && (
            <span className="text-[9px] font-black text-[var(--festival-purple)] bg-purple-50 px-1.5 py-0.5 rounded">
              {item.festivalName}
            </span>
          )}
          {!isFestival && (
            <span className="text-[10px] font-black text-gray-400">
              {item.creator.name}
            </span>
          )}
        </div>
        <h4 className="font-bold text-gray-800 truncate group-hover:text-[var(--festival-purple)] transition-colors text-sm md:text-base">
          {item.title}
        </h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
          {isFestival && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <MapPin className="w-3 h-3" /> {item.location}
            </div>
          )}
          {item.date && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <CalendarDays className="w-3 h-3" /> {item.date}
            </div>
          )}
          <div className="flex items-center gap-1 text-[10px] font-black text-purple-600">
            <Users className="w-3 h-3" /> {item.current}/{item.max}명
          </div>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--festival-purple)] group-hover:translate-x-1 transition-all flex-shrink-0" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">모임</h2>
                <p className="text-gray-500 font-medium">축제 정보 공유부터 번개 모임까지, 다양한 메이트를 만나보세요.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="h-14 px-8 bg-[var(--festival-purple)] text-white rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-[var(--festival-purple-soft)] transition-all shadow-xl shadow-[var(--festival-purple)]/20 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                자유 모임 만들기
              </button>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-6 items-center">
              <div className="flex flex-wrap gap-2 flex-grow">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${
                      activeTab === cat 
                      ? 'bg-[var(--festival-purple)] text-white shadow-lg shadow-purple-100' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full xl:w-80 group">
                <input 
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="모임 제목 검색..." 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-[var(--festival-purple)]/20 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--festival-purple)] w-5 h-5" />
              </div>
            </div>

            {/* Grouped Content */}
            <div className="space-y-10">
              
              {/* 축제별 모임 섹션 */}
              {(activeTab === '전체 모임' || activeTab === '축제별 모임') && (
                <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-2xl text-[var(--festival-purple)]">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">축제별 모임</h3>
                        <p className="text-sm text-gray-500 font-medium">축제 공식 정보를 공유하고 함께할 메이트를 찾으세요.</p>
                      </div>
                    </div>
                    {activeTab === '전체 모임' && (
                      <button 
                        onClick={() => handleTabChange('축제별 모임')}
                        className="flex items-center gap-1 text-sm font-black text-gray-400 hover:text-[var(--festival-purple)] transition-colors group"
                      >
                        더보기 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-50">
                    {festivalRooms.slice(0, activeTab === '전체 모임' ? 3 : festivalRooms.length).map(room => (
                      <GatheringItem key={room.id} item={room} isFestival={true} />
                    ))}
                  </div>
                </section>
              )}

              {/* 자유 모임 섹션 */}
              {(activeTab === '전체 모임' || activeTab === '자유 모임') && (
                <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">자유 모임</h3>
                        <p className="text-sm text-gray-500 font-medium">관심사가 비슷한 사람들끼리 자유롭게 모여보세요.</p>
                      </div>
                    </div>
                    {activeTab === '전체 모임' && (
                      <button 
                        onClick={() => handleTabChange('자유 모임')}
                        className="flex items-center gap-1 text-sm font-black text-gray-400 hover:text-blue-600 transition-colors group"
                      >
                        더보기 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-50">
                    {freeGatherings.slice(0, activeTab === '전체 모임' ? 3 : freeGatherings.length).map(gathering => (
                      <GatheringItem key={gathering.id} item={gathering} isFestival={false} />
                    ))}
                  </div>
                </section>
              )}

              {/* 참여중인 모임 섹션 */}
              {activeTab === '참여중인 모임' && (
                <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-rose-50/50 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-rose-100 rounded-2xl text-rose-500">
                        <LayoutGrid className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">참여중인 모임</h3>
                        <p className="text-sm text-gray-500 font-medium">내가 현재 참여하고 있는 모임 목록입니다.</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[...festivalRooms, ...freeGatherings].filter(i => i.isJoined).map(item => (
                      <GatheringItem key={item.id} item={item} isFestival={item.type === 'festival'} />
                    ))}
                  </div>
                  {[...festivalRooms, ...freeGatherings].filter(i => i.isJoined).length === 0 && (
                    <div className="p-20 text-center">
                      <Info className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-black">아직 참여 중인 모임이 없습니다.</p>
                    </div>
                  )}
                </section>
              )}
            </div>
          </main>
        </div>
      </div>

      {isModalOpen && (
        <CreateGatheringModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default GatheringPage;
