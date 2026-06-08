import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import festivalService from '../../../api/festivalService';

const TopFestivalsByRegion = () => {
  const [activeRegion, setActiveRegion] = useState('서울');
  const [festivals, setFestivals] = useState([]); // 항상 빈 배열로 초기화하여 안전성 확보
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const regions = ['서울', '경기', '인천', '경남', '경북', '강원', '충북', '충남', '전북', '전남', '광주', '대전', '부산', '대구', '세종', '울산', '제주'];

  const regionMapper = {
    '서울': '서울특별시',
    '경기': '경기도',
    '인천': '인천광역시',
    '경남': '경상남도',
    '경북': '경상북도',
    '강원': '강원특별자치도',
    '충북': '충청북도',
    '충남': '충청남도',
    '전북': '전북특별자치도',
    '전남': '전라남도',
    '광주': '광주광역시',
    '대전': '대전광역시',
    '부산': '부산광역시',
    '대구': '대구광역시',
    '세종': '세종특별자치시',
    '울산': '울산광역시',
    '제주': '제주특별자치도'
  };

  useEffect(() => {
    const fetchTopFestivals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fullRegionName = regionMapper[activeRegion];

        // 💡 분리해둔 festivalService 구조를 사용하여 데이터를 가져옵니다.
        const data = await festivalService.getTopFestivals(fullRegionName);

        // 🔥 [중요 방어 코드] 받아온 데이터가 진짜 배열(Array)인지 확실하게 체크한 뒤 상태에 저장합니다.
        // 이 처리가 되어야 백엔드에서 404나 에러 객체를 보냈을 때 .map 에러로 컴포넌트가 뻗는 현상을 막을 수 있습니다.
        if (Array.isArray(data)) {
          setFestivals(data);
        } else {
          console.warn("백엔드에서 배열 형식이 아닌 데이터가 리턴되었습니다:", data);
          setFestivals([]);
        }
      } catch (err) {
        console.error("지역별 인기 축제 조회 실패:", err);
        setError("축제 데이터를 불러오는 중 오류가 발생했습니다.");
        setFestivals([]); // 에러 시 배열 비워주기
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopFestivals();
  }, [activeRegion]);

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* 타이틀 및 지역 선택 탭 섹션 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 font-black">지역별 인기 축제 TOP 3</h3>
          <p className="text-gray-500 mt-2 font-bold text-sm">지금 가장 핫한 지역별 축제를 확인하세요.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap ${activeRegion === r
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-100'
                  : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:text-purple-600'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 🔄 조건부 렌더링 영역 */}
      {isLoading ? (
        // [로딩 중] 스켈레톤 UI
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-50 p-5 rounded-3xl animate-pulse h-28 flex items-center gap-5">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        // [에러 발생 시]
        <div className="text-center py-12 text-rose-500 font-bold">{error}</div>
      ) : festivals.length === 0 ? (
        // [데이터가 빌 때] 
        <div className="text-center py-12 text-gray-400 font-bold">해당 지역에 등록된 축제 정보가 없습니다.</div>
      ) : (
        // [성공] 렌더링
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {festivals.map((fest, index) => (
            <Link
              to={`/festival/${fest.content_id}`}
              key={fest.content_id}
              className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:border-purple-100 transition-all duration-500 group cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100">
                  <img
                    src={fest.first_image || 'https://picsum.photos/seed/default/100/100'}
                    alt={fest.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">
                  {index + 1}
                </div>
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate">
                  {fest.title}
                </h4>
                <div className="mt-1 space-y-1">
                  <p className="text-[11px] text-gray-500 font-bold truncate flex items-center gap-1">📍 {fest.addr1}</p>
                  <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                    📅 {fest.event_start_date && fest.event_end_date
                      ? `${fest.event_start_date} - ${fest.event_end_date}`
                      : '일정 정보 없음'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-rose-500 font-black">
                  <span className="text-xs">❤️</span>
                  <span className="text-[11px]">{fest.like_count || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default TopFestivalsByRegion;