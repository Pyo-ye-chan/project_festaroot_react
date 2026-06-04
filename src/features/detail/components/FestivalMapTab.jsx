import { MapPin, Map as MapIcon } from 'lucide-react';

const FestivalMapTab = ({ location }) => {
  return (
    <div>
      <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <MapIcon size={24} className="text-purple-600" />
        위치 정보
      </h3>

      <div className="w-full aspect-video bg-gray-100 rounded-[2.5rem] border border-gray-100 flex items-center justify-center mb-6">
        <p className="text-gray-400 font-bold">지도 API 연동 영역</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
        <p className="font-bold text-gray-800 flex items-center gap-2 mb-2">
          <MapPin size={18} className="text-purple-600" />
          {location || '주소 정보 없음'}
        </p>
      </div>
    </div>
  );
};

export default FestivalMapTab;