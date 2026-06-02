import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Star,
  ChevronRight,
  ChevronLeft,
  Camera,
  ThumbsUp,
  Map as MapIcon,
  Tent,
  Utensils,
  Music,
  User,
  Send
} from 'lucide-react';
import { getFestivalDetail } from '../../../api/FestivalApi';


const FestivalDetailPage = () => {
  const { id } = useParams();

  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('소개');
  const [isLiked, setIsLiked] = useState(false);
  const [sortType, setSortType] = useState('최신순');
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, user: '운영진', text: '축제 실시간 채팅방에 오신 것을 환영합니다! 🌟', time: '오후 2:00' },
    { id: 2, user: '루키', text: '지금 사람 많이 붐비나요?', time: '오후 2:05' }
  ]);

  const tabs = ['소개', '주변 정보', '오시는 길', '후기'];

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const data = await getFestivalDetail(id);
        setFestival(data);
        console.log('축제 상세 정보:', data);
      } catch (error) {
        console.error('축제 상세 정보 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFestival();
  }, [id]);

  const DEFAULT_IMAGE = festival?.first_image || festival?.first_image2 || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2070";

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

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatHistory.length + 1,
      user: '나',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setChatHistory([...chatHistory, newMessage]);
    setChatMessage('');
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

  const status = getFestivalStatus(festival.event_start_date, festival.event_end_date);
  const imageUrl = festival.first_image || festival.first_image2 || DEFAULT_IMAGE;
  const period = `${formatDate(festival.event_start_date)} ~ ${formatDate(festival.event_end_date)}`;
  const location = `${festival.addr1 || ''} ${festival.addr2 || ''}`.trim();

  const reviews = festival.reviews || [];
  const nearbyTravel = festival.nearbyTravel || [];
  const nearbyFood = festival.nearbyFood || [];
  const nearbyEvents = festival.nearbyEvents || [];

  return (
    <div className="bg-gray-50/30 min-h-screen pb-20 font-['Pretendard']">
      <section className="relative h-[400px] md:h-[500px]">
        <img src={imageUrl} alt={festival.title} className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={getStatusBadge(status)}>● {status}</span>
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/30">
              #축제
            </span>
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
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                    isLiked
                      ? 'bg-rose-50 border-rose-100 text-rose-500'
                      : 'bg-white border-gray-100 text-gray-400 hover:text-rose-500'
                  }`}
                >
                  <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                </button>

                <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all duration-300">
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
                  <p className="text-xs text-gray-400 font-bold mb-1">행사 장소</p>
                  <p className="font-bold text-gray-800">{festival.spon_place || '정보 없음'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">문의처</p>
                  <p className="font-bold text-gray-800">{festival.sponsor1_tel || '정보 없음'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                  <Globe size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-bold mb-1">홈페이지</p>
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
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 h-14 bg-purple-600 text-white font-black rounded-2xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95">
                  <Navigation size={20} />
                  길찾기
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 top-24 z-30 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition-all ${
                  activeTab === tab
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
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-purple-600 rounded-full" />
                  축제 소개
                </h3>

                <p className="text-gray-600 font-medium leading-relaxed text-lg mb-10 whitespace-pre-line">
                  {festival.overview || '소개 정보가 없습니다.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img
                    src={imageUrl}
                    alt={festival.title}
                    className="rounded-3xl border border-gray-100 w-full object-cover"
                  />
                  {festival.first_image2 && (
                    <img
                      src={festival.first_image2}
                      alt={festival.title}
                      className="rounded-3xl border border-gray-100 w-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === '주변 정보' && (
              <div className="space-y-12">
                <section>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Tent size={24} className="text-green-500" />
                    주변 여행지
                  </h3>
                  <p className="text-gray-400 font-bold">주변 여행지 API 연동 예정</p>
                </section>

                <section>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Utensils size={24} className="text-orange-500" />
                    주변 맛집
                  </h3>
                  <p className="text-gray-400 font-bold">주변 맛집 API 연동 예정</p>
                </section>

                <section>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Music size={24} className="text-blue-500" />
                    주변 공연/행사
                  </h3>
                  <p className="text-gray-400 font-bold">주변 행사 API 연동 예정</p>
                </section>
              </div>
            )}

            {activeTab === '오시는 길' && (
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
                  <p className="text-sm text-gray-500 font-medium">
                    위도: {festival.map_y || '-'} / 경도: {festival.map_x || '-'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === '후기' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                      방문자 후기
                      <span className="text-purple-600">{festival.review_count || 0}</span>
                    </h3>

                    <div className="flex items-center gap-1 mt-1">
                      <Star size={16} fill="#FACC15" className="text-yellow-400" />
                      <span className="text-lg font-black text-gray-800">
                        {festival.rating_avg ? festival.rating_avg.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-xs text-gray-400 font-bold ml-1">/ 5.0</span>
                    </div>
                  </div>

                  <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
                    {['최신순', '추천순'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSortType(type)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                          sortType === type
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-gray-400 font-bold">아직 등록된 후기가 없습니다.</p>

                <button className="w-full mt-10 h-16 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-black hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600 transition-all flex items-center justify-center gap-2">
                  <Camera size={20} />
                  생생한 후기 작성하기
                </button>
              </div>
            )}
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

              <button className="w-full h-14 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                카카오맵으로 길찾기
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <MessageCircle size={100} />
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              실시간 채팅방
            </h3>

            <p className="text-gray-400 font-bold text-sm mb-8">
              현장 분위기를 실시간으로 물어보세요!
            </p>

            <button
              onClick={() => setShowChat(true)}
              className="w-full h-14 bg-purple-50 text-purple-600 font-black rounded-2xl hover:bg-purple-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              채팅방 입장하기
            </button>
          </div>
        </div>
      </div>

      {showChat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[600px]">
            <div className="bg-purple-600 p-6 text-white flex items-center justify-between">
              <div>
                <h4 className="font-black text-lg">실시간 오픈채팅</h4>
                <p className="text-[10px] text-purple-200 font-bold uppercase tracking-widest mt-0.5">
                  Live Festival Talk
                </p>
              </div>

              <button
                onClick={() => setShowChat(false)}
                className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex flex-col ${chat.user === '나' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-gray-400 font-bold mb-1 px-1">
                    {chat.user}
                  </span>

                  <div
                    className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${
                      chat.user === '나'
                        ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-100'
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                    }`}
                  >
                    {chat.text}
                  </div>

                  <span className="text-[9px] text-gray-300 mt-1 px-1">
                    {chat.time}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="w-full h-14 bg-gray-50 rounded-2xl pl-6 pr-14 text-sm font-bold border border-transparent focus:border-purple-300 focus:bg-white outline-none transition-all"
                />

                <button
                  type="submit"
                  className="absolute right-2 top-2 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-100"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalDetailPage;

// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { 
//   Heart, 
//   Share2, 
//   Navigation, 
//   MessageCircle, 
//   Calendar, 
//   MapPin, 
//   Phone, 
//   Globe, 
//   Info, 
//   Star, 
//   Clock, 
//   ChevronRight, 
//   ChevronLeft,
//   Camera,
//   ThumbsUp,
//   Map as MapIcon,
//   Tent,
//   Utensils,
//   Music,
//   User,
//   Send
// } from 'lucide-react';

// // --- Mock Data ---
// const FESTIVAL_DETAIL = {
//   id: 1,
//   name: "2026 별빛 밤거리 페스티벌",
//   status: "진행중", // 예정, 진행중, 종료
//   image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2070",
//   period: "2026.05.28 - 2026.06.01",
//   location: "서울 중구 태평로1가 31 (서울광장 일대)",
//   fee: "무료 (일부 체험 프로그램 유료)",
//   contact: "02-1234-5678",
//   homepage: "https://www.star-night-festa.com",
//   description: "도심 속 밤하늘을 수놓는 별빛 아래, 다채로운 공연과 먹거리가 가득한 낭만적인 밤거리를 즐겨보세요. 매일 밤 8시에는 화려한 레이저 쇼가 펼쳐집니다.",
//   nearbyTravel: [
//     { id: 101, name: "덕수궁", dist: "300m", img: "https://picsum.photos/seed/travel1/200/200" },
//     { id: 102, name: "청계천", dist: "500m", img: "https://picsum.photos/seed/travel2/200/200" },
//     { id: 103, name: "남대문시장", dist: "800m", img: "https://picsum.photos/seed/travel3/200/200" },
//   ],
//   nearbyFood: [
//     { id: 201, name: "명동교자", dist: "900m", type: "한식", rating: 4.5, img: "https://picsum.photos/seed/food1/200/200" },
//     { id: 202, name: "만족오향족발", dist: "400m", type: "한식", rating: 4.4, img: "https://picsum.photos/seed/food2/200/200" },
//     { id: 203, name: "무교동 낙지", dist: "200m", type: "한식", rating: 4.2, img: "https://picsum.photos/seed/food3/200/200" },
//   ],
//   nearbyEvents: [
//     { id: 301, name: "광화문 광장 버스킹", dist: "600m", date: "매주 토요일", img: "https://picsum.photos/seed/event1/200/200" },
//     { id: 302, name: "세종문화회관 특별전", dist: "700m", date: "상시", img: "https://picsum.photos/seed/event2/200/200" },
//   ],
//   reviews: [
//     { id: 1, user: "축제매니아", rating: 5, date: "2026.05.29", content: "작년보다 훨씬 화려해졌네요! 가족들과 좋은 추억 만들고 갑니다. 레이저 쇼는 꼭 보세요!", likes: 24, images: ["https://picsum.photos/seed/rev1/400/300"] },
//     { id: 2, user: "커플여행", rating: 4, date: "2026.05.28", content: "사람이 너무 많아서 복잡하긴 했지만 분위기는 정말 최고예요. 먹거리가 다양해서 좋았습니다.", likes: 12, images: [] },
//   ]
// };

