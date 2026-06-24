import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, CalendarDays, Users, ChevronLeft, MessageCircle, Settings, Save, X, Trash2, Camera } from 'lucide-react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import gatheringApi from '../../../api/gatheringApi';
import useAuthStore from '../../../store/useAuthStore';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';
import LoginMessage from '../../../components/LoginMessage';

const GatheringDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user } = useAuthStore();
  const loggedInUserId = user?.member_id || user?.id;

  const [gathering, setGathering] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);

  const [activeMenuMemberId, setActiveMenuMemberId] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.member-menu-container')) {
        setActiveMenuMemberId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const fetchDetailAndParticipants = async (targetId) => {
    try {
      const [roomData, participantData] = await Promise.all([
        gatheringApi.gatheringDetail(targetId),
        gatheringApi.selectGatheringParticipants(targetId)
      ]);
      setGathering(roomData);
      setParticipants(participantData || []);

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

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      let targetId = id;

      if (Number(id) < 0) {
        try {
          const festivalId = Math.abs(Number(id));
          const res = await gatheringApi.festivalGatheringList(loggedInUserId || '', 1, 1000);
          const existingRoom = res.list?.find(r => Number(r.festival_id) === festivalId && Number(r.room_id) > 0);

          if (existingRoom) {
            targetId = existingRoom.room_id;
          }
        } catch (error) {
          console.error("축제 연동 활성화 대화방 조회 실패:", error);
        }
      }

      try {
        const [roomData, participantData] = await Promise.all([
          gatheringApi.gatheringDetail(targetId),
          gatheringApi.selectGatheringParticipants(targetId)
        ]);

        setGathering(roomData);
        setParticipants(participantData || []);

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
        console.error("모임 정보 연동 중 치명적 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      initData();
    }
  }, [id, loggedInUserId, navigate]);

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

  const ownerId = gathering.owner_id || gathering.OWNER_ID;
  const isOwner = loggedInUserId && String(loggedInUserId) === String(ownerId);
  const isJoined = loggedInUserId && (isOwner || participants.some(p => String(p.member_id || p.MEMBER_ID || p.id) === String(loggedInUserId)));
  const isFull = gathering.current_count >= gathering.max_capacity;

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

  const handleJoinClick = async () => {
    if (!loggedInUserId) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const response = await gatheringApi.joinGathering(gathering.room_id, loggedInUserId);
      alert("모임에 성공적으로 참여되었습니다!");

      if (response && response.roomId) {
        const actualRoomId = response.roomId;
        navigate(`/community/gathering/${actualRoomId}`, { replace: true });
      } else {
        await fetchDetailAndParticipants(gathering.room_id);
      }
    } catch (error) {
      console.error("모임 참여 중 오류 발생:", error);
      alert(error.response?.data?.message || "모임 참여에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleLeaveClick = async () => {
    const activeRoomId = gathering.room_id;

    if (isOwner) {
      if (participants.length === 0) {
        if (window.confirm("참여자가 없어 모임이 자동으로 삭제됩니다. 정말 나가시겠습니까?")) {
          try {
            await gatheringApi.deleteGathering(activeRoomId, loggedInUserId);
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
      await gatheringApi.leaveGathering(activeRoomId, loggedInUserId);
      alert("모임에서 탈퇴되었습니다.");
      // 만약 혼자 남아있다 나간 거라면 백엔드에서 삭제 처리되므로 목록으로 이동 유도
      navigate('/community/gathering');
    } catch (error) {
      console.error("모임 나가기 중 오류 발생:", error);
      alert(error.response?.data?.message || "모임 나가기에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleDelegateAndLeave = async (newOwnerId) => {
    if (!window.confirm("방장 권한을 위임하고 모임을 나가시겠습니까?")) return;
    try {
      await gatheringApi.delegateOwner(gathering.room_id, loggedInUserId, newOwnerId);
      await gatheringApi.leaveGathering(gathering.room_id, loggedInUserId);
      alert("방장 권한을 위임하고 모임에서 나갔습니다.");
      navigate('/community/gathering');
    } catch (error) {
      alert("위임 처리 중 오류가 발생했습니다.");
    }
  };

  const handleAutoDelegateAndLeave = async () => {
    if (participants.length === 0) return;
    const oldestMember = participants[0];
    const oldestMemberId = oldestMember.member_id || oldestMember.MEMBER_ID || oldestMember.id;
    await handleDelegateAndLeave(oldestMemberId);
  };

  const handleKickMember = async (memberId, nickname) => {
    if (!window.confirm(`${nickname}님을 정말로 퇴장시키겠습니까?`)) return;
    try {
      await gatheringApi.kickParticipant(gathering.room_id, loggedInUserId, memberId);
      alert("강퇴 및 영구 추방 처리가 완료되었습니다.");
      await fetchDetailAndParticipants(gathering.room_id);
    } catch (error) {
      alert("강퇴 처리 중 오류가 발생했습니다.");
    }
  };

  const handleChatClick = () => {
    if (Number(gathering.room_id) <= 0) {
      alert("모임 참여를 완료한 뒤 채팅방 입장이 가능합니다.");
      return;
    }
    navigate(`/community/chat/${gathering.room_id}`);
  };

  const handleDirectMessageClick = (targetMemberId, nickname) => {
    if (!loggedInUserId) {
      setIsLoginModalOpen(true);
      return;
    }
    if (String(targetMemberId) === String(loggedInUserId)) {
      alert("자기 자신에게는 1:1 채팅을 보낼 수 없습니다.");
      return;
    }
    if (window.confirm(`${nickname}님과 1:1 채팅을 시작하시겠습니까?`)) {
      navigate(`/community/chat`, {
        state: {
          targetMemberId: targetMemberId,
          targetNickname: nickname
        }
      });
    }
  };

  const handleEditProfileClick = () => {
    if (!loggedInUserId) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate('/mypage');
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
      let uploadedImageUrl = editForm.room_image;

      if (selectedFile) {
        const uploadRes = await gatheringApi.uploadImage(selectedFile);
        if (uploadRes && uploadRes.imageUrl) {
          uploadedImageUrl = uploadRes.imageUrl;
        }
      }

      const finalPayload = {
        ...editForm,
        room_image: uploadedImageUrl,
        owner_id: ownerId,
        room_type: gathering.room_type || 'GROUP',
        festival_id: gathering.festival_id || null
      };

      await gatheringApi.updateGathering(gathering.room_id, finalPayload);
      alert("모임 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);
      await fetchDetailAndParticipants(gathering.room_id);
    } catch (error) {
      console.error("모임 수정 중 오류 발생:", error);
      alert("모임 수정에 실패했습니다.");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!window.confirm("정말로 이 모임을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) return;
    try {
      await gatheringApi.deleteGathering(gathering.room_id, loggedInUserId);
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
              <div className="relative group/img mb-6">
                <img
                  src={imagePreview || gathering.room_image || DEFAULT_IMAGES.ROOM_COVER}
                  alt={gathering.room_title}
                  className={`w-full h-80 object-cover rounded-2xl transition-all ${isEditing ? 'cursor-pointer hover:brightness-75' : ''}`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                />
                {isEditing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
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
                        type="date"
                        name="free_date"
                        value={editForm.free_date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-100 focus:border-[var(--festival-purple)] outline-none"
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
                        setEditForm({
                          room_title: gathering.room_title || '',
                          free_date: gathering.free_date || '',
                          free_location: gathering.free_location || '',
                          max_capacity: gathering.max_capacity || 0,
                          room_description: gathering.room_description || '',
                          room_image: gathering.room_image || ''
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
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <h1 className="text-3xl font-black text-gray-900 truncate">{gathering.room_title}</h1>
                      {isJoined && (
                        <span className="shrink-0 px-3 py-1 bg-green-100 text-green-600 text-xs font-black rounded-full border border-green-200">
                          참여 중
                        </span>
                      )}
                    </div>
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
                      <CalendarDays className="w-5 h-5 text-[var(--festival-purple)]" /> {gathering.free_date ? gathering.free_date.replace(/-/g, '.') : ''}
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
                        {participants
                          .filter(participant => String(participant.member_id || participant.MEMBER_ID || participant.id) !== String(ownerId))
                          .map(participant => {
                            const pId = participant.member_id || participant.MEMBER_ID || participant.id;
                            const pNickname = participant.nickname || participant.NICKNAME || '이름 없음';
                            const pProfileImg = participant.profile_image_url || participant.PROFILE_IMAGE_URL || DEFAULT_IMAGES.PROFILE;

                            return (
                              <div key={pId} className="relative flex items-center gap-2 bg-gray-50 pl-2 pr-4 py-1.5 rounded-full border border-gray-100 transition-all hover:bg-gray-100 group">
                                <img
                                  src={pProfileImg}
                                  alt={pNickname}
                                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                />
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-gray-400 font-medium mb-0.5">멤버</span>
                                  <span className="text-sm font-bold text-gray-700 leading-tight">{pNickname}</span>
                                </div>
                                {isOwner && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleKickMember(pId, pNickname);
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 scale-75"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">참여자 ({gathering.current_count || 0}명)</h3>
                    <div className="flex flex-wrap gap-3">
                      {ownerId && (
                        <div
                          className="member-menu-container relative flex items-center gap-2 bg-purple-50 pl-2 pr-4 py-1.5 rounded-full border border-purple-100 shadow-sm cursor-pointer select-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuMemberId(activeMenuMemberId === ownerId ? null : ownerId);
                          }}
                        >
                          <img
                            src={gathering.profile_image_url || DEFAULT_IMAGES.PROFILE}
                            alt={gathering.nickname}
                            className="w-9 h-9 rounded-full object-cover border-2 border-primary"
                          />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold bg-purple-100 px-1.5 rounded w-max mb-0.5">방장 👑</span>
                            <span className="text-sm font-black text-gray-800 leading-tight">{gathering.nickname || '방장'}</span>
                          </div>

                          {activeMenuMemberId === ownerId && (
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-sm text-gray-700">
                              {String(ownerId) === String(loggedInUserId) ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEditProfileClick(); setActiveMenuMemberId(null); }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium flex items-center gap-2"
                                >
                                  <Settings className="w-4 h-4 text-gray-500" />
                                  내 프로필 수정
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDirectMessageClick(ownerId, gathering.nickname || '방장'); setActiveMenuMemberId(null); }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium flex items-center gap-2 text-[var(--festival-purple)]"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  1:1 채팅 보내기
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {participants.map(participant => {
                        const pId = participant.member_id || participant.MEMBER_ID || participant.id;
                        const pNickname = participant.nickname || participant.NICKNAME || '이름 없음';
                        const pProfileImg = participant.profile_image_url || participant.PROFILE_IMAGE_URL || DEFAULT_IMAGES.PROFILE;
                        const isMe = String(pId) === String(loggedInUserId);

                        return (
                          <div
                            key={pId}
                            className="member-menu-container relative flex items-center gap-2 bg-gray-50 pl-2 pr-4 py-1.5 rounded-full border border-gray-100 transition-all hover:bg-gray-100 group cursor-pointer select-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuMemberId(activeMenuMemberId === pId ? null : pId);
                            }}
                          >
                            <img
                              src={pProfileImg}
                              alt={pNickname}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-medium mb-0.5">멤버</span>
                              <span className="text-sm font-bold text-gray-700 leading-tight">{pNickname}</span>
                            </div>

                            {isOwner && !isMe && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleKickMember(pId, pNickname);
                                  setActiveMenuMemberId(null);
                                }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 scale-75"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}

                            {activeMenuMemberId === pId && (
                              <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-sm text-gray-700">
                                {isMe ? (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleEditProfileClick(); setActiveMenuMemberId(null); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium flex items-center gap-2"
                                  >
                                    <Settings className="w-4 h-4 text-gray-500" />
                                    내 프로필 수정
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDirectMessageClick(pId, pNickname); setActiveMenuMemberId(null); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium flex items-center gap-2 text-[var(--festival-purple)]"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    1:1 채팅 보내기
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {loggedInUserId && !isDelegating && (
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

      <LoginMessage
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default GatheringDetailPage;