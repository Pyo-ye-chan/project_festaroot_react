import { Map, MapMarker, Circle } from "react-kakao-maps-sdk";
import useMapStore from "../../store/useMapStore";

function KakaoMapContainer() {
  const { searchParams, activeCategory } = useMapStore();
  const { radius } = searchParams;

  // 기준이 되는 축제 중심 좌표 (태안 세계튤립축제 근처 임시 좌표)
  const centerFestival = { lat: 36.65, lng: 126.33 };

  // 임시로 지도 위에 띄울 주변 음식점/관광지 마커 좌표 데이터
  const mockMarkers = [
    { id: 1, title: "태안 회센터", lat: 36.6521, lng: 126.3345, type: "food" },
    { id: 2, title: "꽃지 해물칼국수", lat: 36.6590, lng: 126.3420, type: "food" },
    { id: 3, title: "꽃지 해수욕장", lat: 36.6415, lng: 126.3211, type: "tour" },
    { id: 4, title: "안면도 게국지", lat: 36.6450, lng: 126.3500, type: "food" },
  ];

  // 카테고리에 따른 마커 필터링
  const filteredMarkers = mockMarkers.filter(marker => {
    if (activeCategory === '전체') return true;
    if (activeCategory === '음식점') return marker.type === 'food';
    if (activeCategory === '관광지') return marker.type === 'tour';
    if (activeCategory === '축제/행사') return marker.type === 'festival';
    return true;
  });

  return (
    <Map
      center={centerFestival}
      className="w-full h-full"
      level={radius > 10 ? 7 : radius > 5 ? 6 : 5} // 반경에 따른 지도 레벨 조정
    >
      {/* 1. 중심 축제 위치 마커 */}
      <MapMarker 
        position={centerFestival}
        image={{
          src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          size: { width: 24, height: 35 }
        }}
      >
        <div className="p-1 px-2 text-[#6B46FE] font-bold text-[10px] bg-white rounded shadow-sm">
          📍 태안 세계튤립축제
        </div>
      </MapMarker>

      {/* 2. 주변 추천 장소 마커들 */}
      {filteredMarkers.map((marker) => (
        <MapMarker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={() => alert(`${marker.title} 클릭됨`)}
        >
          <div className="p-1 px-2 text-slate-700 text-[10px] bg-white/90 rounded border border-slate-100">
            {marker.type === "food" ? "🍽️" : "⛰️"} {marker.title}
          </div>
        </MapMarker>
      ))}

      {/* 3. 설정된 반경(km)을 미터로 변환하여 원 표시 */}
      {radius > 0 && (
        <Circle
          center={centerFestival}
          radius={radius * 1000} // km to m
          strokeWeight={1}
          strokeColor={"#6B46FE"}
          strokeOpacity={0.4}
          strokeStyle={"solid"}
          fillColor={"#6B46FE"}
          fillOpacity={0.03}
        />
      )}
    </Map>
  );
}

export default KakaoMapContainer;