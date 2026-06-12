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

  // 서버에서 최신 데이터를 다시 불러오는 공통 함수
  const fetchDetailAndParticipants = async () => {
    try {
      const [roomData, participantData] = await Promise.all([
        gatheringApi.gatheringDetail(id),
        gatheringApi.gatheringParticipants(id)
      ]);
      setGathering(roomData);
      setParticipants(participantData || []);
    } catch (error) {
      console.error("모임 정보 갱신 중 오류 발생:", error);
    }
  };

  // 컴포넌트 최초 로드시 실행
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await fetchDetailAndParticipants();
      setLoading(false);
    };

    if (id) {
      initData();
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

  // 💡 모임 참여 핸들러 (Lazy-Creation 동적 주소 맵핑 고도화)
  const handleJoinClick = async () => {
    if (!loggedInUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }

    try {
      const response = await gatheringApi.joinGathering(id, loggedInUserId);
      
      alert("모임에 성공적으로 참여되었습니다!");

      // 💡 백엔드 응답 본문에 있는 실제 발급 완료된 진짜 roomId 확보
      if (response && response.roomId) {
        const actualRoomId = response.roomId;

        // 만약 기존 주소창 파라미터(id)가 음수였거나 신규 발급된 진짜 ID와 매칭되지 않는다면?
        if (String(actualRoomId) !== String(id)) {
          // 뒤로 가기를 누르는 유저 경험을 방해하지 않도록 replace 옵션을 주어 
          // 가상의 음수 방 주소를 실제 생성된 양수 방 번호 주소로 스위칭시킵니다.
          navigate(`/community/gathering/${actualRoomId}`, { replace: true });
        } else {
          // 이미 개설된 방에 그냥 일반 참여자로 붙은 케이스라면 화면 데이터만 갱신
          await fetchDetailAndParticipants();
        }
      }
    } catch (error) {
      console.error("모임 참여 중 오류 발생:", error);
      alert(error.response?.data?.message || "모임 참여에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 모임 나가기 핸들러
  const handleLeaveClick = async () => {
    if (!window.confirm("정말로 이 모임에서 나가시겠습니까?")) return;

    try {
      await gatheringApi.leaveGathering(id, loggedInUserId);

      // 서버 데이터와 완벽하게 싱크 맞추기
      await fetchDetailAndParticipants();

      alert("모임에서 탈퇴되었습니다.");
    } catch (error) {
      console.error("모임 나가기 중 오류 발생:", error);
      alert(error.response?.data?.message || "모임 나가기에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleChatClick = () => {
    // 만약 음수 ID인 상태에서 예외적으로 흘러왔다면 양수 ID가 확보되었을 때 입장을 허용하는 것이 안전합니다.
    if (Number(id) <= 0) {
      alert("모임 참여를 완료한 뒤 채팅방 입장이 가능합니다.");
      return;
    }
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
              onClick={() => navigate('/community/gathering')} // 명시적 목록 라우팅 처리 권장
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
                  {gathering.current_count || 0}/{gathering.max_capacity}명
                </span>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
                <p>{gathering.room_description}</p>
              </div>

              {/* 참여자 명단 영역 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">참여자 ({gathering.current_count || 0}명)</h3>
                <div className="flex flex-wrap gap-3">

                  {/* 1. 👑 방장(Host) 정보 - 방장이 존재할 때만 렌더링 (공식 방장 없음 이슈 예방) */}
                  {gathering.owner_id && (
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
                  )}

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

                  {/* 방장도 없고 멤버도 없는 쌩 신규 축제 모임 안내멘트 */}
                  {(!gathering.owner_id && participants.length === 0) && (
                    <p className="text-sm text-gray-400 italic pl-1">가장 먼저 이 공식 모임방의 메이트가 되어보세요!</p>
                  )}

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