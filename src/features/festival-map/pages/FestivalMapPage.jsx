import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, List, Map as MapIcon, Filter } from 'lucide-react';
import KakaoMapContainer from "../../../components/map/KakaoMapContainer";
import MapCategoryTab from "../components/MapCategoryTab";
import PlaceCardList from "../components/PlaceCardList";
import SidebarFilter from "../components/SidebarFilter";
import PlaceDetailDrawer from "../components/PlaceDetailDrawer";
import useMapStore from "../../../store/useMapStore";

function FestivalMapPage() {
    const mobileHeaderHeight = 64;
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window === 'undefined') return true;
        return window.innerWidth >= 768;
    });
    const [isListVisible, setIsListVisible] = useState(true);
    const [isMobileLayout, setIsMobileLayout] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < 768;
    });
    const { fetchAllFestivals } = useMapStore();

    useEffect(() => {
        fetchAllFestivals();
    }, [fetchAllFestivals]);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            setIsMobileLayout(isMobile);

            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
                return;
            }

            setIsSidebarOpen(true);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative flex w-full h-[calc(100vh-64px)] md:h-[calc(100vh-140px)] bg-slate-50 font-sans overflow-hidden">
            {/* 1. 사이드바 영역 (모바일: 드로어, 데스크탑: 사이드바) */}
            
            {/* 모바일용 Backdrop */}
            <div 
                className={`md:hidden fixed left-0 right-0 bottom-0 bg-black/50 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ top: `${mobileHeaderHeight}px` }}
                onClick={() => setIsSidebarOpen(false)}
            />

            <div 
                className={`
                    fixed md:relative left-0 z-40 transition-all duration-300 ease-in-out
                    ${isSidebarOpen 
                        ? 'translate-x-0 w-[85vw] max-w-[320px] md:w-[320px]' 
                        : '-translate-x-full md:translate-x-0 md:w-0'
                    }
                `}
                style={{
                    top: isMobileLayout ? `${mobileHeaderHeight}px` : undefined,
                    height: isMobileLayout ? `calc(100vh - ${mobileHeaderHeight}px)` : undefined,
                }}
            >
                {/* 실제 사이드바 내용 컨테이너 */}
                <div className={`h-full bg-white/95 md:bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 shadow-2xl md:shadow-none rounded-r-[2rem] md:rounded-none ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-[85vw] max-w-[320px] md:w-[320px] h-full relative">
                        {/* 모바일용 닫기 버튼 */}
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden absolute top-4 right-4 p-2.5 bg-slate-100 rounded-full text-slate-500 z-50 hover:bg-slate-200 shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-slate-500 rounded-full shadow-xl border border-slate-200 flex items-center justify-center"
                            aria-label="사이드바 닫기"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <SidebarFilter
                            onSearchComplete={() => {
                                if (isMobileLayout) {
                                    setIsSidebarOpen(false);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* 데스크탑 사이드바 토글 버튼 (데스크탑에서만 노출) */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`
                        hidden md:flex absolute top-1/2 -translate-y-1/2 items-center justify-center transition-all duration-300 z-50
                        ${isSidebarOpen 
                            ? "-right-4 w-8 h-12 bg-white border border-slate-200 rounded-r-xl shadow-md text-slate-400 hover:text-[#6B46FE]" 
                            : "left-6 w-12 h-12 bg-[#6B46FE] rounded-full shadow-2xl text-white hover:scale-110 active:scale-95"
                        }
                    `}
                    title={isSidebarOpen ? "사이드바 접기" : "필터 열기"}
                >
                    {isSidebarOpen ? <ChevronLeft size={20} /> : <Filter size={20} />}
                </button>
            </div>

            {/* 2. 메인 영역 (지도 + 오버레이) */}
            <div className="flex-1 relative h-full overflow-hidden">
                {/* 배경 지도 */}
                <div className="absolute inset-0">
                    <KakaoMapContainer />
                </div>

                {/* 상단 오버레이 (카테고리 탭 + 모바일 필터 버튼) */}
                <div className="absolute top-4 left-4 right-4 z-30 flex flex-col gap-3 pointer-events-none md:flex-row md:items-start md:justify-between">
                    <div className="pointer-events-auto w-full md:w-auto">
                        <MapCategoryTab />
                    </div>
                    
                    <div className="pointer-events-auto flex items-center justify-start gap-2 md:flex-col md:items-end">
                        {/* 모바일/데스크탑 사이드바 열기 버튼 (닫혀있을 때만 노출) */}
                        {!isSidebarOpen && (
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="px-3.5 py-3 bg-white text-slate-700 rounded-2xl shadow-lg hover:text-[#6B46FE] transition-all active:scale-95 border border-slate-100 flex items-center gap-2 relative z-40"
                            >
                                <Filter size={20} />
                                <span className="md:hidden text-sm font-black pointer-events-none">필터</span>
                            </button>
                        )}
                        
                        {/* 리스트 토글 버튼 */}
                        <button 
                            onClick={() => setIsListVisible(!isListVisible)}
                            className={`px-3.5 py-3 rounded-2xl shadow-lg transition-all active:scale-95 border border-slate-100 flex items-center gap-2 relative z-40 ${
                                isListVisible ? "bg-[#6B46FE] text-white" : "bg-white text-slate-600 hover:text-[#6B46FE]"
                            }`}
                        >
                            <List size={20} />
                            <span className="md:hidden text-sm font-black pointer-events-none">
                                {isListVisible ? '목록 숨기기' : '목록 보기'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* 하단 리스트 영역 - 플로팅 오버레이로 변경 */}
                <div 
                    className={`
                        absolute bottom-0 left-0 right-0 z-20 transition-all duration-500 ease-in-out transform
                        ${isListVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
                    `}
                >
                    <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                            {/* 리스트 상단 핸들 (모바일용) */}
                            <div className="md:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3" />
                            <div className="h-[250px] sm:h-[280px] md:h-[300px]">
                                <PlaceCardList />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 우측 상세 정보 드로어 */}
                <PlaceDetailDrawer />
            </div>
        </div>
    );
}

export default FestivalMapPage;
