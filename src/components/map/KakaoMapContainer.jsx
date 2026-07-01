import { useState, useEffect } from "react";
import { Map, MapMarker, Circle, MarkerClusterer, CustomOverlayMap } from "react-kakao-maps-sdk";
import useMapStore from "../../store/useMapStore";

function KakaoMapContainer() {
  const { searchParams, activeCategory, places, festivals, selectedPlace, setSelectedPlace, fetchPlaceDetail, setSelectedFestival } = useMapStore();
  const { radius, selectedFestival } = searchParams;

  // 1. 초기 레벨 설정 및 상태 관리 (선택된 기준 축제가 없을 때는 전국이 잘 보이기 위해 10레벨로 설정)
  const initialLevel = selectedFestival ? (radius > 15 ? 8 : radius > 10 ? 7 : radius > 5 ? 6 : 5) : 10;
  const [level, setLevel] = useState(initialLevel);

  // radius나 selectedPlace가 변경될 때마다 레벨 업데이트 (상세 정보 볼 때는 줌인)
  useEffect(() => {
    if (selectedPlace) {
      setLevel(4); // 상세 정보 클릭 시 4레벨로 줌인
    } else {
      setLevel(initialLevel);
    }
  }, [radius, selectedPlace, selectedFestival]);

  // 2. 기준 좌표 설정 (기준 축제가 없으면 대전 등 대한민국의 중앙 부근을 바라보도록 설정)
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
    // 값이 없거나 유효하지 않으면 대전을 중심으로 설정해 전국 마커가 고루 보이게 유도
    return { lat: 36.3504, lng: 127.3845 };
  };

  const center = getCenter();

  // 3. 카테고리에 따른 마커 필터링 (선택된 축제가 없을 때는 현재 진행 중인 모든 축제를 마커로 매핑)
  const getFilteredMarkers = () => {
    if (selectedFestival) {
      return places.filter(place => {
        if (activeCategory === '전체') return true;
        if (activeCategory === '음식점') return place.type === 'food';
        if (activeCategory === '관광지') return place.type === 'tour';
        if (activeCategory === '문화시설') return place.type === 'culture';
        return true;
      });
    } else {
      // 오늘 날짜 구하기 (YYYYMMDD 형식 문자열)
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}${month}${day}`;

      const ongoing = festivals.filter(f => {
        const start = f.event_start_date;
        const end = f.event_end_date;
        return start && end && start <= todayStr && end >= todayStr;
      });

      return ongoing.map(f => ({
        id: f.content_id,
        title: f.title,
        lat: parseFloat(f.map_y),
        lng: parseFloat(f.map_x),
        type: 'festival',
        img: f.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&q=80',
        addr: f.addr1,
        startDate: f.event_start_date,
        endDate: f.event_end_date,
        originalFestival: f
      }));
    }
  };

  const filteredMarkers = getFilteredMarkers();

  // 4. 원의 반지름 유효성 확인
  const isValidRadius = !isNaN(radius) && radius > 0;

  // 5. 클러스터링 적용 여부 (MarkerClusterer의 minLevel=6과 동일하게 설정)
  const isClustered = level >= 6;

  const handleMarkerClick = (marker) => {
    if (marker.type === 'festival') {
      // 진행 중인 축제 마커 클릭 시 해당 축제를 바로 기준 축제로 지정하여 주변 탐색 활성화
      setSelectedFestival(marker.originalFestival);
    } else {
      setSelectedPlace(marker);
      fetchPlaceDetail(marker.id, marker.contentTypeId);
    }
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
        <>
          <MapMarker 
            position={center}
            zIndex={10}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              size: { width: 24, height: 35 }
            }}
          />
          {/* 설명 바 오버레이 */}
          {!isClustered && (
            <CustomOverlayMap 
              position={center} 
              yAnchor={1.4} // 마커 위쪽으로 위치 조정
              zIndex={11}
            >
              <div className="relative flex flex-col items-center">
                <div className="px-3 py-1.5 bg-[#6B46FE] text-white font-bold text-[11px] rounded-full shadow-xl flex items-center gap-1.5 border-2 border-white whitespace-nowrap">
                  <span className="text-[12px]">📍</span>
                  {selectedFestival.title}
                </div>
                {/* Arrow (Tail) */}
                <div className="w-2.5 h-2.5 bg-[#6B46FE] rotate-45 -mt-1.5 border-r-2 border-b-2 border-white shadow-lg" />
              </div>
            </CustomOverlayMap>
          )}
        </>
      )}

      {/* 2. 주변 추천 장소 마커들 (클러스터링 적용) */}
      <MarkerClusterer
        averageCenter={true} // 클러스터 마커의 위치를 평균점으로 설정
        minLevel={6} // 6레벨 이상에서 클러스터링 시작
      >
        {filteredMarkers.map((marker) => (
          marker.lat && marker.lng && (
            <div key={marker.id}>
              <MapMarker
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => handleMarkerClick(marker)}
              />
              {/* 설명 바 오버레이 */}
              {!isClustered && (
                <CustomOverlayMap 
                  position={{ lat: marker.lat, lng: marker.lng }} 
                  yAnchor={2.2} // 마커 위쪽으로 위치 조정
                >
                  <div className="relative flex flex-col items-center group pointer-events-none">
                    <div className="px-2 py-1 bg-white text-slate-700 font-bold text-[10px] rounded-full shadow-md flex items-center gap-1.5 border border-slate-100 whitespace-nowrap">
                      <span className="w-5 h-5 flex items-center justify-center bg-slate-50 rounded-full text-[11px]">
                        {marker.type === "food" ? "🍽️" : marker.type === "tour" ? "⛰️" : "🎉"}
                      </span>
                      {marker.title}
                    </div>
                    {/* Arrow (Tail) */}
                    <div className="w-2 h-2 bg-white rotate-45 -mt-1 border-r border-b border-slate-100 shadow-sm" />
                  </div>
                </CustomOverlayMap>
              )}
            </div>
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