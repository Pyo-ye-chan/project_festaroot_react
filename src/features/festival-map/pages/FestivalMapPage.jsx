import KakaoMapContainer from "../../../components/map/KakaoMapContainer";
import MapCategoryTab from "../components/MapCategoryTab";
import PlaceCardList from "../components/PlaceCardList";
import SidebarFilter from "../components/SidebarFilter";

function FestivalMapPage() {
    return (
        <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden bg-gray-50 font-sans">
            {/* 왼쪽 사이드바 영역 - 모바일에서는 상단 또는 숨김 처리가 필요할 수 있음 (여기서는 우선 상단 배치 후 md 이상에서 왼쪽 고정) */}
            <div className="w-full md:w-[360px] h-auto md:h-full border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto z-20 bg-white">
                <SidebarFilter />
            </div>

            {/* 오른쪽 메인 대시보드 영역 (지도 + 리스트) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* 지도 영역 */}
                <div className="flex-1 relative w-full overflow-hidden">
                    <MapCategoryTab />
                    <KakaoMapContainer />
                </div>

                {/* 하단 리스트 영역 */}
                <div className="h-auto max-h-[40%] md:max-h-none md:h-[320px] bg-white border-t border-gray-200">
                    <PlaceCardList />
                </div>
            </div>
        </div>
    );
}

export default FestivalMapPage;