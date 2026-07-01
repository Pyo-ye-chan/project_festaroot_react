import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  Navigation,
  MessageCircle,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Info,
  ChevronRight,
  List
} from 'lucide-react';

import { getFestivalDetail, getFestivalImages } from '../../../api/FestivalApi';
import useAuthStore from '../../../store/useAuthStore';
import { saveActivityLog } from '../../../api/activityApi';
import festivalService from '../../../api/festivalService';

import FestivalMapTab from '../components/FestivalMapTab';
import FestivalReviewTab from '../components/FestivalReviewTab';
import FestivalIntroTab from '../components/FestivalIntroTab';
import FestivalNearbyTab from '../components/FestivalNearbyTab';
import LoginMessage from '../../../components/LoginMessage';

const FestivalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoggedIn, user } = useAuthStore();

  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('소개');
  const [isLiked, setIsLiked] = useState(false);
  const [sortType, setSortType] = useState('최신순');

  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 유도 모달 상태 추가

  const [festivalImages, setFestivalImages] = useState([]);
  const [nearbyTravel, setNearbyTravel] = useState([]);
  const [nearbyFood, setNearbyFood] = useState([]);
  const [nearbyCultures, setNearbyCultures] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const tabs = ['소개', '주변 정보', '오시는 길', '후기'];

  const currentMemberId =
    user?.member_id ||
    user?.id ||
    user?.userId;

  // 축제 상세 정보 조회
  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const data = await getFestivalDetail(id);
        setFestival(data);

        if (data && isLoggedIn) {
          saveActivityLog({
            type: 'VIEW',
            festivalId: id
          });
        }
      } catch (error) {
        console.error('축제 상세 정보 불러오기 실패:', error);
      } finally {
        loading && setLoading(false);
      }
    };

    fetchFestival();
  }, [id, isLoggedIn]);

  // 축제 이미지 목록 조회
  useEffect(() => {
    if (!festival?.content_id) return;

    const fetchFestivalImages = async () => {
      try {
        const data = await getFestivalImages(festival.content_id);
        setFestivalImages(data || []);
      } catch (error) {
        console.error('축제 이미지 불러오기 실패:', error);
        setFestivalImages([]);
      }
    };

    fetchFestivalImages();
  }, [festival?.content_id]);

  // 주변 관광지, 음식점, 문화시설 조회
  useEffect(() => {
    if (!festival?.map_x || !festival?.map_y) return;

    const fetchNearbyData = async () => {
      try {
        setNearbyLoading(true);

        const [travel, food, cultures] = await Promise.all([
          festivalService.getNearbyPlaces(festival.map_y, festival.map_x, 5000, '12'),
          festivalService.getNearbyPlaces(festival.map_y, festival.map_x, 5000, '39'),
          festivalService.getNearbyPlaces(festival.map_y, festival.map_x, 5000, '14')
        ]);

        setNearbyTravel(travel || []);
        setNearbyFood(food || []);
        setNearbyCultures(cultures || []);
      } catch (error) {
        console.error('주변 정보 조회 실패:', error);
        setNearbyTravel([]);
        setNearbyFood([]);
        setNearbyCultures([]);
      } finally {
        setNearbyLoading(false);
      }
    };

    fetchNearbyData();
  }, [festival?.map_x, festival?.map_y]);

  // 사용자의 찜 여부 조회
  useEffect(() => {
    if (!festival?.content_id) return;
    if (!isLoggedIn) return;
    if (!currentMemberId) return;

    const fetchLikeStatus = async () => {
      try {
        const likedIds = await festivalService.getMyFestivalLikedIds(currentMemberId);

        setIsLiked(
          likedIds.includes(Number(festival.content_id))
        );
      } catch (error) {
        console.error('찜 여부 조회 실패:', error);
      }
    };

    fetchLikeStatus();
  }, [festival?.content_id, isLoggedIn, currentMemberId]);

  const DEFAULT_IMAGE =
    festival?.first_image ||
    festival?.first_image2 ||
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2070';

  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return '-';

    return `${dateString.slice(0, 4)}.${dateString.slice(4, 6)}.${dateString.slice(6, 8)}`;
  };

  const getFestivalStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return '정보없음';

    const today = new Date();
    const todayStr =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    if (todayStr < startDate) return '예정';
    if (todayStr > endDate) return '종료';
    return '진행중';
  };

  const getStatusBadge = (status) => {
    const base = 'px-4 py-1.5 rounded-full text-xs font-black shadow-sm ';

    switch (status) {
      case '진행중':
        return base + 'bg-green-500 text-white animate-pulse';
      case '예정':
        return base + 'bg-blue-500 text-white';
      case '종료':
        return base + 'bg-gray-400 text-white';
      default:
        return base + 'bg-gray-100 text-gray-500';
    }
  };

  // 로그인 체크 후 모임 상세페이지 화면으로 바로 라우팅 전환
  const handleFestivalChatClick = () => {
    if (!isLoggedIn || !currentMemberId) {
      setIsLoginModalOpen(true);
      return;
    }


    alert("축제 모임 페이지로 이동합니다! \n채팅방 참여를 원할 시 모임 참여를 눌러주세요!");

    // 기본적으로 음수 식별자(-content_id)를 생성하여 모임 상세페이지로 화면만 전환
    const officialFestivalRoomId = -Math.abs(Number(id));
    navigate(`/community/gathering/${officialFestivalRoomId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">축제 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">축제 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const status = getFestivalStatus(
    festival.event_start_date,
    festival.event_end_date
  );

  const imageUrl = festival.first_image || festival.first_image2 || DEFAULT_IMAGE;

  const period = `${formatDate(festival.event_start_date)} ~ ${formatDate(festival.event_end_date)}`;

  const location = `${festival.addr1 || ''} ${festival.addr2 || ''}`.trim();
  const isPopulationDecline = festival.is_population_decline_yn === 'Y';
  const digitalTourCardUrl =
    'https://korean.visitkorea.or.kr/dgtourcard/biz/main/main.do';

  const openKakaoMap = () => {
    const lat = festival?.map_y;
    const lng = festival?.map_x;

    if (!lat || !lng) {
      alert('위치 Information이 없습니다.');
      return;
    }

    const url = `https://map.kakao.com/link/to/${location},${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleLikeClick = async () => {
    if (!isLoggedIn || !currentMemberId) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const result = await festivalService.toggleFestivalLike(festival.content_id);

      setIsLiked(result.isLiked);

      setFestival((prev) => ({
        ...prev,
        like_count: result.like_count
      }));
    } catch (error) {
      console.error('찜 처리 실패:', error);
      alert('찜 처리 중 오류가 발생했습니다.');
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('축제 링크가 복사되었습니다.');
      setShowShareModal(false);
    } catch (error) {
      console.error('링크 복사 실패:', error);
      alert('링크 복사에 실패했습니다.');
    }
  };

  const shareUrl = `${window.location.origin}/festival/${festival.content_id}`;

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      alert('카카오 공유 기능을 불러오지 못했습니다.');
      return;
    }

    const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

    if (!kakaoKey) {
      alert('카카오 JavaScript 키가 설정되지 않았습니다.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
    }

    const festivalId = festival?.content_id || festival?.contentId;
    const shareUrl = `${window.location.origin}/festival/${festivalId}`;

    const descriptionText = `${period} · ${location || '주소 정보 없음'}`;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: festival?.title || '축제로',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
        description: `${shareUrl}\n\n${descriptionText}`,
        imageUrl: imageUrl || `${window.location.origin}/no-image.png`,
      },
      buttons: [
        {
          title: '축제 보러가기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });

    setShowShareModal(false);
  };

  return (
    <>
      <div className="bg-gray-50/30 min-h-screen pb-20 font-['Pretendard']">
        <section className="relative h-[400px] md:h-[500px]">
          <img
            src={imageUrl}
            alt={festival.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6">
            {isPopulationDecline && (
              <div className="mb-3 inline-flex max-w-full flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-white shadow-lg backdrop-blur-md">
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-orange-200">
                    디지털 관광주민증
                  </p>
                  <p className="text-xs md:text-sm font-bold text-white/90">
                    인구감소지역 여행 혜택을 공식 페이지에서 확인해보세요.
                  </p>
                </div>

                <a
                  href={digitalTourCardUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-white px-3.5 py-2 text-[11px] font-black text-slate-900 transition-all hover:bg-orange-50 active:scale-95"
                >
                  혜택 보기
                  <ChevronRight size={14} />
                </a>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={getStatusBadge(status)}>● {status}</span>

              {isPopulationDecline && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-100/95 px-4 py-1.5 text-xs font-black text-amber-950 shadow-sm backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  인구감소지역
                </span>
              )}

              {festival.themes?.map((theme, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/30"
                >
                  #{theme.theme_name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-md">
              {festival.title}
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 font-bold">
                    <Calendar size={20} className="text-purple-500" />
                    <span>{period}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 font-bold">
                    <MapPin size={20} className="text-purple-500" />
                    <span>{location || '주소 정보 없음'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleLikeClick}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isLiked
                      ? 'bg-rose-50 border-rose-100 text-rose-500'
                      : 'bg-white border-gray-100 text-gray-400 hover:text-rose-500'
                      }`}
                  >
                    <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={handleShareClick}
                    className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all duration-300"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-50">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                    <Info size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">
                      행사 장소
                    </p>
                    <p className="font-bold text-gray-800">
                      {festival.spon_place || '정보 없음'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                    <Phone size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-bold mb-1">
                      문의처
                    </p>
                    <p className="font-bold text-gray-800">
                      {festival.sponsor1_tel || '정보 없음'}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                    <Globe size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-bold mb-1">
                      홈페이지
                    </p>

                    {festival.homepage ? (
                      <a
                        href={festival.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-purple-600 hover:underline truncate block"
                      >
                        {festival.homepage}
                      </a>
                    ) : (
                      <p className="font-bold text-gray-800">정보 없음</p>
                    )}

                    {festival.tourism_portal_url && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-400 font-bold mb-1">
                          지역 관광 포털
                        </p>
                        <a
                          href={festival.tourism_portal_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-purple-600 hover:underline truncate flex items-center gap-2"
                        >
                          {festival.tourism_portal_url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 top-24 z-30 flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition-all ${activeTab === tab
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
              {activeTab === '소개' && (
                <FestivalIntroTab
                  festival={festival}
                  imageUrl={imageUrl}
                  festivalImages={festivalImages}
                />
              )}

              {activeTab === '주변 정보' && (
                <FestivalNearbyTab
                  nearbyLoading={nearbyLoading}
                  nearbyTravel={nearbyTravel}
                  nearbyFood={nearbyFood}
                  nearbyCultures={nearbyCultures}
                />
              )}

              {activeTab === '오시는 길' && (
                <FestivalMapTab
                  location={location}
                  mapX={festival.map_x}
                  mapY={festival.map_y}
                  title={festival.title}
                />
              )}

              {activeTab === '후기' && (
                <FestivalReviewTab
                  festival={festival}
                  sortType={sortType}
                  setSortType={setSortType}
                />
              )}
            </div>

            <div className="bg-white rounded-[2.5rem] p-7 md:p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-[10px] font-black text-gray-900 shadow-sm">
                      FESTA ROUTE
                    </span>

                    <span className="bg-purple-600 px-3 py-1.5 rounded-full text-[10px] font-black text-white shadow-sm">
                      MORE FESTIVALS
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    다른 축제도 둘러보시겠어요?
                  </h3>

                  <p className="text-gray-500 mt-2 font-bold text-sm">
                    지역별, 날짜별로 원하는 축제를 다시 찾아볼 수 있어요.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/search')}
                  className="h-13 px-6 py-4 bg-white border border-gray-200 text-gray-600 font-black rounded-2xl hover:bg-gray-50 hover:text-purple-600 hover:border-purple-100 transition-all duration-300 text-sm shadow-sm active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <List size={18} />
                  축제 목록 보러가기
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
              <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-400 rounded-full" />
                지금 가볼까요?
              </h3>

              <p className="text-slate-400 font-bold text-sm mb-8">
                가장 빠른 경로를 찾아드려요.
              </p>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Navigation size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-lg font-black">
                      {location || '주소 정보 없음'}
                    </p>
                  </div>
                </div>

                <button
                  className="w-full h-14 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                  onClick={openKakaoMap}
                >
                  카카오맵으로 길찾기
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* 실시간 오픈채팅방 링크 버튼 카드 */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <MessageCircle size={100} />
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2">
                실시간 오픈채팅방
              </h3>

              <p className="text-gray-400 font-bold text-sm mb-8">
                현장 분위기를 실시간으로 물어보세요!
              </p>

              <button
                onClick={handleFestivalChatClick}
                className="w-full h-14 bg-purple-50 text-purple-600 font-black rounded-2xl hover:bg-purple-100 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                채팅방 입장하기
              </button>
            </div>
          </div>
        </div>

        {/* 공유 모달 */}
        {showShareModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-2xl">
              <h3 className="text-xl font-black text-gray-900 mb-2">
                축제 공유하기
              </h3>

              <p className="text-sm text-gray-500 font-medium mb-6">
                친구에게 이 축제를 공유해보세요.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleKakaoShare}
                  className="w-full py-4 rounded-2xl bg-[#FEE500] text-[#181600] font-black hover:brightness-95 transition-all"
                >
                  카카오톡으로 공유하기
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-4 rounded-2xl bg-gray-100 text-gray-700 font-black hover:bg-gray-200 transition-all"
                >
                  링크 복사하기
                </button>

                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-3 text-sm text-gray-400 font-bold hover:text-gray-600"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 로그인 유도 커스텀 모달 컴포넌트 추가 */}
      <LoginMessage
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default FestivalDetailPage;
