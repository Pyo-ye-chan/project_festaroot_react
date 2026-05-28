import { useState, useEffect } from "react";
import { Map, MapMarker, Circle, MarkerClusterer } from "react-kakao-maps-sdk";
import useMapStore from "../../store/useMapStore";

function KakaoMapContainer() {
  const { searchParams, activeCategory, places, selectedPlace, setSelectedPlace, fetchPlaceDetail } = useMapStore();
  const { radius, selectedFestival } = searchParams;

  // 1. 초기 레벨 설정 및 상태 관리
  const initialLevel = radius > 15 ? 8 : radius > 10 ? 7 : radius > 5 ? 6 : 5;
  const [level, setLevel] = useState(initialLevel);

  // radius나 selectedPlace가 변경될 때마다 레벨 업데이트 (상세 정보 볼 때는 줌인)
  useEffect(() => {
    if (selectedPlace) {
      setLevel(4); // 상세 정보 클릭 시 4레벨로 줌인
    } else {
      setLevel(initialLevel);
    }
  }, [radius, selectedPlace]);

  // 2. 기준 좌표 설정
  const getCenter = () => {
    // 선택된 상세 장소가 있으면 그곳을 중심으로
    if (selectedPlace && selectedPlace.lat && selectedPlace.lng) {
      return { lat: selectedPlace.lat, lng: selectedPlace.lng };
    }

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

  // 3. 카테고리에 따른 마커 필터링
  const filteredMarkers = places.filter(place => {
    if (activeCategory === '전체') return true;
    if (activeCategory === '음식점') return place.type === 'food';
    if (activeCategory === '관광지') return place.type === 'tour';
    if (activeCategory === '축제/행사') return place.type === 'festival';
    return true;
  });

  // 4. 원의 반지름 유효성 확인
  const isValidRadius = !isNaN(radius) && radius > 0;

  // 5. 클러스터링 적용 여부 (MarkerClusterer의 minLevel=6과 동일하게 설정)
  const isClustered = level >= 6;

  const handleMarkerClick = (marker) => {
    setSelectedPlace(marker);
    fetchPlaceDetail(marker.id, marker.contentTypeId);
  };

  return (
    <Map
      center={center}
      isPanto={true} // 부드러운 이동 효과 추가
      className="w-full h-full"
      level={level}
      onZoomChanged={(map) => setLevel(map.getLevel())}
    >
      {/* 1. 기준 축제 위치 마커 (클러스터링 제외) */}
      {selectedFestival && !isNaN(center.lat) && center.lat !== 37.5665 && (
        <MapMarker 
          position={center}
          zIndex={10} // 기준 마커가 항상 위에 보이도록 설정
          image={{
            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
            size: { width: 24, height: 35 }
          }}
        >
          {/* 클러스터링 수준에서는 설명 바를 숨김 */}
          {!isClustered && (
            <div className="p-1 px-2 text-[#6B46FE] font-bold text-[10px] bg-white rounded shadow-sm">
              📍 {selectedFestival.title}
            </div>
          )}
        </MapMarker>
      )}

      {/* 2. 주변 추천 장소 마커들 (클러스터링 적용) */}
      <MarkerClusterer
        averageCenter={true} // 클러스터 마커의 위치를 평균점으로 설정
        minLevel={6} // 6레벨 이상에서 클러스터링 시작
      >
        {filteredMarkers.map((marker) => (
          marker.lat && marker.lng && (
            <MapMarker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerClick(marker)}
            >
              {/* 클러스터링 수준에서는 설명 바를 숨김 */}
              {!isClustered && (
                <div className="p-1 px-2 text-slate-700 text-[10px] bg-white/90 rounded border border-slate-100 whitespace-nowrap">
                  {marker.type === "food" ? "🍽️" : marker.type === "tour" ? "⛰️" : "🎉"} {marker.title}
                </div>
              )}
            </MapMarker>
          )
        ))}
      </MarkerClusterer>

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