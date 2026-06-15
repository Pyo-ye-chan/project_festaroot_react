import React from 'react';

const NotificationItem = ({ notification }) => {
  const { icon, color, title, time, desc, exp, isRead } = notification;

  return (
    <div className={`p-4 flex gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer relative group ${!isRead ? 'bg-purple-50/30' : ''}`}>
      <div className={`w-11 h-11 ${color} rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-black text-gray-900 truncate">{title}</span>
          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{time}</span>
        </div>
        <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{desc}</p>
        {exp && (
          <div className="mt-1">
            <span className="inline-flex items-center px-1.5 py-0.5 bg-purple-600 text-[10px] font-black text-white rounded-md shadow-sm">
              +{exp} EXP
            </span>
          </div>
        )}
      </div>
      {!isRead && (
        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
      )}
    </div>
  );
};

export default NotificationItem;
