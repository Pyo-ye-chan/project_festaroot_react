import React from 'react';
import { MessageCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';

const ChatSidebar = ({
  sections,
  expandedSections,
  toggleSection,
  chatRooms,
  selectedChatId,
  setSelectedChatId,
  customScrollbarClass
}) => {
  return (
    <aside className={`flex flex-col bg-white z-20 overflow-y-auto transition-all duration-500 ${customScrollbarClass} ${selectedChatId ? 'w-full md:w-64 lg:w-72 border-r border-gray-100' : 'flex-grow w-full'}`}>
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-purple-600" />
          메시지
        </h1>
        <div className="relative group">
          <input type="text" placeholder="채팅방 검색..." className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-600/20 transition-all" />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 w-4 h-4" />
        </div>
      </div>

      <div className={`flex-grow overflow-y-auto pt-4 ${customScrollbarClass}`}>
        {sections.map(section => (
          <div key={section.id} className="mb-2 last:mb-0">
            <div className="px-6 py-2">
              <button 
                onClick={() => toggleSection(section.id)} 
                className="w-full flex items-center justify-between font-black text-gray-600 text-sm uppercase tracking-wider hover:text-purple-600 transition-colors"
              >
                {section.label}
                {expandedSections[section.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>
            
            {expandedSections[section.id] && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                {chatRooms.filter(c => c.type === section.id).map((chat) => (
                  <button 
                    key={chat.id} 
                    onClick={() => setSelectedChatId(selectedChatId === chat.id ? null : chat.id)} 
                    className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-l-4 ${selectedChatId === chat.id ? 'bg-purple-50/50 border-purple-600' : 'border-transparent'}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden">
                        <img src={chat.avatar} alt={chat.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-grow text-left">
                      <h3 className="font-black text-gray-900 text-base truncate">{chat.title}</h3>
                      <p className="text-sm font-medium text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebar;