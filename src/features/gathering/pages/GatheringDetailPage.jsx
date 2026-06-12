import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, CalendarDays, Users, ChevronLeft, MessageCircle, Lock } from 'lucide-react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import gatheringApi from '../../../api/gatheringApi';
import useAuthStore from '../../../store/useAuthStore';

const GatheringDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const loggedInUserId = user?.member_id || user?.id;

  const [gathering, setGathering] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailAndParticipants = async () => {
      try {
        setLoading(true);
        const [roomData, participantData] = await Promise.all([
          gatheringApi.gatheringDetail(id),
          gatheringApi.gatheringParticipants(id)
        ]);
        setGathering(roomData);
        setParticipants(participantData || []);
      } catch (error) {
        console.error("모임 상세 및 참여자 정보를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetailAndParticipants();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--warm-white)] flex justify-center items-center">
        <div className="text-gray-500 font-bold text-xl animate-pulse">모임 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!gathering) {
    return (
      <div className="min-h-screen bg-[var(--warm-white)] flex justify-center items-center">
        <p className="text-gray-700 text-lg font-bold">존재하지 않거나 삭제된 모임입니다.</p>
      </div>
    );
  }

  const isOwner = loggedInUserId === gathering.owner_id;
  const isJoined = isOwner || participants.some(p => p.MEMBER_ID === loggedInUserId);
  const isFull = gathering.current_count >= gathering.max_capacity;

  // 💡 모임 참여 핸들러
  const handleJoinClick = async () => {
    if (!loggedInUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }

    try {
      await gatheringApi.joinGathering(id, loggedInUserId);

      setGathering(prev => ({
        ...prev,
        current_count: (prev.current_count || 1) + 1
      }));

      const newParticipant = {
        MEMBER_ID: loggedInUserId,
        NICKNAME: user?.nickname || '새로운 멤버',
        PROFILE_IMAGE_URL: user?.profile_image_url || user?.profileImageUrl || ''
      };
      setParticipants(prev => [...prev, newParticipant]);

      alert("모임에 성공적으로 참여되었습니다! 채팅방으로 이동합니다.");
      navigate(`/community/chat/${id}`);
    } catch (error) {
      console.error("모임 참여 중 오류 발생:", error);
      alert(error.response?.data?.message || "모임 참여에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 💡 모임 나가기 핸들러
  const handleLeaveClick = async () => {
    if (!window.confirm("정말로 이 모임에서 나가시겠습니까?")) return;

    try {
      await gatheringApi.leaveGathering(id, loggedInUserId);

      // UI 상태 업데이트
      setGathering(prev => ({
        ...prev,
        current_count: Math.max((prev.current_count || 1) - 1, 1)
      }));
      setParticipants(prev => prev.filter(p => p.MEMBER_ID !== loggedInUserId));

      alert("모임에서 탈퇴되었습니다.");
    } catch (error) {
      console.error("모임 나가기 중 오류 발생:", error);
      alert(error.response?.data?.message || "모임 나가기에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 💡 채팅방 입장 핸들러
  const handleChatClick = () => {
    navigate(`/community/chat/${id}`);
  };

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9 space-y-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-[var(--festival-purple)] font-medium mb-4 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              목록으로 돌아가기
            </button>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <img
                src={gathering.profile_image_url || 'https://picsum.photos/seed/gathering/800/400'}
                alt={gathering.room_title}
                className="w-full h-80 object-cover rounded-2xl mb-6"
              />

              <h1 className="text-3xl font-black text-gray-900 mb-4">{gathering.room_title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-lg mb-6">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.free_date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.free_location}
                </span>
                <span className={`flex items-center gap-1 ${isFull ? 'text-red-500 font-black' : ''}`}>
                  <Users className={`w-5 h-5 ${isFull ? 'text-red-500' : 'text-[var(--festival-purple)]'}`} />
                  {gathering.current_count || 1}/{gathering.max_capacity}명
                </span>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                <p>{gathering.room_description}</p>
              </div>

              {/* 참여자 명단 영역 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">참여자 ({gathering.current_count || 1}명)</h3>
                <div className="flex flex-wrap gap-3">

                  {/* 1. 👑 방장(Host) 정보 */}
                  <div className="flex items-center gap-2 bg-purple-50 pl-2 pr-4 py-1.5 rounded-full border border-purple-100 shadow-sm">
                    <img
                      src={gathering.profile_image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner'}
                      alt={gathering.nickname}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[var(--festival-purple)]"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--festival-purple)] font-bold bg-purple-100 px-1.5 rounded w-max mb-0.5">방장 👑</span>
                      <span className="text-sm font-black text-gray-800 leading-tight">{gathering.nickname || '방장'}</span>
                    </div>
                  </div>

                  {/* 2. 👥 일반 참여자 목록 */}
                  {participants.map(participant => (
                    <div key={participant.MEMBER_ID} className="flex items-center gap-2 bg-gray-50 pl-2 pr-4 py-1.5 rounded-full border border-gray-100 transition-all hover:bg-gray-100">
                      <img
                        src={participant.PROFILE_IMAGE_URL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt={participant.NICKNAME}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-medium mb-0.5">멤버</span>
                        <span className="text-sm font-bold text-gray-700 leading-tight">{participant.NICKNAME}</span>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* 동적 제어 버튼 스위치 */}
              <div className="flex justify-end gap-3">
                {isJoined ? (
                  <>
                    <button
                      onClick={handleLeaveClick}
                      className="inline-flex items-center px-8 py-3.5 border border-red-200 text-red-600 font-black rounded-full shadow-sm bg-white hover:bg-red-50 transition-all active:scale-95 text-base"
                    >
                      모임 나가기
                    </button>
                    <button
                      onClick={handleChatClick}
                      className="inline-flex items-center px-8 py-3.5 border border-transparent text-white font-black rounded-full shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-500 transition-all active:scale-95 text-base"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      채팅방 입장하기
                    </button>
                  </>
                ) : isFull ? (
                  <button
                    disabled
                    className="inline-flex items-center px-8 py-3.5 text-gray-400 font-black rounded-full bg-gray-100 cursor-not-allowed text-base"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    모집이 마감되었습니다
                  </button>
                ) : (
                  <button
                    onClick={handleJoinClick}
                    className="inline-flex items-center px-8 py-3.5 border border-transparent text-white font-black rounded-full shadow-lg shadow-purple-100 bg-[var(--festival-purple)] hover:bg-[var(--festival-purple-soft)] transition-all active:scale-95 text-base group"
                  >
                    <MessageCircle className="w-5 h-5 mr-2 animate-bounce group-hover:animate-none" />
                    모임 참여하기
                  </button>
                )}
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GatheringDetailPage;