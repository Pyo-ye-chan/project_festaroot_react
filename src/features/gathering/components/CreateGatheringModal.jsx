import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CalendarDays, MapPin, Users, Tag, Info } from 'lucide-react';
import gatheringApi from '../../../api/gatheringApi';

// 만약 축제 상세페이지에서 열었다면 props로 festivalId를 받아올 수 있도록 설계합니다.
const CreateGatheringModal = ({ onClose, festivalId = null }) => {
  const navigate = useNavigate();

  // 💡 백엔드 DTO 필드명과 매핑하기 쉽게 상태명 변경
  const [roomTitle, setRoomTitle] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [freeDate, setFreeDate] = useState('');
  const [freeLocation, setFreeLocation] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(5);

  const userName = localStorage.getItem("user");
  const user = JSON.parse(userName);
  const userId = user?.userId || user?.id || user?.member_id;

  useEffect(() => {
    console.log("현재 모임 생성자 ID : ",userId);
  }, [userId])

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 백엔드 GatheringCreateDTO 구조와 완벽히 일치하는 페이로드 구성
    const requestData = {
      roomTitle,
      roomDescription,
      freeLocation,
      freeDate, // yyyy-MM-dd 형태의 문자열은 자바의 LocalDate로 자동 파싱됩니다.
      maxCapacity: Number(maxCapacity),
      festivalId: festivalId, // 상위에서 전달받은 값이 있으면 id 입력, 없으면 null
      ownerId: userId
    };

    try {
      // 백엔드 컨트롤러 주소로 POST 요청
      const data = await gatheringApi.createGathering(requestData)

      if (data.success) {
        alert('모임이 성공적으로 생성되었습니다!');
        onClose();
        // 생성된 채팅방 번호(roomId)를 받아 해당 채팅방 화면으로 즉시 내비게이션
        navigate(`/chat/${data.roomId}`);
      }
    } catch (error) {
      console.error('모임 생성 에러:', error);
      alert('모임 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">새 모임 만들기</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. 모임 제목 */}
          <div>
            <label htmlFor="roomTitle" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 모임 제목
            </label>
            <input
              type="text"
              id="roomTitle"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="예: 부산 록 페스티벌 같이 즐길 사람!"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
              required
            />
          </div>

          {/* 2. 모임 설명 */}
          <div>
            <label htmlFor="roomDescription" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 모임 설명
            </label>
            <textarea
              id="roomDescription"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              rows="4"
              placeholder="모임에 대한 자세한 내용을 작성해주세요. (예: 어떤 활동을 할 건지, 준비물 등)"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all resize-none"
              required
            ></textarea>
          </div>

          {/* 3. 날짜 및 장소 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="freeDate" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 날짜
              </label>
              <input
                type="date"
                id="freeDate"
                value={freeDate}
                onChange={(e) => setFreeDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="freeLocation" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 장소
              </label>
              <input
                type="text"
                id="freeLocation"
                value={freeLocation}
                onChange={(e) => setFreeLocation(e.target.value)}
                placeholder="예: 잠실 주경기장"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
                required
              />
            </div>
          </div>

          {/* 4. 최대 인원 */}
          <div>
            <label htmlFor="maxCapacity" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 최대 인원
            </label>
            <input
              type="number"
              id="maxCapacity"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              min="2"
              max="20"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
              required
            />
          </div>

          {/* 하단 버튼 제어 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors active:scale-95"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent text-white font-bold rounded-full shadow-sm bg-[var(--festival-purple)] hover:bg-[var(--festival-purple-soft)] transition-colors active:scale-95"
            >
              모임 생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGatheringModal;