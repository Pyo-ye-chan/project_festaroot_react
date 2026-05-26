import { Map, MapMarker, Circle } from "react-kakao-maps-sdk";

function KakaoMapContainer() {
  // 기준이 되는 축제 중심 좌표 (태안 세계튤립축제 근처 임시 좌표)
  const centerFestival = { lat: 36.65, lng: 126.33 };

  // 임시로 지도 위에 띄울 주변 음식점/관광지 마커 좌표 데이터
  const mockMarkers = [
    { id: 1, title: "태안 회센터", lat: 36.6521, lng: 126.3345, type: "food" },
    { id: 2, title: "꽃지 해물칼국수", lat: 36.6590, lng: 126.3420, type: "food" },
    { id: 3, title: "꽃지 해수욕장", lat: 36.6415, lng: 126.3211, type: "tour" },
  ];

  return (
    <Map
      center={centerFestival}
      style={{ width: "100%", height: "100%" }}
      level={5} // 지도 확대/축소 레벨
    >
      {/* 1. 중심 축제 위치 마커 (보라색이나 큰 마커로 구별 가능) */}
      <MapMarker 
        position={centerFestival}
        clickable={true}
      >
        <div style={{ padding: "5px", color: "#6366F1", fontWeight: "bold", fontSize: "12px" }}>
          📍 태안 세계튤립축제
        </div>
      </MapMarker>

      {/* 2. 주변 추천 장소 마커들을 반복문으로 표시 */}
      {mockMarkers.map((marker) => (
        <MapMarker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          clickable={true}
          onClick={() => alert(`${marker.title} 클릭됨`)}
        >
          <div style={{ padding: "4px", fontSize: "11px", color: "#334155" }}>
            {marker.type === "food" ? " can 🧡 " : " 💚 "} {marker.title}
          </div>
        </MapMarker>
      ))}

      {/* 3. 디자인 시안에 있던 5km 반경 투명 원 그리기 */}
      <Circle
        center={centerFestival}
        radius={5000} // 5000m = 5km
        strokeWeight={1}
        strokeColor={"#6366F1"}
        strokeOpacity={0.6}
        strokeStyle={"dash"}
        fillColor={"#6366F1"}
        fillOpacity={0.05}
      />
    </Map>
  );
}

export default KakaoMapContainer;