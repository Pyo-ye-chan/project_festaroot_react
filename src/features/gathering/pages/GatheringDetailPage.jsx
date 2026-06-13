import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, CalendarDays, Users, ChevronLeft, MessageCircle, Lock, Settings, Save, X, Trash2, Camera } from 'lucide-react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import gatheringApi from '../../../api/gatheringApi';
import useAuthStore from '../../../store/useAuthStore';

const GatheringDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user } = useAuthStore();
  const loggedInUserId = user?.member_id || user?.id;

  const [gathering, setGathering] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 수정 모드 및 위임 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  
  // 이미지 업로드 관련 상태
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [editForm, setEditForm] = useState({
    room_title: '',
    free_date: '',
    free_location: '',
    max_capacity: 0,
    room_description: '',
    room_image: ''
  });

  // 서버에서 최신 데이터를 다시 불러오는 공통 함수
  const fetchDetailAndParticipants = async () => {
    try {
      const [roomData, participantData] = await Promise.all([
        gatheringApi.gatheringDetail(id),
        gatheringApi.gatheringParticipants(id)
      ]);
      setGathering(roomData);
      setParticipants(participantData || []);

      // 수정 폼 초기화
      setEditForm({
        room_title: roomData.room_title || '',
        free_date: roomData.free_date || '',
        free_location: roomData.free_location || '',
        max_capacity: roomData.max_capacity || 0,
        room_description: roomData.room_description || '',
        room_image: roomData.room_image || ''
      });
      setSelectedFile(null);
      setImagePreview(null);
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
  const isJoined = isOwner || participants.some(p => p.member_id === loggedInUserId);
  const isFull = gathering.current_count >= gathering.max_capacity;

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 모임 참여 핸들러
  const handleJoinClick = async () => {
    if (!loggedInUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }

    try {
      const response = await gatheringApi.joinGathering(id, loggedInUserId);
      alert("모임에 성공적으로 참여되었습니다!");
      if (response && response.roomId) {
        const actualRoomId = response.roomId;
        if (String(actualRoomId) !== String(id)) {
          navigate(`/community/gathering/${actualRoomId}`, { replace: true });
        } else {
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
    if (isOwner) {
      if (participants.length === 0) {
        if (window.confirm("참여자가 없어 모임이 자동으로 삭제됩니다. 정말 나가시겠습니까?")) {
          try {
            await gatheringApi.deleteGathering(id, loggedInUserId);
            alert("모임이 삭제되었습니다.");
            navigate('/community/gathering');
          } catch (error) {
            alert("모임 삭제 중 오류가 발생했습니다.");
          }
        }
      } else {
        setIsDelegating(true);
      }
      return;
    }

    if (!window.confirm("정말로 이 모임에서 나가시겠습니까?")) return;
    try {
      await gatheringApi.leaveGathering(id, loggedInUserId);
      await fetchDetailAndParticipants();
      alert("모임에서 탈퇴되었습니다.");
    } catch (error) {
      console.error("모임 나가기 중 오류 발생:", error);
      alert(error.response?.data?.message || "모임 나가기에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 위임 및 나가기
  const handleDelegateAndLeave = async (newOwnerId) => {
    if (!window.confirm("방장 권한을 위임하고 모임을 나가시겠습니까?")) return;
    try {
      await gatheringApi.delegateOwner(id, loggedInUserId, newOwnerId);
      await gatheringApi.leaveGathering(id, loggedInUserId);
      alert("방장 권한을 위임하고 모임에서 나갔습니다.");
      navigate('/community/gathering');
    } catch (error) {
      alert("위임 처리 중 오류가 발생했습니다.");
    }
  };

  // 자동 위임 및 나가기
  const handleAutoDelegateAndLeave = async () => {
    if (participants.length === 0) return;
    const oldestMember = participants[0];
    await handleDelegateAndLeave(oldestMember.member_id);
  };

  // 강퇴 핸들러
  const handleKickMember = async (memberId, nickname) => {
    if (!window.confirm(`${nickname}님을 정말로 강퇴하시겠습니까?`)) return;
    try {
      await gatheringApi.kickParticipant(id, loggedInUserId, memberId);
      alert("강퇴 처리가 완료되었습니다.");
      await fetchDetailAndParticipants();
    } catch (error) {
      alert("강퇴 처리 중 오류가 발생했습니다.");
    }
  };

  const handleChatClick = () => {
    if (Number(id) <= 0) {
      alert("모임 참여를 완료한 뒤 채팅방 입장이 가능합니다.");
      return;
    }
    navigate(`/community/chat/${id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'max_capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleUpdateSubmit = async () => {
    if (!editForm.room_title.trim()) return alert("모임 제목을 입력해주세요.");
    if (editForm.max_capacity < gathering.current_count) {
      return alert(`현재 참여 인원(${gathering.current_count}명)보다 적게 정원을 설정할 수 없습니다.`);
    }

    try {
      let finalForm = { ...editForm };

      // 이미지 파일이 선택된 경우 먼저 업로드
      if (selectedFile) {
        const uploadRes = await gatheringApi.uploadImage(selectedFile);
        if (uploadRes && uploadRes.imageUrl) {
          finalForm.room_image_url = uploadRes.imageUrl;
        }
      }

      await gatheringApi.updateGathering(id, finalForm);
      alert("모임 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);
      await fetchDetailAndParticipants();
    } catch (error) {
      console.error("모임 수정 중 오류 발생:", error);
      alert("모임 수정에 실패했습니다.");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!window.confirm("정말로 이 모임을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) return;
    try {
      await gatheringApi.deleteGathering(id, loggedInUserId);
      alert("모임이 삭제되었습니다.");
      navigate('/community/gathering');
    } catch (error) {
      console.error("모임 삭제 중 오류 발생:", error);
      alert("모임 삭제에 실패했습니다.");
    }
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
              {/* 모임 대표 이미지 (수정 모드일 때는 클릭하여 변경 가능) */}
              <div className="relative group/img mb-6">
                <img
                  src={imagePreview || gathering.room_image || 'https://picsum.photos/seed/gathering/800/400'}
                  alt={gathering.room_title}
                  className={`w-full h-80 object-cover rounded-2xl transition-all ${isEditing ? 'cursor-pointer hover:brightness-75' : ''}`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                />
                {isEditing && (
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none"
                  >
                    <Camera className="w-12 h-12 mb-2" />
                    <span className="font-bold">대표 이미지 변경</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-gray-500 mb-1">모임 제목</label>
                      <input
                        type="text"
                        name="room_title"
                        value={editForm.room_title}
                        onChange={handleInputChange}
                        className="w-full text-2xl font-black text-gray-900 border-b-2 border-gray-100 focus:border-[var(--festival-purple)] outline-none py-2 transition-colors"
                        placeholder="모임 제목을 입력하세요"
                      />
                    </div>
                    <button
                      onClick={handleDeleteSubmit}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold text-sm mb-1 whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4" />
                      모임 삭제
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">일시</label>
                      <input
                        type="text"
                        name="free_date"
                        value={editForm.free_date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-100 focus:border-[var(--festival-purple)] outline-none"
                        placeholder="예: 2024-10-15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">장소</label>
                      <input
                        type="text"
                        name="free_location"
                        value={editForm.free_location}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-100 focus:border-[var(--festival-purple)] outline-none"
                        placeholder="예: 서울숲 야외광장"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">최대 인원</label>
                      <input
                        type="number"
                        name="max_capacity"
                        value={editForm.max_capacity}
                        onChange={handleInputChange}
                        min={gathering.current_count}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-100 focus:border-[var(--festival-purple)] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">모임 설명</label>
                    <textarea
                      name="room_description"
                      value={editForm.room_description}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-100 focus:border-[var(--festival-purple)] outline-none resize-none"
                      placeholder="모임에 대해 설명해주세요"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImagePreview(null);
                        setSelectedFile(null);
                        // 폼 데이터도 원래 데이터로 복구 (필요시)
                        setEditForm({
                          room_title: gathering.room_title || '',
                          free_date: gathering.free_date || '',
                          free_location: gathering.free_location || '',
                          max_capacity: gathering.max_capacity || 0,
                          room_description: gathering.room_description || '',
                          room_image_url: gathering.room_image_url || gathering.ROOM_IMAGE_URL || gathering.room_image || gathering.ROOM_IMAGE || ''
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors font-bold"
                    >
                      <X className="w-4 h-4" />
                      취소
                    </button>
                    <button
                      onClick={handleUpdateSubmit}
                      className="flex items-center gap-2 px-8 py-2.5 bg-[var(--festival-purple)] text-white hover:bg-[var(--festival-purple-soft)] rounded-full transition-colors font-bold shadow-lg shadow-purple-100"
                    >
                      <Save className="w-4 h-4" />
                      저장하기
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-black text-gray-900 flex-1">{gathering.room_title}</h1>
                    {isOwner && !isDelegating && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setIsDelegating(false);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-[var(--festival-purple)] rounded-full transition-all border border-gray-100 font-bold text-sm ml-4 whitespace-nowrap"
                      >
                        <Settings className="w-4 h-4" />
                        편집하기
                      </button>
                    )}
                  </div>

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
                    <p className="whitespace-pre-wrap">{gathering.room_description}</p>
                  </div>

                  {/* 위임 UI */}
                  {isDelegating && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-black text-blue-900">방장 권한 위임</h3>
                        <button onClick={() => setIsDelegating(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-blue-700 mb-4 text-sm font-medium">모임을 나가기 위해 권한을 위임할 회원을 선택하거나 자동 위임을 이용하세요.</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          onClick={handleAutoDelegateAndLeave}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          위임 자동선택 (가장 오래된 회원)
                        </button>
                      </div>
                      <div className="space-y-2">
                        {participants.map(p => (
                          <div key={p.member_id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                              <img src={p.profile_image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt={p.nickname} className="w-8 h-8 rounded-full" />
                              <span className="font-bold text-gray-800">{p.nickname}</span>
                            </div>
                            <button
                              onClick={() => handleDelegateAndLeave(p.member_id)}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              위임하기
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 참여자 명단 영역 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">참여자 ({gathering.current_count || 0}명)</h3>
                    <div className="flex flex-wrap gap-3">
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

                      {participants.map(participant => (
                        <div key={participant.member_id} className="relative flex items-center gap-2 bg-gray-50 pl-2 pr-4 py-1.5 rounded-full border border-gray-100 transition-all hover:bg-gray-100 group">
                          <img
                            src={participant.profile_image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                            alt={participant.nickname}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200"
                          />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-medium mb-0.5">멤버</span>
                            <span className="text-sm font-bold text-gray-700 leading-tight">{participant.nickname}</span>
                          </div>
                          {isOwner && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleKickMember(participant.member_id, participant.nickname);
                              }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 scale-75"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 하단 제어 버튼 스위치 */}
                  {!isDelegating && (
                    <div className="flex justify-end gap-3">
                      {isJoined ? (
                        <>
                          <button
                            onClick={handleLeaveClick}
                            className="inline-flex items-center px-8 py-3.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-full transition-colors font-bold"
                          >
                            모임 나가기
                          </button>
                          <button
                            onClick={handleChatClick}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--festival-purple)] text-white hover:bg-[var(--festival-purple-soft)] rounded-full transition-colors font-bold shadow-lg shadow-purple-100"
                          >
                            <MessageCircle className="w-5 h-5" />
                            채팅방 입장하기
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleJoinClick}
                          disabled={isFull}
                          className={`inline-flex items-center px-10 py-4 rounded-full text-white font-black text-lg transition-all shadow-lg ${isFull
                              ? 'bg-gray-300 cursor-not-allowed shadow-none'
                              : 'bg-[var(--festival-purple)] hover:bg-[var(--festival-purple-soft)] shadow-purple-100 hover:scale-[1.02]'
                            }`}
                        >
                          {isFull ? '정원이 마감되었습니다' : '모임 참여하기'}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GatheringDetailPage;