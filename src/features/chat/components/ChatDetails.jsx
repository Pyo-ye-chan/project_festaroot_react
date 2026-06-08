import React from 'react';
import { Ban, MapPin } from 'lucide-react';

const ChatDetails = ({
  showParticipants,
  showDetails,
  participants,
  selectedChat,
  customScrollbarClass
}) => {
  return (
    <aside className={`border-l border-gray-100 flex flex-col bg-white overflow-hidden transition-all duration-300 ease-in-out ${(showParticipants || showDetails) ? 'w-64 opacity-100' : 'w-0 opacity-0'} ${customScrollbarClass}`}>
      {showParticipants && (
        <div className="p-4 space-y-2">
          <h3 className="font-black text-gray-900 text-sm mb-4">참여 인원</h3>
          {participants.map(p => (
            <div key={p.id} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-8 h-8 rounded-full" alt="" />
                <span className="text-sm font-bold">{p.name}</span>
              </div>
              <button className="text-gray-300 hover:text-rose-500"><Ban className="w-4 h-4"/></button>
            </div>
          ))}
        </div>
      )}
      {showDetails && (
        <div className="p-6 space-y-6">
          <h3 className="font-black text-gray-900 text-sm">채팅방 상세 정보</h3>
          {selectedChat?.type === 'festival' && (
            <>
              <div><p className="text-xs font-black text-gray-400">축제 기간</p><p className="text-sm font-bold">{selectedChat.date}</p></div>
              <div><p className="text-xs font-black text-gray-400">위치</p><p className="text-sm font-bold flex items-center gap-1"><MapPin className="w-4 h-4"/>{selectedChat.location}</p></div>
            </>
          )}
          <p className="text-sm text-gray-600 leading-relaxed">상세 설명이 들어갑니다.</p>
        </div>
      )}
    </aside>
  );
};

export default ChatDetails;