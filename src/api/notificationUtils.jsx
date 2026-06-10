import { toast } from 'react-toastify';
import React from 'react';

/**
 * 전역 업적 달성 및 레벨업 알림 유틸리티
 * @param {Array} achievements - 백엔드에서 내려온 achievements 배열
 */
export const notifyAchievements = (achievements) => {
  if (!achievements || achievements.length === 0) return;

  achievements.forEach((ach, index) => {
    // 여러 알림이 겹치지 않도록 순차적으로 표시
    setTimeout(() => {
      toast.success(
        <div className="flex flex-col p-1 min-w-[280px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-100 shrink-0">
              <span className="text-lg">🏆</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none mb-1">New Achievement</span>
              <span className="text-sm font-black text-gray-800 leading-tight">{ach.title}</span>
            </div>
          </div>
          
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 border border-gray-100/50 mb-2">
            <p className="text-xs text-gray-500 font-bold leading-relaxed">{ach.desc}</p>
          </div>
          
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-tighter">Experience Reward</span>
            </div>
            <div className="bg-purple-600 px-2 py-0.5 rounded-md shadow-lg shadow-purple-100">
              <span className="text-[11px] font-black text-white">+{ach.expReward} EXP</span>
            </div>
          </div>
        </div>,
        { 
          icon: false,
          position: "top-right",
          autoClose: 5000,
          className: 'achievement-toast-custom',
          bodyClassName: 'p-0',
        }
      );

      // 레벨업 알림
      if (ach.leveledUp) {
        setTimeout(() => {
          toast.info(
            <div className="flex flex-col p-1 min-w-[280px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 animate-bounce">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[8px] text-white font-black">!</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Status Update</span>
                  <span className="text-base font-black text-gray-800 tracking-tight">Level Up!</span>
                </div>
              </div>
              
              <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                <p className="relative z-10 text-xs text-indigo-900 font-black leading-normal">
                  축하합니다!<br />
                  더 높은 단계의 여행자로 거듭났습니다.
                </p>
              </div>
            </div>,
            { 
              icon: false,
              position: "top-right",
              autoClose: 7000,
              className: 'levelup-toast-custom',
              bodyClassName: 'p-0',
            }
          );
        }, 800);
      }
    }, index * 1200);
  });
};
