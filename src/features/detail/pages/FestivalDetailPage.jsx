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

import { getFestivalDetail, getFestivalImages } from '../../../api/FestivalApi';

import useAuthStore from '../../../store/useAuthStore';
import { saveActivityLog } from '../../../api/activityApi';


import FestivalMapTab from '../components/FestivalMapTab';
import FestivalReviewTab from '../components/FestivalReviewTab';
import FestivalIntroTab from '../components/FestivalIntroTab';

import FestivalNearbyTab from '../components/FestivalNearbyTab';

const FestivalDetailPage = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuthStore();

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

  const [festivalImages, setFestivalImages] = useState([]);

  const [nearbyTravel, setNearbyTravel] = useState([]);
  const [nearbyFood, setNearbyFood] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const tabs = ['소개', '주변 정보', '오시는 길', '후기'];

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const data = await getFestivalDetail(id);
        setFestival(data);
        console.log('축제 상세 정보:', data);

        // 상세 정보를 성공적으로 가져왔고 로그인 상태라면 조회 로그 저장
        if (data && isLoggedIn) {
          saveActivityLog({
            type: 'VIEW',
            festivalId: id
          });
        }
      } catch (error) {
        console.error('축제 상세 정보 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFestival();
  }, [id, isLoggedIn]);


  useEffect(() => {
    if (!festival?.content_id) return;

    const fetchFestivalImages = async () => {
      try {
        const data = await getFestivalImages(festival.content_id);
        setFestivalImages(data || []);
        console.log('축제 이미지:', data);
      } catch (error) {
        console.error('축제 이미지 불러오기 실패:', error);
        setFestivalImages([]);
      }
    };

    fetchFestivalImages();
  }, [festival?.content_id]);


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



  return (
    <>
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
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${isLiked
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

                <div className="md:col-span-2 flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
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
                  nearbyEvents={nearbyEvents}
                />
              )}

              {activeTab === '오시는 길' && (
                <FestivalMapTab location={location} />
              )}

              {activeTab === '후기' && (
                <FestivalReviewTab
                  festival={festival}
                  sortType={sortType}
                  setSortType={setSortType}
                />
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
                      className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${chat.user === '나'
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
    </>
  );
};
export default FestivalDetailPage;