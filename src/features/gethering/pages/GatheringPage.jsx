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
  Info,
  Flame,
  ArrowRight,
  Filter
} from 'lucide-react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import CreateGatheringModal from '../components/CreateGatheringModal';

const GatheringPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('전체 모임');
  const [keyword, setKeyword] = useState('');
  
  // 참여중인 모임 전용 필터 (전체, 축제, 자유)
  const [joinedFilter, setJoinedFilter] = useState('전체');

  const categories = ['전체 모임', '축제별 모임', '자유 모임', '참여중인 모임'];

  const festivalRooms = [
    { 
      id: 101, 
      type: 'festival',
      festivalName: '부산 록 페스티벌', 
      title: '부산 록 페스티벌 공식 채팅방', 
      location: '부산 삼락생태공원', 
      date: '2026.08.10 - 08.12',
      current: 156, 
      max: 500,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=300',
      isJoined: true,
      joinedAt: '2026-06-01'
    },
    { 
      id: 102, 
      type: 'festival',
      festivalName: '태안 세계 튤립 축제', 
      title: '튤립 축제 메이트 찾기', 
      location: '태안 코리아플라워파크', 
      date: '2026.04.10 - 05.10',
      current: 84, 
      max: 200,
      image: 'https://images.unsplash.com/photo-1554123168-b400f9c806ca?auto=format&fit=crop&q=80&w=300',
      isJoined: false
    },
    { 
      id: 103, 
      type: 'festival',
      festivalName: '서울 재즈 페스티벌', 
      title: '서재페 동행 모집방', 
      location: '서울 올림픽공원', 
      date: '2026.05.28 - 05.30',
      current: 243, 
      max: 1000,
      image: 'https://images.unsplash.com/photo-1514525253361-bee8a19744c1?auto=format&fit=crop&q=80&w=300',
      isJoined: true,
      joinedAt: '2026-06-05'
    },
  ];

  const freeGatherings = [
    { 
      id: 1, 
      type: 'free',
      title: '한강 치맥 파티 🍗🍺', 
      date: '2026.06.15', 
      current: 7, 
      max: 10,
      creator: { name: '치킨마스터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
      isJoined: true,
      joinedAt: '2026-06-03'
    },
    { 
      id: 2, 
      type: 'free',
      title: '보드게임 동호회 🎲', 
      date: '2026.06.20', 
      current: 3, 
      max: 6,
      creator: { name: '게임광', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe' },
      isJoined: false
    },
    { 
      id: 3, 
      type: 'free',
      title: '경복궁 야간개장 출사 🏯', 
      date: '2026.06.18', 
      current: 2, 
      max: 4,
      creator: { name: '셔터보이', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
      isJoined: false
    },
    { 
      id: 4, 
      type: 'free',
      title: '남산 둘레길 산책 🏃‍♂️', 
      date: '2026.06.22', 
      current: 5, 
      max: 8,
      creator: { name: '산들바람', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily' },
      isJoined: true,
      joinedAt: '2026-06-07'
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Grid View Components ---
  const FestivalGridCard = ({ item }) => (
    <Link 
      to={`/community/gathering/${item.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all flex flex-col"
    >
      <div className="relative h-32 overflow-hidden">
        <img src={item.image} alt={item.festivalName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4">
          <span className="text-[10px] font-black text-white bg-purple-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Official
          </span>
          <h4 className="text-white font-black text-sm mt-1">{item.festivalName}</h4>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="font-bold text-gray-900 text-sm mb-3 line-clamp-1 group-hover:text-[var(--festival-purple)] transition-colors">
          {item.title}
        </h5>
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
            <MapPin className="w-3 h-3" /> {item.location}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <CalendarDays className="w-3 h-3" /> {item.date}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-purple-600">
              <Users className="w-3 h-3" /> {item.current}/{item.max}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const FreeGridCard = ({ item }) => (
    <Link 
      to={`/community/gathering/${item.id}`}
      className="group bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all flex items-center gap-3"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
        <img src={item.creator.avatar} alt={item.creator.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow min-w-0">
        <h5 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
          {item.title}
        </h5>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-bold text-gray-400">{item.date}</span>
          <div className="flex items-center gap-1 text-[10px] font-black text-blue-600">
            <Users className="w-3 h-3" /> {item.current}/{item.max}
          </div>
        </div>
      </div>
    </Link>
  );

  // --- List View Component ---
  const GatheringListItem = ({ item, isFestival, showTypeBadge = false }) => (
    <Link 
      to={`/community/gathering/${item.id}`}
      className="flex items-center gap-4 py-4 px-6 hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-none"
    >
      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
        {isFestival ? (
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100">
            <img src={item.image} alt={item.festivalName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={item.creator.avatar} alt={item.creator.name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {showTypeBadge && (
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
              isFestival ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {isFestival ? 'Festival' : 'Free'}
            </span>
          )}
          {isFestival ? (
            activeTab !== '참여중인 모임' && (
              <span className="text-[10px] font-black text-[var(--festival-purple)] bg-purple-50 px-2 py-0.5 rounded-md">
                {item.festivalName}
              </span>
            )
          ) : (
            <span className="text-[10px] font-black text-gray-400">
              {item.creator.name}
            </span>
          )}
        </div>
        <h4 className="font-bold text-gray-900 truncate group-hover:text-[var(--festival-purple)] transition-colors text-base">
          {item.title}
        </h4>
        <div className="flex items-center gap-4 mt-1.5">
          {isFestival && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
              <MapPin className="w-3.5 h-3.5" /> {item.location}
            </div>
          )}
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
            <CalendarDays className="w-3.5 h-3.5" /> {item.date}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-black text-purple-600">
            <Users className="w-3.5 h-3.5" /> {item.current}/{item.max}명
          </div>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--festival-purple)] group-hover:translate-x-1 transition-all flex-shrink-0" />
    </Link>
  );

  // 참여중인 모임 필터링 로직
  const getJoinedItems = () => {
    let combined = [...festivalRooms, ...freeGatherings].filter(item => item.isJoined);
    
    // 참여한 순서대로 정렬 (joinedAt 기준)
    combined.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));

    if (joinedFilter === '축제별 모임') return combined.filter(i => i.type === 'festival');
    if (joinedFilter === '자유 모임') return combined.filter(i => i.type === 'free');
    return combined; // '전체'
  };

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
                <p className="text-gray-500 font-medium">다양한 축제 메이트와 소통을 시작해보세요.</p>
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
                    onClick={() => handleTabChange(cat)}
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

            {/* Content Areas */}
            <div className="grid grid-cols-1 gap-10">
              
              {/* 축제별 모임 섹션 */}
              {(activeTab === '전체 모임' || activeTab === '축제별 모임') && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className={`flex items-center justify-between p-8 ${activeTab === '전체 모임' ? 'pb-4' : 'border-b border-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-2xl text-[var(--festival-purple)]">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">축제별 공식 모임</h3>
                        {activeTab === '축제별 모임' && (
                          <p className="text-xs text-gray-400 font-medium mt-1">
                            축제 정보에 관심이 있다면, 모임에 참여해 채팅방으로 대화를 나눠보세요!
                          </p>
                        )}
                      </div>
                    </div>
                    {activeTab === '전체 모임' && (
                      <button 
                        onClick={() => handleTabChange('축제별 모임')}
                        className="text-xs font-black text-gray-400 hover:text-[var(--festival-purple)] flex items-center gap-1 group"
                      >
                        더보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                  
                  {activeTab === '전체 모임' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 pt-4">
                      {festivalRooms.slice(0, 3).map(room => (
                        <FestivalGridCard key={room.id} item={room} />
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {festivalRooms.map(room => (
                        <GatheringListItem key={room.id} item={room} isFestival={true} />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* 자유 모임 섹션 */}
              {(activeTab === '전체 모임' || activeTab === '자유 모임') && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className={`flex items-center justify-between p-8 ${activeTab === '전체 모임' ? 'pb-4' : 'border-b border-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">자유 친목 모임</h3>
                        {activeTab === '자유 모임' && (
                          <p className="text-xs text-gray-400 font-medium mt-1">
                            관심사가 비슷한 사람들을 찾아 자유롭게 소통하고 축제 메이트가 되어보세요!
                          </p>
                        )}
                      </div>
                    </div>
                    {activeTab === '전체 모임' && (
                      <button 
                        onClick={() => handleTabChange('자유 모임')}
                        className="text-xs font-black text-gray-400 hover:text-blue-600 flex items-center gap-1 group"
                      >
                        더보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>

                  {activeTab === '전체 모임' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 pt-4">
                      {freeGatherings.slice(0, 4).map(gathering => (
                        <FreeGridCard key={gathering.id} item={gathering} />
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {freeGatherings.map(gathering => (
                        <GatheringListItem key={gathering.id} item={gathering} isFestival={false} />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* 참여중인 모임 섹션 */}
              {activeTab === '참여중인 모임' && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-rose-100 rounded-2xl text-rose-500">
                        <LayoutGrid className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">참여중인 모임</h3>
                    </div>
                    
                    {/* 토글 필터 */}
                    <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100 self-start md:self-auto">
                      {['전체', '축제별 모임', '자유 모임'].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setJoinedFilter(filter)}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                            joinedFilter === filter 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-50">
                    {getJoinedItems().map(item => (
                      <GatheringListItem 
                        key={item.id} 
                        item={item} 
                        isFestival={item.type === 'festival'} 
                        showTypeBadge={true} 
                      />
                    ))}
                    {getJoinedItems().length === 0 && (
                      <div className="py-20 text-center">
                        <Info className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-black">해당하는 참여 모임이 없습니다.</p>
                      </div>
                    )}
                  </div>
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
