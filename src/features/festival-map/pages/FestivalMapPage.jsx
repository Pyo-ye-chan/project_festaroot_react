import KakaoMapContainer from "../../../components/map/KakaoMapContainer";
import MapCategoryTab from "../components/MapCategoryTab";
import PlaceCardList from "../components/PlaceCardList";
import SidebarFilter from "../components/SidebarFilter";


function FestivalMapPage() {
    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {/* 왼쪽 사이드바 영역 */}
            <SidebarFilter />

            {/* 오른쪽 메인 대시보드 영역 (지도 + 리스트) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* 상단 지도 영역 (relative를 주어야 카테고리 탭이 지도 위에 뜹니다)
                <div style={{ flex: 1, backgroundColor: '#E2E8F0', position: 'relative', display: 'flex', alignItems: 'center', justifycontent: 'center' }}>
                    <MapCategoryTab /> */}
                    {/* <span style={{ color: '#94A3B8', fontWeight: '600' }}>🗺️ 여기에 실제 카카오 지도가 삽입될 예정입니다</span> */}
                    {/* <KakaoMapContainer />
                </div> */}
                <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
                    <MapCategoryTab />
                    <KakaoMapContainer />
                </div>

                {/* 하단 리스트 영역 */}
                <PlaceCardList />
            </div>
        </div>
    );
}

export default FestivalMapPage;