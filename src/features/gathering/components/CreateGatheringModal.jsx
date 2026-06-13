import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CalendarDays, MapPin, Users, Tag, Info, Camera } from 'lucide-react';
import gatheringApi from '../../../api/gatheringApi';

const CreateGatheringModal = ({ onClose, festivalId = null, initialData = null }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isEditMode = !!initialData;

  const [roomTitle, setRoomTitle] = useState(initialData?.room_title || '');
  const [roomDescription, setRoomDescription] = useState(initialData?.room_description || '');
  const [freeDate, setFreeDate] = useState(initialData?.free_date || '');
  const [freeLocation, setFreeLocation] = useState(initialData?.free_location || '');
  const [maxCapacity, setMaxCapacity] = useState(initialData?.max_capacity || 5);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.room_image || null);

  const userName = localStorage.getItem("user");
  const user = JSON.parse(userName);
  const userId = user?.userId || user?.id || user?.member_id;

  useEffect(() => {
    console.log("현재 모임 생성자 ID : ", userId);
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🌟 이미지 업로드 후 JSON으로 모임 생성/수정 요청 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      let uploadedImageUrl = imagePreview; // 기본값은 기존 이미지 (수정 시 변경 없을 수 있음)

      // [Step 1] 새 이미지 파일이 선택되었다면 백엔드 /image 엔드포인트로 먼저 업로드
      if (imageFile) {
        const uploadResult = await gatheringApi.uploadImage(imageFile);
        if (uploadResult.success) {
          uploadedImageUrl = uploadResult.imageUrl; // GCP Storage 주소 확보
        } else {
          alert('이미지 업로드에 실패했습니다.');
          return;
        }
      }

      // [Step 2] 백엔드 GatheringDTO 스펙에 맞춘 객체 생성
      const requestPayload = {
        room_title: roomTitle,
        room_description: roomDescription,
        free_location: freeLocation,
        free_date: freeDate,
        max_capacity: Number(maxCapacity),
        owner_id: userId,
        room_type: initialData?.room_type || 'GROUP',
        festival_id: festivalId ? Number(festivalId) : (initialData?.festival_id ? Number(initialData.festival_id) : null),
        room_image: uploadedImageUrl
      };

      // [Step 3] 데이터 전송 (수정 또는 생성)
      if (isEditMode) {
        const data = await gatheringApi.updateGathering(initialData.room_id, requestPayload);
        if (data.success) {
          alert('모임 정보가 성공적으로 수정되었습니다!');
          onClose(true); // 수정 성공 신호를 보냄
        }
      } else {
        const data = await gatheringApi.createGathering(requestPayload);
        if (data.success) {
          alert('모임이 성공적으로 생성되었습니다!');
          onClose();
          navigate(`/community/chat/${data.roomId}`);
        }
      }
    } catch (error) {
      console.error('모임 처리 에러:', error);
      alert('요청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-lg relative my-8">
        <button onClick={() => onClose(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
          {isEditMode ? '모임 정보 수정하기' : '새 모임 만들기'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이미지 업로드 섹션 */}
          <div className="flex flex-col items-center mb-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden cursor-pointer hover:bg-gray-100 transition-all group"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Camera className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold">모임 대표 이미지 선택</span>
                  <span className="text-xs mt-1">GCP에 안전하게 업로드됩니다</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden" 
              accept="image/*"
            />
          </div>

          {/* 모임 제목 */}
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

          {/* 모임 설명 */}
          <div>
            <label htmlFor="roomDescription" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 모임 설명
            </label>
            <textarea
              id="roomDescription"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              rows="3"
              placeholder="모임에 대한 자세한 내용을 작성해주세요."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all resize-none"
              required
            ></textarea>
          </div>

          {/* 날짜 및 장소 */}
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

          {/* 최대 인원 */}
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

          {/* 하단 버튼 */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors active:scale-95"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white font-bold rounded-full shadow-lg bg-[var(--festival-purple)] hover:bg-[var(--festival-purple-soft)] transition-colors active:scale-95"
            >
              {isEditMode ? '수정 완료하기' : '모임 생성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGatheringModal;