import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../../../store/useChatStore';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatDetails from '../components/ChatDetails';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import gatheringApi from '../../../api/gatheringApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Ban, Crown, LogOut, X } from 'lucide-react';
import useLoadingStore from '../../../store/useLoadingStore';
import chatApi from '../../../api/chatApi';

const ChatListPage = () => {
  const [participants, setParticipants] = useState([]);
  const [roomDetail, setRoomDetail] = useState(null);
  const [showDelegateModal, setShowDelegateModal] = useState(false); // 위임 팝업 모달
  const [showDirectLeaveModal, setShowDirectLeaveModal] = useState(false); // 1:1 채팅 전용 나가기
  const { roomId } = useParams();
  const navigate = useNavigate();

  const {
    activeChatId,
    setActiveChatId,
    floatingChatIds,
    chatRooms,
    setChatRooms,
    connectWebSocket,
    subscribeToRoom,
    fetchChatHistory,
    messagesByRoom,
    sendMessage,
    openFloatingChat,
    closeFloatingChat
  } = useChatStore();

  const [displayChatId, setDisplayChatId] = useState(null);
  const [message, setMessage] = useState('');

  const sections = [
    { id: 'festival', label: '축제 채팅' },
    { id: 'group', label: '모임 채팅' },
    { id: 'direct', label: '1:1 채팅' },
  ];

  const { startLoading, stopLoading } = useLoadingStore();
  // const { chatRooms, setChatRooms, setActiveChatId, ...chatStore } = useChatStore();

  // 로그인 유저 ID 추출
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.member_id || user?.id || user?.userId;

  // 참여자 목록
  const fetchParticipants = async () => {
    try {
      const res = await gatheringApi.gatheringParticipants(activeChatId);

      // 방장의 ID를 구해서 각 참여자 객체에 정확히 방장 여부(isOwner) 주입하기
      const resParticipants = res || [];
      const currentOwnerId = roomDetail?.owner_id || selectedChat?.owner_id;

      const mappedParticipants = resParticipants.map(p => {
        const pId = p.member_id || p.MEMBER_ID || p.id;
        return {
          ...p,
          isOwner: currentOwnerId && String(pId) === String(currentOwnerId) // 정확한 방장 조건 검사
        };
      });

      setParticipants(mappedParticipants);
    } catch (e) {
      console.error("참여자 목록 로드 실패", e);
    }
  };

  // 선택된 채팅 및 상세정보 매핑 변수를 함수들이 참조
  const selectedChat = chatRooms.find(c => Number(c.id) === Number(activeChatId || displayChatId));
  const detailedChat = selectedChat ? { ...selectedChat, ...roomDetail } : null;

  const isCurrentUserHost = selectedChat?.owner_id === userId || roomDetail?.owner_id === userId;

  // 컴포넌트 마운트 시 웹소켓 서버 최초 연결
  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  useEffect(() => {
    // 컴포넌트가 언마운트(페이지 이탈)될 때 현재 활성화된 채팅방 ID를 초기화
    return () => {
      setActiveChatId(null);
    };
  }, [setActiveChatId]);

  // 방 변경 시, 참여자뿐만 아니라 실제 "모임 소개글/규칙"이 포함된 상세 데이터도 패치
  useEffect(() => {
    if (activeChatId) {
      fetchChatHistory(activeChatId, userId);
      subscribeToRoom(activeChatId);

      // 채팅 읽음 처리 요청 보내기
      chatApi.updateReadStatus(activeChatId, userId);

      // 모임 상세 원격 내용 패치
      const fetchRoomDetail = async () => {
        // 현재 activeChatId가 없다면 이미 삭제되었거나 비정상적인 접근이므로 애초에 API를 호출X
        if (chatRooms.length > 0 && !chatRooms.some(room => room.id === Number(activeChatId))) {
          return;
        }

        try {
          startLoading(); // 로딩 시작
          const detail = await gatheringApi.gatheringDetail(activeChatId);
          setRoomDetail(detail);
        } catch (e) {
          // Axios 에러 중 404인 경우는 방이 삭제되어 생기는 자연스러운 현상이므로 에러 처리에서 제외
          if (e.response?.status === 404) {
            console.log("채팅방이 삭제되었거나 존재하지 않아 패치를 중단합니다.");
            setRoomDetail(null); // 상태 비워주기
            return;
          }

          // 404가 아닌 진짜 에러만 red log로 출력
          console.error("모임 상세 내용 패치 실패", e);
        } finally {
          stopLoading(); // 패치가 끝나면 에러가 나든 성공하든 무조건 로딩 종료
        }
      };

      fetchParticipants();
      fetchRoomDetail();
    }
    // 현재 대화방에서 이탈하거나(퇴장), 페이지를 닫을 때 최종 읽은 시간 동기화
    return () => {
      if (activeChatId) {
        chatApi.updateReadStatus(activeChatId, userId);
      }
    };
  }, [activeChatId, userId, fetchChatHistory, subscribeToRoom]);

  // 방장이 참가자를 강퇴하는 로직 핸들러
  const handleKickParticipant = async (targetMemberId, targetNickname) => {
    if (!window.confirm(`정말 "${targetNickname}"님을 이 모임에서 퇴장(차단)시키겠습니까?`)) return;

    try {
      // 1. 백엔드 서버에 강퇴 API 호출
      await gatheringApi.kickParticipant(activeChatId, userId, targetMemberId);
      alert("해당 참여자가 모임에서 퇴장 처리되었습니다.");

      // 2. 채팅창에 강퇴 안내 시스템 메시지 전송
      // 백엔드 웹소켓 프로토콜 구조에 따라 'TALK' 대신 'NOTICE'나 'SYSTEM' 타입을 사용할 수도 있습니다.
      // 여기서는 기본 구현된 'TALK' 핸들러를 기반으로 메시지를 보냄
      if (sendMessage) {
        sendMessage(activeChatId, `방장님이 ${targetNickname}님을 퇴장시켰습니다.`, 'KICK');
      }

      // 3. 우측 사이드바 참여 인원 목록 리프레시
      await fetchParticipants();

      // 4. 왼쪽 채팅방 리스트(Sidebar)의 현재 인원수 즉시 감소 반영
      const updatedRooms = chatRooms.map((room) => {
        if (room.id === Number(activeChatId)) {
          return {
            ...room,
            current_count: Math.max(1, (room.current_count || 1) - 1) // 인원이 1명 미만으로 내려가지 않도록 안전장치
          };
        }
        return room;
      });
      setChatRooms(updatedRooms);

    } catch (error) {
      console.error("강퇴 처리 오류:", error);
      alert("퇴장 처리 도중 에러가 발생했습니다.");
    }
  };

  // 실제 방장 권한 위임 후 퇴장을 처리하는 실행 함수
  const handleDelegateAndLeave = async (nextOwnerId, nextOwnerNickname) => {
    const confirmMessage = nextOwnerNickname
      ? `"${nextOwnerNickname}"님에게 방장을 위임하고 퇴장하시겠습니까?`
      : "가장 오래 참여 중인 사람에게 자동으로 방장을 위임하고 퇴장하시겠습니까?";

    if (!window.confirm(confirmMessage)) return;

    try {
      // 1. 권한 위임 API 호출
      await gatheringApi.delegateOwner(activeChatId, userId, nextOwnerId);
      // 2. 모임 퇴장 API 호출
      await gatheringApi.leaveGathering(activeChatId, userId);

      alert("방장 권한을 위임하고 채팅방에서 퇴장하였습니다.");
      setShowDelegateModal(false);
      setActiveChatId(null);
      navigate('/community/chat');
      setChatRooms(chatRooms.filter((room) => room.id !== activeChatId));
    } catch (error) {
      console.error("위임 퇴장 중 오류 발생:", error);
      alert("위임 및 퇴장 처리 중 오류가 발생했습니다.");
    }
  };

  // 채팅방(모임) 나가기 핸들러 함수
  const handleLeaveRoom = async () => {
    if (!activeChatId || !userId) return;

    // 현재 방 타입이 1:1(DIRECT)인지 확인
    const isDirect = selectedChat?.type?.toUpperCase() === 'DIRECT' || roomDetail?.room_type?.toUpperCase() === 'DIRECT';

    // 1:1 채팅방일 경우 전용 커스텀 모달 오픈 후 얼리 리턴
    if (isDirect) {
      // 참여자가 1명 이하(혼자)이면 모달 없이 바로 나가기 실행
      if (participants.length <= 1) {

        handleDirectLeaveOnly();
      } else {
        setShowDirectLeaveModal(true);
      }
      return;
    }

    // 1. 현재 사용자가 이 방의 방장(Owner)인지 확인
    const isOwner = selectedChat?.owner_id === userId || roomDetail?.owner_id === userId;

    if (isOwner) {
      // 참여자가 방장 자신 제외하고 더 있는지 확인 (participants는 자신을 포함하고 있음)
      const otherParticipants = participants.filter(p => {
        const pId = p.member_id || p.MEMBER_ID || p.id;
        return String(pId) !== String(userId);
      });

      if (otherParticipants.length === 0) {
        if (window.confirm("참여자가 없어 모임이 자동으로 삭제됩니다. 정말 나가시겠습니까?")) {
          try {
            await gatheringApi.deleteGathering(activeChatId, userId);
            alert("모임이 삭제되었습니다.");
            setActiveChatId(null);
            navigate('/community/chat');
            setChatRooms(chatRooms.filter((room) => room.id !== activeChatId));
          } catch (error) {
            alert("모임 삭제 중 오류가 발생했습니다.");
          }
        }
        return; // 함수 종료
      } else {
        // 다른 인원이 존재하면 위임 방식 선택 모달 팝업 노출
        setShowDelegateModal(true);
        return;
      }
    }

    // 방장이 아닌 일반 유저의 기존 퇴장 로직
    if (!window.confirm("정말 이 채팅방(모임)에서 나가시겠습니까?")) return;

    try {
      await gatheringApi.leaveGathering(activeChatId, userId);
      alert("채팅방에서 퇴장하였습니다.");
      setActiveChatId(null);
      navigate('/community/chat');
      setChatRooms(chatRooms.filter((room) => room.id !== activeChatId));
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      alert("채팅방을 나가는 도중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (activeChatId) {
      setDisplayChatId(activeChatId);
    } else {
      const timer = setTimeout(() => {
        setDisplayChatId(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeChatId]);

  // 1:1 채팅방 그냥 나가기 실행 함수
  const handleDirectLeaveOnly = async () => {
    // 채팅방에 혼자 남은 경우, 바로 나가지 않고 한 번 더 확인 받기
    if (participants.length <= 1) {
      if (!window.confirm("정말 이 채팅방에서 나가시겠습니까?")) {
        return; // '취소'를 누르면 함수를 종료하여 나가지 않음
      }
    }

    try {
      const target = participants.find(p => {
        const pId = p.member_id || p.MEMBER_ID || p.id;
        return String(pId) !== String(userId);
      });

      // 상대방이 이미 나가서 없는 경우 null로 처리하여 본인은 나갈 수 있도록 방어
      const targetMemberId = target?.member_id || target?.MEMBER_ID || target?.id || null;

      // 1. 백엔드 API 호출
      await chatApi.leaveDirectRoom(activeChatId, userId, false, targetMemberId);

      // 상대방이 아직 방에 남아있을 때만 웹소켓으로 퇴장 알림 전송
      if (targetMemberId && sendMessage) {
        const myNickname = user?.nickname || user?.NICKNAME || '상대방';
        sendMessage(activeChatId, `${myNickname}님이 퇴장하셨습니다.`, 'LEAVE');
      }

      // '확인'을 누르고 정상 처리되면 브라우저 알림창 출력
      alert("채팅방에서 퇴장하였습니다.");

      setShowDirectLeaveModal(false);
      setActiveChatId(null);
      navigate('/community/chat');
      setChatRooms(chatRooms.filter((room) => room.id !== activeChatId));
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      alert("채팅방을 나가는 도중 오류가 발생했습니다.");
    }
  };

  // 1:1 채팅방 차단하고 나가기 실행 함수
  const handleDirectBlockAndLeave = async () => {
    try {
      const target = participants.find(p => {
        const pId = p.member_id || p.MEMBER_ID || p.id;
        return String(pId) !== String(userId);
      });
      const targetMemberId = target?.member_id || target?.MEMBER_ID || target?.id;

      if (!targetMemberId) {
        alert("상대방 정보를 찾을 수 없습니다.");
        return;
      }

      // 차단 여부(isBlock)를 true로 설정하여 순서대로 넘기기
      await chatApi.leaveDirectRoom(activeChatId, userId, true, targetMemberId);

      alert("상대방을 차단하고 채팅방에서 퇴장하였습니다.");
      setShowDirectLeaveModal(false);
      setActiveChatId(null);
      navigate('/community/chat');
      setChatRooms(chatRooms.filter((room) => room.id !== activeChatId));
    } catch (error) {
      console.error("차단 및 나가기 실패:", error);
      alert("처리 도중 오류가 발생했습니다.");
    }
  };

  // URL 주소에 roomId가 없을 때는 자동으로 빈 화면(목록만) 렌더링하도록 분기 처리
  useEffect(() => {
    if (roomId) {
      const parsedRoomId = Number(roomId);
      if (activeChatId !== parsedRoomId) {
        setActiveChatId(parsedRoomId);
      }
    } else {
      // URL 경로가 '/community/chat' 형태로 들어왔다면 열려있던 방 선택을 지워줌
      setActiveChatId(null);
    }
  }, [roomId, activeChatId, setActiveChatId]);

  const handleRoomClick = async (id) => {
    navigate(`/community/chat/${id}`);
  };

  const [showParticipants, setShowParticipants] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    festival: true,
    group: true,
    direct: true
  });
  const scrollRef = useRef(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSidebar = (type) => {
    if (type === 'participants') {
      setShowParticipants(!showParticipants);
      setShowDetails(false);
    } else {
      if (selectedChat?.type?.toUpperCase() === 'DIRECT') return;
      setShowDetails(!showDetails);
      setShowParticipants(false);
    }
  };

  const fetchMyChatRooms = async () => {
    try {
      if (!userId) return;

      const responseData = await chatApi.getUserChatRooms(userId);
      const rawRooms = Array.isArray(responseData) ? responseData : (responseData.list || []);

      // console.log("responseData =", responseData); 
      // console.log("isArray =", Array.isArray(responseData)); // 배열 여부

      const formattedRooms = rawRooms.map(room => {

        const isDirect = room.room_type === 'DIRECT';
        return {
          id: Number(room.room_id),
          type: room.room_type,
          title: room.room_title,
          description: room.room_description,
          room_image: room.room_image,
          current_count: room.current_count,
          max_capacity: room.max_capacity,
          nickname: room.nickname,
          profile_image_url: room.profile_image_url,
          unread_count: room.unread_count || 0, // 미확인 메세지 수
          lastMessage: room.lastMessage || room.last_message || room.LAST_MESSAGE || '대화 내용이 없습니다.', // 백엔드에서 넘겨준 마지막 메시지 필드를 프론트 상태에 매핑 
          owner_id: room.owner_id
        }
      });

      // console.log("formattedRooms", formattedRooms); // 받은 값

      setChatRooms(formattedRooms);
    } catch (error) {
      console.error("채팅방 목록 로드 실패:", error);
    }
  };

  useEffect(() => {
    fetchMyChatRooms();
  }, [userId])

  // 1:1 채팅방 생성 및 이동 요청 핸들러 추가
  const handleStartDirectChat = async (targetMemberId, targetNickname) => {
    try {
      startLoading();

      console.log(userId, targetMemberId)

      // 백엔드로 현재 유저 ID와 상대방 ID 전송
      const response = await chatApi.createOrGetDirectRoom(userId, targetMemberId);
      const targetRoomId = response?.room_id || response;

      console.log(response)

      if (targetRoomId) {
        // 이제 스코프 에러 없이 정상 작동함
        await fetchMyChatRooms();

        // 생성되거나 찾아온 룸 ID로 활성화 및 페이지 이동
        setActiveChatId(Number(targetRoomId));
        navigate(`/community/chat/${targetRoomId}`);

        setShowParticipants(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("차단 목록에 등록되었거나 대화를 나눌 수 없는 유저입니다.")
      } else {
        console.error("1:1 채팅방 생성 실패:", error);
        alert("채팅방을 생성하는 중 오류가 발생했습니다.")
      }
    } finally {
      stopLoading();
    }
  };

  const messages = messagesByRoom[activeChatId] || [];

  const setMessages = (updater) => {
    if (Array.isArray(updater)) {
      const lastAddedMsg = updater[updater.length - 1];
      if (lastAddedMsg && lastAddedMsg.type === 'file') {
        sendMessage(activeChatId, lastAddedMsg.text, 'file');
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(activeChatId, message, 'TALK');
    setMessage('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChatId, displayChatId]);

  const customScrollbarClass = "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300";
  const scrollbarHideClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  // 활성화된 채팅방이 바뀌면 해당 방의 unread_count를 0으로 리셋 (무한루프 방지 조건 포함)
  useEffect(() => {
    if (!activeChatId) return;

    const targetRoom = chatRooms.find(r => r.id === Number(activeChatId));
    // 해당 방이 존재하고, 읽지 않은 메시지가 1개 이상일 때만 상태 업데이트 트리거
    if (targetRoom && targetRoom.unread_count > 0) {
      const updated = chatRooms.map(room =>
        room.id === Number(activeChatId) ? { ...room, unread_count: 0 } : room
      );
      setChatRooms(updated);
    }
  }, [activeChatId, chatRooms, setChatRooms]);

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9">
            <div className="flex h-[750px] bg-white shadow-xl overflow-hidden rounded-[2.5rem] border border-gray-100">
              <ChatSidebar
                sections={sections}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                chatRooms={chatRooms}
                selectedChatId={activeChatId}
                setSelectedChatId={handleRoomClick}
                customScrollbarClass={customScrollbarClass}
                currentUserId={userId}
              />

              <div className={`min-w-0 bg-[#F8F9FF] relative overflow-hidden transition-all duration-500 ease-in-out ${activeChatId
                ? 'flex w-full md:flex-grow translate-x-0 opacity-100'
                : 'hidden md:flex translate-x-full opacity-0'
                }`}
                style={{ flexGrow: activeChatId ? 1 : 0.00001, minWidth: activeChatId ? '0' : '0', width: activeChatId ? 'auto' : '0' }}>

                {selectedChat && (
                  <div className="w-full h-full flex">
                    <ChatWindow
                      selectedChat={detailedChat}
                      setSelectedChatId={setActiveChatId}
                      openFloatingChat={openFloatingChat}
                      toggleSidebar={toggleSidebar}
                      showParticipants={showParticipants}
                      messages={messages}
                      sendMessage={sendMessage}
                      scrollRef={scrollRef}
                      scrollbarHideClass={scrollbarHideClass}
                      message={message}
                      setMessage={setMessage}
                      handleSendMessage={handleSendMessage}
                      participants={participants}
                      currentUserId={userId}
                      onStartDirectChat={handleStartDirectChat}
                    />

                    <ChatDetails
                      showParticipants={showParticipants}
                      showDetails={showDetails}
                      participants={participants}
                      selectedChat={detailedChat}
                      customScrollbarClass={customScrollbarClass}
                      toggleSidebar={toggleSidebar}
                      onLeaveRoom={handleLeaveRoom}
                      currentUserId={userId}
                      isCurrentUserHost={isCurrentUserHost}
                      onKickParticipant={handleKickParticipant}
                      onStartDirectChat={handleStartDirectChat}
                    />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* 방장 권한 위임 선택용 팝업 모달 UI */}
      {showDelegateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-md shadow-2xl border border-gray-100 mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                방장 권한 위임선택
              </h3>
              <button
                onClick={() => setShowDelegateModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-500 mb-5 leading-relaxed">
              채팅방을 나가기 전 권한을 넘겨줄 유저를 직접 선택하거나, 자동 선택 버튼을 눌러 먼저 참여한 사람에게 권한을 위임할 수 있습니다.
            </p>

            {/* 위임 가능 참여자 리스트 (본인 제외) */}
            <div className="max-h-52 overflow-y-auto space-y-2 mb-5 pr-1 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {participants
                .filter(p => {
                  const pId = p.member_id || p.MEMBER_ID || p.id;
                  return String(pId) !== String(userId);
                })
                .map(p => {
                  const pId = p.member_id || p.MEMBER_ID || p.id;
                  const nickname = p.nickname || p.NICKNAME || '이름 없음';
                  const profileImg = p.profile_image_url || p.PROFILE_IMAGE_URL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nickname)}`;

                  return (
                    <button
                      key={pId}
                      onClick={() => handleDelegateAndLeave(pId, nickname)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all text-left group"
                    >
                      <img src={profileImg} className="w-9 h-9 rounded-full object-cover shadow-xs" alt={nickname} />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800 group-hover:text-purple-700 text-sm transition-colors">{nickname}</p>
                      </div>
                      <span className="text-xs font-black text-purple-500 bg-purple-50 px-2 py-1 rounded-md opacity-80 group-hover:opacity-100 transition-all">선택 위임</span>
                    </button>
                  );
                })}
            </div>

            {/* 하단 제어 영역 버튼 단축 구성 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const otherParticipants = participants.filter(p => {
                    const pId = p.member_id || p.MEMBER_ID || p.id;
                    return String(pId) !== String(userId);
                  });
                  if (otherParticipants.length > 0) {
                    const nextOwnerId = otherParticipants[0].member_id || otherParticipants[0].MEMBER_ID || otherParticipants[0].id;
                    const nextOwnerNickname = otherParticipants[0].nickname || otherParticipants[0].NICKNAME;
                    handleDelegateAndLeave(nextOwnerId, nextOwnerNickname);
                  }
                }}
                className="py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl transition-colors shadow-md shadow-purple-600/10 flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-white/90 fill-white/20" />
                자동 선택 위임
              </button>
              <button
                onClick={() => setShowDelegateModal(false)}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 1:1 채팅방 전용 나가기/차단 선택 모달 UI */}
      {showDirectLeaveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-md shadow-2xl border border-gray-100 mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <LogOut className="w-5 h-5 text-red-500" />
                1:1 채팅방 나가기
              </h3>
              <button
                onClick={() => setShowDirectLeaveModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
              정말 이 채팅방에서 나가시겠습니까?<br />
              원하시는 퇴장 방식을 선택해주세요.<br /><br />
              * 차단 시 상대방이 보내는 메시지를 더 이상 수신하지 않으며, <br />
              차단 해제가 불가능 합니다.
            </p>

            {/* 버튼 제어 영역 */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDirectBlockAndLeave}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl transition-colors shadow-md shadow-red-600/10 flex items-center justify-center gap-1.5"
              >
                <Ban className="w-4 h-4" />
                차단하고 나가기
              </button>

              <button
                onClick={handleDirectLeaveOnly}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center"
              >
                그냥 나가기
              </button>

              <button
                onClick={() => setShowDirectLeaveModal(false)}
                className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-400 hover:text-gray-500 font-medium text-sm rounded-xl transition-colors mt-1"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatListPage;