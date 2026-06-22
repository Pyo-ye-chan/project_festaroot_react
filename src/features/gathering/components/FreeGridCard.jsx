import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, CalendarDays } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';

const FreeGridCard = ({ item }) => { // 전체 자유 모임 목록 4개
  const { user } = useAuthStore();
  const loggedInUserId = user?.member_id || user?.id;

  // 데이터 필드 추출 (대문자/소문자 대응)
  const currentCount = item.current_count || item.CURRENT_COUNT || 0;
  const maxCapacity = item.max_capacity || item.MAX_CAPACITY || 5;
  const isFull = currentCount >= maxCapacity;

  const roomTitle = item.room_title || item.ROOM_TITLE || '';
  const freeLocation = item.free_location || item.FREE_LOCATION || '';
  const freeDate = item.free_date || item.FREE_DATE || '';
  const roomId = item.room_id || item.ROOM_ID;
  const nickname = item.nickname || item.NICKNAME || '익명';
  const ownerId = item.owner_id || item.OWNER_ID;
  const profileImage = item.profile_image_url || item.PROFILE_IMAGE_URL;

  // 참여 여부 확인 (백엔드에서 넘겨주는 is_joined 필드 혹은 방장 여부)
  const isJoined = item.is_joined || item.IS_JOINED || (loggedInUserId && loggedInUserId === ownerId);

  // 프로필 이미지가 아닌 모임 생성 시 등록한 이미지를 우선적으로 보여줍니다.
  const gatheringImage = item.room_image || DEFAULT_IMAGES.ROOM_COVER; // 지정 이미지

  const formattedDate = freeDate ? freeDate.replace(/-/g, '.') : '';

  return (
    <Link
      to={`/community/gathering/${roomId}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all flex flex-col"
    >
      <div className="relative h-32 w-full overflow-hidden">
        <img
          src={gatheringImage}
          alt={roomTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm">
            {profileImage && (
              <img
                src={profileImage}
                alt={nickname}
                className="w-5 h-5 rounded-full object-cover border border-blue-100"
              />
            )}
            <span className="text-[10px] font-black text-blue-600">
              {nickname}
            </span>
          </div>
          {isJoined && (
            <div className="px-2 py-0.5 bg-green-500/90 text-white text-[9px] font-black rounded-full shadow-sm backdrop-blur-sm">
              참여 중
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow min-w-0">
        <h5 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors mb-2">
          {roomTitle}
        </h5>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 shrink-0">
              <CalendarDays className="w-3 h-3" />
              {formattedDate}
            </div>
            {freeLocation && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 truncate">
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300 shrink-0" />
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{freeLocation}</span>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-black shrink-0 ml-2 ${isFull ? 'text-red-500' : 'text-blue-600'}`}>
            <Users className="w-3 h-3" /> {currentCount}/{maxCapacity}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FreeGridCard;