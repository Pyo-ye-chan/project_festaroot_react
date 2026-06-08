import React from 'react';
import { ExternalLink, Users, X, Paperclip, Send } from 'lucide-react';

const ChatWindow = ({
  selectedChat,
  setSelectedChatId,
  openFloatingChat,
  toggleSidebar,
  showParticipants,
  messages,
  setMessages,
  scrollRef,
  scrollbarHideClass,
  message,
  setMessage,
  handleSendMessage
}) => {
  return (
    <div className="flex flex-col flex-grow min-w-0 bg-white">
      <header className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10 flex-shrink-0">
        <div 
          className={`flex items-center gap-4 min-w-0 ${selectedChat?.type !== 'private' ? 'cursor-pointer group' : ''}`} 
          onClick={() => selectedChat?.type !== 'private' && toggleSidebar('details')}
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
            <img src={selectedChat?.avatar} alt={selectedChat?.title} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-black text-gray-900 truncate group-hover:text-purple-600">{selectedChat?.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              openFloatingChat(selectedChat.id);
              setSelectedChatId(null);
            }}
            className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
          <button onClick={() => toggleSidebar('participants')} className={`p-2.5 rounded-xl transition-all ${showParticipants ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Users className="w-5 h-5" /></button>
          <button onClick={() => setSelectedChatId(null)} className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"><X className="w-5 h-5" /></button>
        </div>
      </header>

      {/* 채팅 내용 스크롤 영역 (스크롤바 숨김 처리) */}
      <div ref={scrollRef} className={`flex-grow overflow-y-auto p-6 space-y-6 bg-[#F8F9FF] ${scrollbarHideClass}`}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-3`}>
            {!msg.isMe && (
              <div className="w-10 h-10 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 mt-1 shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`flex flex-col gap-1.5 max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
              {!msg.isMe && (
                <span className="text-xs font-black text-gray-700 ml-1">{msg.sender}</span>
              )}
              <div className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${msg.isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                  {msg.type === 'file' ? (
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Paperclip className="w-4 h-4" /></div>
                      <span className="underline cursor-pointer decoration-purple-300 underline-offset-4">{msg.text}</span>
                    </div>
                  ) : msg.text}
                </div>
                <span className="text-[10px] text-gray-400 font-bold mb-1 flex-shrink-0">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <label className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl cursor-pointer transition-all">
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setMessages([...messages, { 
                    id: messages.length + 1, 
                    sender: 'na', 
                    text: file.name, 
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                    isMe: true,
                    type: 'file'
                  }]);
                }
              }} 
            />
            <Paperclip className="w-6 h-6" />
          </label>
          <div className="relative flex-grow flex items-center">
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="메시지를 입력하세요..." 
              className="w-full bg-gray-50 rounded-2xl py-3.5 px-6 font-medium text-sm focus:ring-2 focus:ring-purple-600/20" 
            />
          </div>
          <button type="submit" className="p-3.5 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;