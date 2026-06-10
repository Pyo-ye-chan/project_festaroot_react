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
        <div className="flex flex-col gap-1">
          <div className="font-black text-gray-800 flex items-center gap-2">
            🏆 업적 달성!
          </div>
          <div className="text-sm font-bold text-purple-600">{ach.title}</div>
          <div className="text-xs text-gray-500 font-medium">{ach.desc}</div>
          <div className="text-[10px] text-yellow-600 font-bold">+{ach.expReward} EXP 보상</div>
        </div>,
        { 
          icon: "🎉",
          position: "top-right",
          autoClose: 5000
        }
      );

      // 레벨업 알림
      if (ach.leveledUp) {
        setTimeout(() => {
          toast.info(
            <div className="flex flex-col gap-1">
              <div className="font-black text-blue-600 flex items-center gap-2">
                ⭐ LEVEL UP!
              </div>
              <div className="text-xs text-gray-600 font-bold">
                축하합니다! 새로운 레벨에 도달했습니다.
              </div>
            </div>,
            { 
              icon: "🚀",
              position: "top-right",
              autoClose: 6000
            }
          );
        }, 500);
      }
    }, index * 1000);
  });
};