// const FestivalDetailPage = () => {
//   const [activeTab, setActiveTab] = useState('소개');
//   const [isLiked, setIsLiked] = useState(false);
//   const [sortType, setSortType] = useState('최신순');
//   const [showChat, setShowChat] = useState(false);
//   const [chatMessage, setChatMessage] = useState('');
//   const [chatHistory, setChatHistory] = useState([
//     { id: 1, user: '운영진', text: '별빛 밤거리 페스티벌 실시간 채팅방에 오신 것을 환영합니다! 🌟', time: '오후 2:00' },
//     { id: 2, user: '루키', text: '지금 사람 많이 붐비나요?', time: '오후 2:05' },
//   ]);

//   const tabs = ['소개', '주변 정보', '오시는 길', '후기'];

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!chatMessage.trim()) return;
//     const newMessage = {
//       id: chatHistory.length + 1,
//       user: '나',
//       text: chatMessage,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };
//     setChatHistory([...chatHistory, newMessage]);
//     setChatMessage('');
//   };

//   const getStatusBadge = (status) => {
//     const base = "px-4 py-1.5 rounded-full text-xs font-black shadow-sm ";
//     switch (status) {
//       case '진행중': return base + "bg-green-500 text-white animate-pulse";
//       case '예정': return base + "bg-blue-500 text-white";
//       case '종료': return base + "bg-gray-400 text-white";
//       default: return base + "bg-gray-100 text-gray-500";
//     }
//   };

