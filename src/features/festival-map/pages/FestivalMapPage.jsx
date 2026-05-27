import KakaoMapContainer from "../../../components/map/KakaoMapContainer";
import MapCategoryTab from "../components/MapCategoryTab";
import PlaceCardList from "../components/PlaceCardList";
import SidebarFilter from "../components/SidebarFilter";

function FestivalMapPage() {
    return (
        <div className="flex flex-col md:flex-row w-full md:h-[1000px] bg-gray-50 font-sans overflow-hidden">
            {/* 왼쪽 사이드바 영역 - 1000px 높이 내에서 여유롭게 모든 필터 노출 */}
            <div className="w-full md:w-[320px] h-auto md:h-full border-b md:border-b-0 md:border-r border-gray-200 z-20 bg-white shrink-0">
                <SidebarFilter />
            </div>

            {/* 오른쪽 메인 대시보드 영역 (지도 + 리스트) */}
            <div className="flex-1 flex flex-col h-[800px] md:h-full overflow-hidden relative">
                
                {/* 지도 영역 - 1000px 높이 중 약 600px 차지 (매우 넓은 시야 확보) */}
                <div className="flex-1 relative w-full overflow-hidden min-h-[400px]">
                    <MapCategoryTab />
                    <KakaoMapContainer />
                </div>

                {/* 하단 리스트 영역 - 400px로 확대하여 카드와 리스트 내용을 여유롭게 노출 */}
                <div className="h-[350px] md:h-[400px] bg-white border-t border-gray-200 shrink-0">
                    <PlaceCardList />
                </div>
            </div>
        </div>
    );
}

export default FestivalMapPage;