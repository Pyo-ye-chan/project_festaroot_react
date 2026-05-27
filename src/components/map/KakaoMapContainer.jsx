import { Map, MapMarker, Circle } from "react-kakao-maps-sdk";
import useMapStore from "../../store/useMapStore";

function KakaoMapContainer() {
  const { searchParams, activeCategory, places } = useMapStore();
  const { radius, selectedFestival } = searchParams;

  // 디버깅을 위한 로그 (콘솔에서 확인 가능)
  // console.log('Selected Festival:', selectedFestival);
  // console.log('Places Data:', places);

  // 1. 기준 좌표 설정
  const getCenter = () => {
    if (selectedFestival && 
        selectedFestival.map_y !== undefined && 
        selectedFestival.map_x !== undefined) {
      
      const lat = Number(selectedFestival.map_y);
      const lng = Number(selectedFestival.map_x);

      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        return { lat, lng };
      }
    }
    // 값이 없거나 유효하지 않으면 서울시청
    return { lat: 37.5665, lng: 126.9780 };
  };

  const center = getCenter();
  //console.log('Final Map Center:', center);

  // 2. 카테고리에 따른 마커 필터링
  const filteredMarkers = places.filter(place => {
    if (activeCategory === '전체') return true;
    if (activeCategory === '음식점') return place.type === 'food';
    if (activeCategory === '관광지') return place.type === 'tour';
    if (activeCategory === '축제/행사') return place.type === 'festival';
    return true;
  });

  // 3. 원의 반지름 유효성 확인
  const isValidRadius = !isNaN(radius) && radius > 0;

  return (
    <Map
      center={center}
      isPanto={true} // 부드러운 이동 효과 추가
      className="w-full h-full"
      level={radius > 15 ? 8 : radius > 10 ? 7 : radius > 5 ? 6 : 5}
    >
      {/* 1. 기준 축제 위치 마커 */}
      {selectedFestival && !isNaN(center.lat) && center.lat !== 37.5665 && (
        <MapMarker 
          position={center}
          image={{
            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
            size: { width: 24, height: 35 }
          }}
        >
          <div className="p-1 px-2 text-[#6B46FE] font-bold text-[10px] bg-white rounded shadow-sm">
            📍 {selectedFestival.title}
          </div>
        </MapMarker>
      )}

      {/* 2. 주변 추천 장소 마커들 */}
      {filteredMarkers.map((marker) => (
        marker.lat && marker.lng && (
          <MapMarker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => alert(`${marker.title}\n${marker.category}`)}
          >
            <div className="p-1 px-2 text-slate-700 text-[10px] bg-white/90 rounded border border-slate-100 whitespace-nowrap">
              {marker.type === "food" ? "🍽️" : marker.type === "tour" ? "⛰️" : "🎉"} {marker.title}
            </div>
          </MapMarker>
        )
      ))}

      {/* 3. 모든 값이 유효할 때만 원 표시 */}
      {selectedFestival && isValidRadius && center.lat !== 37.5665 && (
        <Circle
          center={center}
          radius={radius * 1000}
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