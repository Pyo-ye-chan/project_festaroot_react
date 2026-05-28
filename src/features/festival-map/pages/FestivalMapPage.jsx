import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, List, Map as MapIcon, Filter } from 'lucide-react';
import KakaoMapContainer from "../../../components/map/KakaoMapContainer";
import MapCategoryTab from "../components/MapCategoryTab";
import PlaceCardList from "../components/PlaceCardList";
import SidebarFilter from "../components/SidebarFilter";
import PlaceDetailDrawer from "../components/PlaceDetailDrawer";

function FestivalMapPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isListVisible, setIsListVisible] = useState(true);

    return (
        <div className="relative flex w-full h-[calc(100vh-140px-210px)] min-h-[700px] bg-slate-50 font-sans overflow-hidden">
            {/* 1. 왼쪽 사이드바 영역 */}
            <div 
                className={`
                    fixed md:relative top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'w-full md:w-[320px]' : 'w-0'}
                `}
            >
                {/* 실제 사이드바 내용 컨테이너 */}
                <div className={`h-full bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-[320px] h-full relative">
                        {/* 모바일용 닫기 버튼 */}
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 z-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <SidebarFilter />
                    </div>
                </div>

                {/* 데스크탑 사이드바 토글 버튼 */}
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
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
                    <div className="pointer-events-auto">
                        <MapCategoryTab />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        {/* 모바일/데스크탑 사이드바 열기 버튼 (닫혀있을 때만 노출) */}
                        {!isSidebarOpen && (
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-3 bg-white text-slate-600 rounded-xl shadow-lg pointer-events-auto hover:text-[#6B46FE] transition-all active:scale-95 border border-slate-100"
                            >
                                <Filter size={20} />
                            </button>
                        )}
                        
                        {/* 리스트 토글 버튼 */}
                        <button 
                            onClick={() => setIsListVisible(!isListVisible)}
                            className={`p-3 rounded-xl shadow-lg pointer-events-auto transition-all active:scale-95 border border-slate-100 ${
                                isListVisible ? "bg-[#6B46FE] text-white" : "bg-white text-slate-600 hover:text-[#6B46FE]"
                            }`}
                        >
                            <List size={20} />
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
                    <div className="max-w-5xl mx-auto px-4 pb-6">
                        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                            {/* 리스트 상단 핸들 (모바일용) */}
                            <div className="md:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3" />
                            <div className="h-[280px] md:h-[300px]">
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