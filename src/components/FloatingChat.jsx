import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { 
  Send, 
  Users, 
  X, 
  MessageCircle, 
  Paperclip,
  Minimize2,
  Maximize2
} from 'lucide-react';
import useChatStore from '../store/useChatStore';

const FloatingChat = () => {
  const { isFloating, activeChatId, closeFloatingChat } = useChatStore();
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef(null);
  const nodeRef = useRef(null);

  // Mock data - In real app, fetch based on activeChatId
  const [messages, setMessages] = useState([
    { id: 1, sender: '김철수', text: '안녕하세요! 이 채팅은 떠다닙니다.', time: '오후 2:30', isMe: false },
    { id: 2, sender: '나', text: '네, 정말 편리하네요!', time: '오후 2:35', isMe: true },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  if (!isFloating) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { 
      id: messages.length + 1, 
      sender: '나', 
      text: message, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      isMe: true 
    }]);
    setMessage('');
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle">
      <div 
        ref={nodeRef}
        className={`fixed bottom-6 right-6 z-[9999] bg-white shadow-2xl rounded-3xl border border-gray-100 flex flex-col transition-[height,width] duration-300 ${isMinimized ? 'w-72 h-16' : 'w-96 h-[500px]'}`}
      >
        {/* Header */}
        <header className="drag-handle h-16 border-b border-gray-100 flex items-center justify-between px-4 bg-purple-600 rounded-t-3xl text-white cursor-move active:cursor-grabbing">
          <div className="flex items-center gap-2 pointer-events-none">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-sm truncate">떠다니는 채팅창</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-lg transition-all relative z-10">
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button onClick={closeFloatingChat} className="p-1.5 hover:bg-rose-500 rounded-lg transition-all relative z-10">
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/30 custom-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-2`}>
                  {!msg.isMe && (
                    <div className="w-8 h-8 rounded-xl bg-purple-100 overflow-hidden flex-shrink-0 mt-1">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} />
                    </div>
                  )}
                  <div className={`flex flex-col gap-1 max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-end gap-1.5 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`px-4 py-2 rounded-2xl text-xs font-medium shadow-sm ${msg.isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold mb-1">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white rounded-b-3xl">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <label className="p-1.5 text-gray-400 hover:text-purple-600 cursor-pointer">
                  <input type="file" className="hidden" />
                  <Paperclip className="w-5 h-5" />
                </label>
                <input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="메시지 입력..." 
                  className="flex-grow bg-gray-50 rounded-xl py-2 px-4 text-xs font-medium focus:ring-2 focus:ring-purple-600/20 outline-none" 
                />
                <button type="submit" className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default FloatingChat;
