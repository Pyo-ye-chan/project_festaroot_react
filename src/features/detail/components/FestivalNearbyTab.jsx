import React, { useState } from 'react';
import { MapPin, Phone, Tent, Utensils, Music, Map as MapIcon } from 'lucide-react';
import Carousel from '../components/Carousel';
import DetailModal from '../components/DetailModal';
import festivalService from '../../../api/festivalService';

const FestivalNearbyTab = ({
  nearbyLoading,
  nearbyTravel,
  nearbyFood,
  nearbyCultures, // nearbyEvents -> nearbyCultures
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailCache, setDetailCache] = useState({});

  const handleItemClick = async (item) => {
    const typeId = String(item.contenttypeid || item.contentTypeId);
    const contentId = item.contentid || item.content_id;
    const cacheKey = `${typeId}-${contentId}`;

    setSelectedItem(item);
    setIsModalOpen(true);

    if (detailCache[cacheKey]) {
      setDetail(detailCache[cacheKey]);
      setDetailLoading(false);
      return;
    }

    setDetail(null);
    setDetailLoading(true);

    try {
      let data = null;

      if (typeId === '39') {
        data = await festivalService.getFoodDetail(contentId);
      } else if (typeId === '12') {
        data = await festivalService.getTourDetail(contentId);
      } else if (typeId === '14') { // 15 -> 14
        data = await festivalService.getCultureDetail(contentId);
      }

      setDetail(data);
      setDetailCache((prev) => ({
        ...prev,
        [cacheKey]: data,
      }));
    } catch (error) {
      console.error('상세 정보 조회 실패:', error);
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setDetail(null);
  };

  const renderNearbyCard = (item) => {
    const image =
      item.firstimage ||
      item.firstimage2 ||
      item.first_image ||
      item.first_image2 ||
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800';

    const address = `${item.addr1 || ''} ${item.addr2 || ''}`.trim();

    return (
      <div className="h-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-md transition-all cursor-pointer">
        <img src={image} alt={item.title} className="w-full h-40 object-cover" />

        <div className="p-5 h-[130px] flex flex-col">
          <h4 className="font-black text-gray-900 text-base mb-2 line-clamp-1">
            {item.title || '이름 없음'}
          </h4>

          <p className="text-sm text-gray-500 font-bold line-clamp-2 flex items-start gap-1 min-h-[40px]">
            <MapPin size={16} className="text-purple-500 mt-0.5 shrink-0" />
            {address || '주소 정보 없음'}
          </p>

          {item.tel && (
            <p className="text-sm text-gray-500 font-bold mt-auto flex items-center gap-1">
              <Phone size={16} className="text-purple-500 shrink-0" />
              {item.tel}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (nearbyLoading) {
    return <p className="text-gray-400 font-bold">주변 정보를 불러오는 중...</p>;
  }

  return (
    <div className="space-y-12">
      <Carousel
        items={nearbyTravel}
        title={<><Tent size={24} className="text-green-500" /> 주변 여행지</>}
        renderItem={renderNearbyCard}
        onItemClick={handleItemClick}
      />

      <Carousel
        items={nearbyFood}
        title={<><Utensils size={24} className="text-orange-500" /> 주변 맛집</>}
        renderItem={renderNearbyCard}
        onItemClick={handleItemClick}
      />

      <Carousel
        items={nearbyCultures}
        title={<><MapIcon size={24} className="text-blue-500" /> 주변 문화시설</>}
        renderItem={renderNearbyCard}
        onItemClick={handleItemClick}
      />

      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        detail={detail}
        loading={detailLoading}
      />
    </div>
  );
};

export default FestivalNearbyTab;