import { MapPin, Phone, Tent, Utensils, Music } from 'lucide-react';

const NearbyCardList = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-gray-400 font-bold">표시할 주변 정보가 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {items.map((item) => {
        const image =
          item.first_image ||
          item.first_image2 ||
          'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800';

        const address = `${item.addr1 || ''} ${item.addr2 || ''}`.trim();

        return (
          <div
            key={item.content_id}
            className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
          >
            <img src={image} alt={item.title} className="w-full h-40 object-cover" />

            <div className="p-5">
              <h4 className="font-black text-gray-900 text-lg mb-2 line-clamp-1">
                {item.title || '이름 없음'}
              </h4>

              <p className="text-sm text-gray-500 font-bold line-clamp-2 flex items-start gap-1">
                <MapPin size={16} className="text-purple-500 mt-0.5 shrink-0" />
                {address || '주소 정보 없음'}
              </p>

              {item.tel && (
                <p className="text-sm text-gray-500 font-bold mt-2 flex items-center gap-1">
                  <Phone size={16} className="text-purple-500 shrink-0" />
                  {item.tel}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FestivalNearbyTab = ({
  nearbyLoading,
  nearbyTravel,
  nearbyFood,
  nearbyEvents,
}) => {
  if (nearbyLoading) {
    return <p className="text-gray-400 font-bold">주변 정보를 불러오는 중...</p>;
  }

  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Tent size={24} className="text-green-500" />
          주변 여행지
        </h3>
        <NearbyCardList items={nearbyTravel} />
      </section>

      <section>
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Utensils size={24} className="text-orange-500" />
          주변 맛집
        </h3>
        <NearbyCardList items={nearbyFood} />
      </section>

      <section>
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Music size={24} className="text-blue-500" />
          주변 공연/행사
        </h3>
        <NearbyCardList items={nearbyEvents} />
      </section>
    </div>
  );
};

export default FestivalNearbyTab;