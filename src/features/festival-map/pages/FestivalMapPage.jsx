import KakaoMapContainer from "../../../components/map/KakaoMapContainer";
import MapCategoryTab from "../components/MapCategoryTab";
import PlaceCardList from "../components/PlaceCardList";
import SidebarFilter from "../components/SidebarFilter";

function FestivalMapPage() {
    return (
        <div className="flex flex-col md:flex-row w-full md:h-[calc(100vh-140px-210px)] min-h-[800px] bg-gray-50 font-sans overflow-hidden">
            {/* 왼쪽 사이드바 영역 - 데스크탑에서 모든 내용이 한눈에 보이도록 설정 */}
            <div className="w-full md:w-[320px] h-auto md:h-full border-b md:border-b-0 md:border-r border-gray-200 z-20 bg-white shrink-0">
                <SidebarFilter />
            </div>

            {/* 오른쪽 메인 대시보드 영역 (지도 + 리스트) */}
            <div className="flex-1 flex flex-col h-[700px] md:h-full overflow-hidden relative">
                
                {/* 지도 영역 - 남은 공간 차지 */}
                <div className="flex-1 relative w-full overflow-hidden min-h-[300px]">
                    <MapCategoryTab />
                    <KakaoMapContainer />
                </div>

                {/* 하단 리스트 영역 - 카드 내용이 잘리지 않도록 충분한 높이 확보 */}
                <div className="h-[320px] md:h-[340px] bg-white border-t border-gray-200 shrink-0">
                    <PlaceCardList />
                </div>
            </div>
        </div>
    );
}

export default FestivalMapPage;