//   return (
//     <div className="bg-gray-50/30 min-h-screen pb-20 font-['Pretendard']">
//       {/* --- Top Banner & Main Image --- */}
//       <section className="relative h-[400px] md:h-[500px]">
//         <img src={FESTIVAL_DETAIL.image} alt={FESTIVAL_DETAIL.name} className="w-full h-full object-cover" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
//         <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6">
//           <div className="flex flex-wrap items-center gap-3 mb-4">
//             <span className={getStatusBadge(FESTIVAL_DETAIL.status)}>● {FESTIVAL_DETAIL.status}</span>
//             <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/30">#야경맛집</span>
//             <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/30">#서울축제</span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-md">{FESTIVAL_DETAIL.name}</h1>
//         </div>
//       </section>

//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
//         {/* --- Left Content (Main Info & Tabs) --- */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Main Info Card */}
//           <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
//             <div className="flex justify-between items-start mb-8">
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3 text-gray-600 font-bold">
//                   <Calendar size={20} className="text-purple-500" />
//                   <span>{FESTIVAL_DETAIL.period}</span>
//                 </div>
//                 <div className="flex items-center gap-3 text-gray-600 font-bold">
//                   <MapPin size={20} className="text-purple-500" />
//                   <span>{FESTIVAL_DETAIL.location}</span>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button 
//                   onClick={() => setIsLiked(!isLiked)}
//                   className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isLiked ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-white border-gray-100 text-gray-400 hover:text-rose-500'}`}
//                 >
//                   <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
//                 </button>
//                 <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all duration-300">
//                   <Share2 size={24} />
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-50">
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
//                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm"><Info size={20} /></div>
//                 <div>
//                   <p className="text-xs text-gray-400 font-bold mb-1">입장료/요금</p>
//                   <p className="font-bold text-gray-800">{FESTIVAL_DETAIL.fee}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
//                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm"><Phone size={20} /></div>
//                 <div>
//                   <p className="text-xs text-gray-400 font-bold mb-1">문의처</p>
//                   <p className="font-bold text-gray-800">{FESTIVAL_DETAIL.contact}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
//                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm"><Globe size={20} /></div>
//                 <div>
//                   <p className="text-xs text-gray-400 font-bold mb-1">홈페이지</p>
//                   <a href={FESTIVAL_DETAIL.homepage} target="_blank" rel="noreferrer" className="font-bold text-purple-600 hover:underline truncate block w-full">{FESTIVAL_DETAIL.homepage}</a>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <button className="flex-1 h-14 bg-purple-600 text-white font-black rounded-2xl shadow-lg shadow-purple-200 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all active:scale-95">
//                   <Navigation size={20} />
//                   길찾기
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 top-24 z-30 flex gap-2">
//             {tabs.map(tab => (
//               <button 
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition-all ${activeTab === tab ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Tab Content */}
//           <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
//             {activeTab === '소개' && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
//                   <span className="w-1.5 h-6 bg-purple-600 rounded-full" />
//                   축제 소개
//                 </h3>
//                 <p className="text-gray-600 font-medium leading-relaxed text-lg mb-10">
//                   {FESTIVAL_DETAIL.description}
//                 </p>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {[1,2,3].map(i => (
//                     <img key={i} src={`https://picsum.photos/seed/fest-img${i}/600/400`} alt="detail" className="rounded-3xl border border-gray-100" />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === '주변 정보' && (
//               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 {/* Nearby Travel */}
//                 <section>
//                   <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
//                     <Tent size={24} className="text-green-500" />
//                     주변 여행지
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {FESTIVAL_DETAIL.nearbyTravel.map(item => (
//                       <div key={item.id} className="group bg-gray-50 p-4 rounded-3xl border border-transparent hover:border-green-200 transition-all">
//                         <img src={item.img} alt={item.name} className="w-full aspect-video object-cover rounded-2xl mb-3" />
//                         <h4 className="font-bold text-gray-800">{item.name}</h4>
//                         <p className="text-xs text-gray-400 font-bold mt-1">📍 축제지에서 {item.dist}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </section>

//                 {/* Nearby Food */}
//                 <section>
//                   <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
//                     <Utensils size={24} className="text-orange-500" />
//                     주변 맛집
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {FESTIVAL_DETAIL.nearbyFood.map(item => (
//                       <div key={item.id} className="group bg-gray-50 p-4 rounded-3xl border border-transparent hover:border-orange-200 transition-all">
//                         <img src={item.img} alt={item.name} className="w-full aspect-video object-cover rounded-2xl mb-3" />
//                         <div className="flex justify-between items-start">
//                           <h4 className="font-bold text-gray-800">{item.name}</h4>
//                           <span className="flex items-center gap-0.5 text-xs font-black text-orange-500"><Star size={12} fill="currentColor" />{item.rating}</span>
//                         </div>
//                         <p className="text-xs text-gray-400 font-bold mt-1">{item.type} · {item.dist}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </section>

//                 {/* Nearby Events */}
//                 <section>
//                   <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
//                     <Music size={24} className="text-blue-500" />
//                     주변 공연/행사
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {FESTIVAL_DETAIL.nearbyEvents.map(item => (
//                       <div key={item.id} className="group bg-gray-50 p-4 rounded-3xl border border-transparent hover:border-blue-200 transition-all">
//                         <img src={item.img} alt={item.name} className="w-full aspect-video object-cover rounded-2xl mb-3" />
//                         <h4 className="font-bold text-gray-800">{item.name}</h4>
//                         <p className="text-xs text-gray-400 font-bold mt-1">📅 {item.date}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </section>
//               </div>
//             )}

//             {activeTab === '오시는 길' && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
//                   <MapIcon size={24} className="text-purple-600" />
//                   위치 정보
//                 </h3>
//                 <div className="w-full aspect-video bg-gray-100 rounded-[2.5rem] border border-gray-100 flex items-center justify-center mb-6">
//                   <p className="text-gray-400 font-bold">지도 API 연동 영역 (Kakao Map)</p>
//                 </div>
//                 <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
//                   <p className="font-bold text-gray-800 flex items-center gap-2 mb-2">
//                     <MapPin size={18} className="text-purple-600" />
//                     {FESTIVAL_DETAIL.location}
//                   </p>
//                   <p className="text-sm text-gray-500 font-medium">1호선, 2호선 시청역 5번 출구에서 도보 1분</p>
//                 </div>
//               </div>
//             )}

//             {activeTab === '후기' && (
//               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
//                   <div>
//                     <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
//                       방문자 후기
//                       <span className="text-purple-600">{FESTIVAL_DETAIL.reviews.length}</span>
//                     </h3>
//                     <div className="flex items-center gap-1 mt-1">
//                       <Star size={16} fill="#FACC15" className="text-yellow-400" />
//                       <span className="text-lg font-black text-gray-800">4.8</span>
//                       <span className="text-xs text-gray-400 font-bold ml-1">/ 5.0</span>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
//                     {['최신순', '추천순'].map(type => (
//                       <button 
//                         key={type}
//                         onClick={() => setSortType(type)}
//                         className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${sortType === type ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
//                       >
//                         {type}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="space-y-6">
//                   {FESTIVAL_DETAIL.reviews.map(review => (
//                     <div key={review.id} className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300">
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400"><User size={20} /></div>
//                           <div>
//                             <p className="font-bold text-gray-800 text-sm">{review.user}</p>
//                             <div className="flex items-center gap-1 mt-0.5">
//                               {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < review.rating ? '#FACC15' : 'none'} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'} />)}
//                               <span className="text-[10px] text-gray-400 font-bold ml-1">{review.date}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-black text-gray-500 hover:text-rose-500 hover:border-rose-100 transition-all">
//                           <ThumbsUp size={12} /> {review.likes}
//                         </button>
//                       </div>
//                       <p className="text-gray-600 font-medium leading-relaxed mb-4">{review.content}</p>
//                       {review.images.length > 0 && (
//                         <div className="flex gap-2">
//                           {review.images.map((img, i) => <img key={i} src={img} alt="review" className="w-24 h-24 object-cover rounded-2xl border border-gray-100" />)}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <button className="w-full mt-10 h-16 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-black hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600 transition-all flex items-center justify-center gap-2">
//                   <Camera size={20} />
//                   생생한 후기 작성하기
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* --- Right Sidebar (Real-time Chat & Quick Actions) --- */}
//         <div className="space-y-6">
//           {/* Quick Find Direction */}
//           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
//             <h3 className="text-xl font-black mb-2 flex items-center gap-2">
//               <span className="w-1.5 h-6 bg-purple-400 rounded-full" />
//               지금 가볼까요?
//             </h3>
//             <p className="text-slate-400 font-bold text-sm mb-8">가장 빠른 경로를 찾아드려요.</p>
//             <div className="space-y-4">
//               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
//                 <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center"><Navigation size={20} /></div>
//                 <div>
//                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimated Time</p>
//                   <p className="text-lg font-black">25 mins <span className="text-xs text-slate-400 font-bold">(By Car)</span></p>
//                 </div>
//               </div>
//               <button className="w-full h-14 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2">
//                 카카오맵으로 길찾기
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           </div>

//           {/* Real-time Chat Entry */}
//           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
//             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
//               <MessageCircle size={100} />
//             </div>
//             <h3 className="text-xl font-black text-gray-900 mb-2">실시간 채팅방</h3>
//             <p className="text-gray-400 font-bold text-sm mb-8">현장 분위기를 실시간으로 물어보세요!</p>
//             <div className="space-y-3 mb-8">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//                 <span className="text-xs font-bold text-gray-500">지금 <span className="text-purple-600">128명</span>이 대화 중</span>
//               </div>
//             </div>
//             <button 
//               onClick={() => setShowChat(true)}
//               className="w-full h-14 bg-purple-50 text-purple-600 font-black rounded-2xl hover:bg-purple-100 transition-all active:scale-95 flex items-center justify-center gap-2"
//             >
//               <MessageCircle size={20} />
//               채팅방 입장하기
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- Real-time Chat Modal --- */}
//       {showChat && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
//           <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-300">
//             {/* Chat Header */}
//             <div className="bg-purple-600 p-6 text-white flex items-center justify-between">
//               <div>
//                 <h4 className="font-black text-lg">실시간 오픈채팅</h4>
//                 <p className="text-[10px] text-purple-200 font-bold uppercase tracking-widest mt-0.5">Live Festival Talk</p>
//               </div>
//               <button onClick={() => setShowChat(false)} className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
//                 <ChevronLeft size={24} />
//               </button>
//             </div>
            
//             {/* Chat Messages */}
//             <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
//               {chatHistory.map(chat => (
//                 <div key={chat.id} className={`flex flex-col ${chat.user === '나' ? 'items-end' : 'items-start'}`}>
//                   <span className="text-[10px] text-gray-400 font-bold mb-1 px-1">{chat.user}</span>
//                   <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${chat.user === '나' ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-100' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'}`}>
//                     {chat.text}
//                   </div>
//                   <span className="text-[9px] text-gray-300 mt-1 px-1">{chat.time}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Chat Input */}
//             <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
//               <div className="relative">
//                 <input 
//                   type="text" 
//                   value={chatMessage}
//                   onChange={(e) => setChatMessage(e.target.value)}
//                   placeholder="메시지를 입력하세요..." 
//                   className="w-full h-14 bg-gray-50 rounded-2xl pl-6 pr-14 text-sm font-bold border border-transparent focus:border-purple-300 focus:bg-white outline-none transition-all"
//                 />
//                 <button type="submit" className="absolute right-2 top-2 w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-100">
//                   <Send size={18} />
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FestivalDetailPage;
