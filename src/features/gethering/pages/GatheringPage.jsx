import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  PlusCircle,
  CalendarDays,
  MapPin,
  Sparkles,
  ChevronRight,
  Search,
} from 'lucide-react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import CreateGatheringModal from '../../community/components/CreateGatheringModal';

const GatheringPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchType, setSearchType] = useState('title');
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const festivalGatherings = [
    { id: 1, festival: '부산 록 페스티벌', title: '같이 락 페스티벌 즐길 사람?!', date: '2024.08.10', location: '부산 삼락생태공원', current: 3, max: 5 },
    { id: 2, festival: '태안 세계 튤립 축제', title: '튤립 축제에서 인생샷 남겨요', date: '2024.04.20', location: '태안 코리아플라워파크', current: 4, max: 4 },
  ];

  const popularGatherings = [
    { id: 3, title: '전주 비빔밥 축제 먹방 투어팟', date: '2024.10.25', location: '전주 한옥마을', current: 7, max: 10, image: 'https://picsum.photos/seed/gathering3/100/100' },
    { id: 4, title: '제주 들불축제 불멍 같이할 사람', date: '2025.03.09', location: '제주 새별오름', current: 5, max: 8, image: 'https://picsum.photos/seed/gathering4/100/100' },
    { id: 5, title: '서울 재즈 페스티벌 같이 갈 칭구', date: '2024.05.30', location: '서울 올림픽공원', current: 2, max: 4, image: 'https://picsum.photos/seed/gathering5/100/100' },
  ];

  const sortOptions = [
    { label: '최신순', value: 'latest' },
    { label: '인기순', value: 'popular' },
    { label: '모집임박순', value: 'deadline' },
  ];

  const getFestivalBadgeClasses = (festivalName) => {
    switch (festivalName) {
      case '부산 록 페스티벌':
        return 'bg-[var(--festival-purple)] text-white';
      case '태안 세계 튤립 축제':
        return 'bg-[var(--festival-yellow)] text-gray-800';
      case '전주 비빔밥 축제':
        return 'bg-green-400 text-white';
      case '제주 들불축제':
        return 'bg-orange-400 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9 space-y-8">
            {/* 상단 타이틀 + 버튼 */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-[var(--festival-purple)] font-bold text-sm mb-2">
                  <Link to="/community" className="hover:underline">
                    커뮤니티
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <span>모임</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  모임
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="h-12 px-6 bg-[var(--festival-purple)] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[var(--festival-purple-soft)] transition-all shadow-lg shadow-[var(--festival-purple)]/20 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                새 모임 만들기
              </button>
            </div>

            {/* 검색창 */}
            <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100">
              <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex flex-col sm:flex-row flex-1 gap-3">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="h-12 bg-gray-50 rounded-2xl px-4 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20"
                  >
                    <option value="title">모임명</option>
                    <option value="festival">축제명</option>
                    <option value="location">지역</option>
                  </select>

                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      type="text"
                      placeholder="모임명, 축제명, 지역을 검색해보세요"
                      className="w-full h-12 bg-gray-50 rounded-2xl pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20"
                    />
                  </div>

                  <button className="h-12 px-6 rounded-2xl bg-gray-900 text-white text-sm font-black hover:bg-black transition-all">
                    검색
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {sortOptions.map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => setSortBy(sort.value)}
                      className={`h-12 px-5 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
                        sortBy === sort.value
                          ? 'bg-[var(--festival-purple)] text-white shadow-md shadow-[var(--festival-purple)]/20'
                          : 'bg-gray-50 text-gray-500 hover:bg-[var(--festival-purple-soft)]/20 hover:text-[var(--festival-purple)]'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 축제별 모임 */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[var(--festival-yellow)]" />
                  축제별 모임
                </h3>
                <Link to="/community/gatherings/festival" className="text-sm font-bold text-gray-400 hover:text-[var(--festival-purple)]">
                  더보기
                </Link>
              </div>

              <div className="space-y-4">
                {festivalGatherings.map((gathering) => (
                  <Link
                    to={`/community/gathering/${gathering.id}`}
                    key={gathering.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-[var(--festival-purple-soft)]"
                  >
                    <div className="flex-grow mb-2 md:mb-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md mb-1 inline-block ${getFestivalBadgeClasses(gathering.festival)}`}>
                        {gathering.festival}
                      </span>
                      <h4 className="font-bold text-gray-800 group-hover:text-[var(--festival-purple)] transition-colors">
                        {gathering.title}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <CalendarDays className="w-3 h-3" /> {gathering.date}
                        <span className="mx-1">|</span>
                        <MapPin className="w-3 h-3" /> {gathering.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{gathering.current}/{gathering.max}명</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--festival-yellow)]" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 인기 모임 */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[var(--festival-purple)]" />
                  인기 모임
                </h3>
                <Link to="/community/gatherings/popular" className="text-sm font-bold text-gray-400 hover:text-[var(--festival-purple)]">
                  더보기
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularGatherings.map((gathering) => (
                  <Link
                    to={`/community/gathering/${gathering.id}`}
                    key={gathering.id}
                    className="flex items-center p-4 bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-[var(--festival-purple-soft)]"
                  >
                    <img
                      src={gathering.image}
                      alt={gathering.title}
                      className="w-16 h-16 object-cover rounded-xl mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 group-hover:text-[var(--festival-purple)] transition-colors">
                        {gathering.title}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {gathering.location}
                        <span className="mx-1">|</span>
                        <CalendarDays className="w-3 h-3" /> {gathering.date}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--festival-yellow)]" />
                  </Link>
                ))}
              </div>
            </section>
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