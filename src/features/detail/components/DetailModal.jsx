import React, { useEffect, useRef } from 'react'; // Import useEffect and useRef
import { X, MapPin, Phone, Globe } from 'lucide-react';

const InfoBox = ({ label, children }) => {
  if (!children) return null;



  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <span className="text-[11px] text-slate-400 font-bold block mb-1">
        {label}
      </span>
      <div className="text-sm text-slate-700 font-medium">{children}</div>
    </div>
  );
};

const HtmlText = ({ value, fallback = '정보 없음' }) => (
  <span dangerouslySetInnerHTML={{ __html: value || fallback }} />
);

const CommonDetailSection = ({ data }) => (
  <section className="space-y-4">
    {data?.overview && (
      <div>
        <h4 className="text-base font-black text-slate-800 mb-3">
          장소 개요
        </h4>
        <p
          className="text-sm text-slate-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: data.overview }}
        />
      </div>
    )}

    <div className="grid grid-cols-1 gap-3">
      {data?.homepage && (
        <InfoBox label="홈페이지">
          <div
            className="text-purple-600 break-all"
            dangerouslySetInnerHTML={{ __html: data.homepage }}
          />
        </InfoBox>
      )}

      {(data?.tel || data?.telname) && (
        <InfoBox label="문의처">
          {data.telname && <span className="mr-2">[{data.telname}]</span>}
          {data.tel}
        </InfoBox>
      )}

      {data?.zipcode && <InfoBox label="우편번호">{data.zipcode}</InfoBox>}
    </div>
  </section>
);

const FoodDetailSection = ({ data }) => (
  <section className="space-y-4">
    <h4 className="text-base font-black text-orange-500">맛집 상세 정보</h4>

    <InfoBox label="대표 메뉴">
      <HtmlText value={data?.firstmenu} />
    </InfoBox>

    <InfoBox label="취급 메뉴">
      <HtmlText value={data?.treatmenu} />
    </InfoBox>

    <InfoBox label="영업시간">
      <HtmlText value={data?.opentimefood} />
    </InfoBox>

    <InfoBox label="쉬는날">
      <HtmlText value={data?.restdatefood} />
    </InfoBox>
  </section>
);

const TourDetailSection = ({ data }) => (
  <section className="space-y-4">
    <h4 className="text-base font-black text-green-500">관광지 상세 정보</h4>

    <InfoBox label="이용시간">
      <HtmlText value={data?.usetime} />
    </InfoBox>

    <InfoBox label="쉬는날">
      <HtmlText value={data?.restdate} />
    </InfoBox>

    <InfoBox label="주차 시설">
      <HtmlText value={data?.parking} />
    </InfoBox>

    <InfoBox label="문의 및 안내">
      <HtmlText value={data?.infocenter} />
    </InfoBox>

    <InfoBox label="반려동물">
      {data?.chkpet || '정보 없음'}
    </InfoBox>

    <InfoBox label="유모차 대여">
      {data?.chkbabycarriage || '정보 없음'}
    </InfoBox>
  </section>
);

const EventDetailSection = ({ data }) => {
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr || '정보 없음';
    return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}.${dateStr.substring(6, 8)}`;
  };

  return (
    <section className="space-y-4">
      <h4 className="text-base font-black text-blue-500">공연/행사 상세 정보</h4>

      <InfoBox label="행사 기간">
        {formatDate(data?.eventstartdate)} ~ {formatDate(data?.eventenddate)}
      </InfoBox>

      <InfoBox label="행사 장소">
        {data?.eventplace || '정보 없음'}
      </InfoBox>

      <InfoBox label="이용 요금">
        <HtmlText value={data?.usefee} />
      </InfoBox>

      <InfoBox label="주요 프로그램">
        <HtmlText value={data?.program} />
      </InfoBox>

      <InfoBox label="공연 시간">
        {data?.playtime || '정보 없음'}
      </InfoBox>
    </section>
  );
};

const CultureDetailSection = ({ data }) => (
  <section className="space-y-4">
    <h4 className="text-base font-black text-blue-500">문화시설 상세 정보</h4>

    <InfoBox label="이용시간">
      <HtmlText value={data?.usetimeculture} />
    </InfoBox>

    <InfoBox label="쉬는날">
      <HtmlText value={data?.restdateculture} />
    </InfoBox>

    <InfoBox label="이용요금">
      <HtmlText value={data?.usefee} />
    </InfoBox>

    <InfoBox label="관람 소요시간">
      {data?.spendtime || '정보 없음'}
    </InfoBox>

    <InfoBox label="주차 시설">
      <HtmlText value={data?.parkingculture} />
    </InfoBox>

    <InfoBox label="문의 및 안내">
      <HtmlText value={data?.infocenterculture} />
    </InfoBox>

    <InfoBox label="반려동물">
      {data?.chkpetculture || '정보 없음'}
    </InfoBox>

    <InfoBox label="유모차 대여">
      {data?.chkbabycarriageculture || '정보 없음'}
    </InfoBox>
  </section>
);

const DetailModal = ({ isOpen, onClose, item, detail, loading }) => {
  const modalRef = useRef(null); // Create a ref for the modal

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isOpen]); // Depend on onClose and isOpen

  if (!isOpen || !item) return null;

  
  const commonInfo = detail?.commonInfo;
  const specificInfo = detail?.specificInfo;
  const typeId = item.contenttypeid || item.contentTypeId;

  const image =
    item.firstimage ||
    item.firstimage2 ||
    item.first_image ||
    item.first_image2 ||
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800';

  const address = `${item.addr1 || ''} ${item.addr2 || ''}`.trim();

  const handleDirections = () => {
    const lat = item.mapy || item.lat;
    const lng = item.mapx || item.lng;

    if (!lat || !lng) return;

    window.open(
      `https://map.kakao.com/link/to/${item.title},${lat},${lng}`,
      '_blank'
    );
  };

  const renderDetailSection = () => {
    if (loading) {
      return (
        <p className="text-center text-sm text-slate-400 py-10">
          상세 정보를 불러오는 중...
        </p>
      );
    }

    if (!detail) {
      return (
        <p className="text-center text-sm text-slate-400 py-10">
          상세 정보를 불러올 수 없습니다.
        </p>
      );
    }

    return (
      <div className="space-y-8">
        <CommonDetailSection data={commonInfo} />

        {typeId === '39' && <FoodDetailSection data={specificInfo} />}
        {typeId === '12' && <TourDetailSection data={specificInfo} />}
        {typeId === '14' && <CultureDetailSection data={specificInfo} />}
        {typeId === '15' && <EventDetailSection data={specificInfo} />}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef} // Attach ref here
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all scale-100 opacity-100 no-scrollbar"
      >
        <style>{`
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera*/
          }
        `}</style>
        <div className="relative">
          <img
            src={image}
            alt={item.title}
            className="w-full h-64 object-cover rounded-t-3xl"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-3xl font-black text-gray-900">
              {item.title || '이름 없음'}
            </h3>

            {address && (
              <p className="flex items-start gap-2 text-gray-600 font-bold mt-3">
                <MapPin size={20} className="text-purple-500 shrink-0 mt-0.5" />
                {address}
              </p>
            )}

            {item.tel && (
              <p className="flex items-center gap-2 text-gray-600 font-bold mt-2">
                <Phone size={20} className="text-purple-500 shrink-0" />
                {item.tel}
              </p>
            )}
          </div>

          {renderDetailSection()}




        </div>
      </div>
    </div>

  );
};

export default DetailModal;