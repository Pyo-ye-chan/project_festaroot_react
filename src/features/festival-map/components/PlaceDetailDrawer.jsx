import { PulseLoader } from "react-spinners";
import useMapStore from "../../../store/useMapStore";

// --- Sub-components for different category details ---

const CommonDetailSection = ({ data }) => (
  <section className="space-y-6 mb-8 pb-8 border-b border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
    {data?.overview && (
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          장소 개요
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.overview }} />
      </div>
    )}

    <div className="grid grid-cols-1 gap-4">
      {data?.homepage && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold block mb-1">홈페이지</span>
          <div className="text-sm text-blue-600 font-medium break-all" dangerouslySetInnerHTML={{ __html: data.homepage }} />
        </div>
      )}
      {(data?.tel || data?.telname) && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold block mb-1">문의처</span>
          <p className="text-sm text-slate-700 font-medium">
            {data.telname && <span className="mr-2 text-slate-500">[{data.telname}]</span>}
            {data.tel}
          </p>
        </div>
      )}
      {data?.zipcode && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold block mb-1">우편번호</span>
          <p className="text-sm text-slate-700 font-medium">{data.zipcode}</p>
        </div>
      )}
    </div>
  </section>
);

const FoodDetailSection = ({ data }) => (
  <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div>
      <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        대표 메뉴
      </h3>
      <div className="bg-orange-50/30 border border-orange-100 rounded-2xl p-4 space-y-3">
        {data?.firstmenu ? (
          <p className="text-sm text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: data.firstmenu }} />
        ) : (
          <p className="text-sm text-slate-400 italic">등록된 메뉴 정보가 없습니다.</p>
        )}
        {data?.treatmenu && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-orange-100/50">
            {data.treatmenu.split(',').map((menu, i) => (
              <span key={i} className="px-2 py-1 bg-white border border-orange-100 rounded-lg text-[11px] text-orange-600">
                {menu.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <span className="text-[11px] text-slate-400 font-bold block mb-1">영업시간</span>
        <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: data?.opentimefood || '정보 없음' }} />
      </div>
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <span className="text-[11px] text-slate-400 font-bold block mb-1">쉬는날</span>
        <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: data?.restdatefood || '정보 없음' }} />
      </div>
    </div>
  </section>
);

const TourDetailSection = ({ data }) => (
  <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div>
      <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        관광지 안내
      </h3>
      <div className="bg-green-50/30 border border-green-100 rounded-2xl p-4 space-y-4">
        <div>
          <span className="text-[11px] text-green-600 font-bold block mb-1">이용시간</span>
          <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.usetime || '정보 없음' }} />
        </div>
        <div className="pt-3 border-t border-green-100/50">
          <span className="text-[11px] text-green-600 font-bold block mb-1">쉬는날</span>
          <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: data?.restdate || '정보 없음' }} />
        </div>
      </div>
    </div>

    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <span className="text-[11px] text-slate-400 font-bold block mb-1">문의 및 안내</span>
      <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: data?.infocenter || '정보 없음' }} />
    </div>
  </section>
);

const FestivalDetailSection = ({ data }) => (
  <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div>
      <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        축제 프로그램
      </h3>
      <div className="bg-purple-50/30 border border-purple-100 rounded-2xl p-4">
        <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.program || '상세 프로그램 정보가 준비 중입니다.' }} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <span className="text-[11px] text-slate-400 font-bold block mb-1">이용요금</span>
        <p className="text-sm text-slate-700 truncate" dangerouslySetInnerHTML={{ __html: data?.usetimefestival || '무료' }} />
      </div>
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <span className="text-[11px] text-slate-400 font-bold block mb-1">공연시간</span>
        <p className="text-sm text-slate-700 truncate" dangerouslySetInnerHTML={{ __html: data?.playtime || '정보 없음' }} />
      </div>
    </div>
  </section>
);

// --- Main Drawer Component ---

function PlaceDetailDrawer() {
  const { selectedPlace, setSelectedPlace, placeDetail, isDetailLoading } = useMapStore();

  const handleDirections = () => {
    if (!selectedPlace) return;
    const { title, lat, lng } = selectedPlace;
    const url = `https://map.kakao.com/link/to/${title},${lat},${lng}`;
    window.open(url, '_blank');
  };

  const renderDetailSection = () => {
    if (isDetailLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <PulseLoader color="#6B46FE" size={10} />
          <p className="text-xs text-slate-400 animate-pulse">상세 정보를 불러오고 있습니다...</p>
        </div>
      );
    }

    if (!placeDetail) {
      return (
        <div className="py-10 text-center">
          <p className="text-sm text-slate-400">상세 정보를 불러올 수 없습니다.</p>
        </div>
      );
    }

    const categorySection = () => {
      const specificData = placeDetail.specificInfo;
      
      switch (selectedPlace?.contentTypeId) {
        case '39': return <FoodDetailSection data={specificData} />;
        case '12': return <TourDetailSection data={specificData} />;
        case '15': return <FestivalDetailSection data={specificData} />;
        default: return (
          <p className="text-sm text-slate-500 italic p-6 bg-slate-50 rounded-xl">
            이 장소의 상세 정보 형식이 지원되지 않습니다.
          </p>
        );
      }
    };

    return (
      <>
        <CommonDetailSection data={placeDetail.commonInfo} />
        {categorySection()}
      </>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 z-[90] ${selectedPlace ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSelectedPlace(null)}
      />

      {/* Drawer */}
      <div className={`absolute top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-2xl z-[100] transition-transform duration-500 ease-in-out transform flex flex-col ${selectedPlace ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedPlace && (
          <>
            <div className="relative h-72 w-full shrink-0">
              <img 
                src={selectedPlace.thumbnail || selectedPlace.img} 
                alt={selectedPlace.title} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-slate-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg z-10"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white px-2">
                <span className="inline-block px-2 py-1 rounded bg-[#6B46FE] text-white text-[10px] font-bold mb-2 shadow-lg">
                  {selectedPlace.category}
                </span>
                <h2 className="text-2xl font-bold leading-tight drop-shadow-md break-keep">
                  {selectedPlace.title}
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {/* Quick Info Bar */}
              <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-xs text-slate-400 font-medium">거리</span>
                  <span className="font-bold text-slate-700 text-lg">{selectedPlace.distance}</span>
                </div>
              </div>

              {/* Dynamic Content Section */}
              {renderDetailSection()}

              {/* Common Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95">
                  <span>📤</span> 공유하기
                </button>
                <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95">
                  <span>🤍</span> 즐겨찾기
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md">
              <button 
                onClick={handleDirections}
                className="w-full py-4 bg-[#6B46FE] text-white rounded-2xl font-bold hover:bg-[#5a3ae6] transition-all shadow-xl shadow-purple-100 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>📍</span> 길찾기 시작하기
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PlaceDetailDrawer;