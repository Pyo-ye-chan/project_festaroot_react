import { useEffect, useRef } from 'react';
import { MapPin, Map as MapIcon } from 'lucide-react';

const FestivalMapTab = ({ location, mapX, mapY, title }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapX || !mapY) return;
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const position = new window.kakao.maps.LatLng(mapY, mapX);

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: position,
        level: 4,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
      });

      map.setDraggable(false);
      map.setZoomable(false);

      const marker = new window.kakao.maps.Marker({
        position,
        map,
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:13px;font-weight:bold;">${title || '축제 위치'}</div>`,
      });

      infoWindow.open(map, marker);
    });
  }, [mapX, mapY, title]);



  return (
    <div>
      <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <MapIcon size={24} className="text-purple-600" />
        위치 정보
      </h3>

      <div
        ref={mapRef}
        className="w-full aspect-video bg-gray-100 rounded-[2.5rem] border border-gray-100 overflow-hidden mb-6"
      />

      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
        <p className="font-bold text-gray-800 flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-purple-600" />
          {location || '주소 정보 없음'}
        </p>


      </div>
    </div>
  );
};

export default FestivalMapTab;