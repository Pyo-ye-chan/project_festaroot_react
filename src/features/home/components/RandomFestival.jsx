import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import festivalService from '../../../api/festivalService'; // 프로젝트 구조에 맞게 경로 확인

const RandomFestival = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  // 랜덤 축제 뽑기 핸들러
  const handlePick = async () => {
    setIsSpinning(true);
    try {
      const [data] = await Promise.all([
        festivalService.getRandomFestival(), 
        new Promise((resolve) => setTimeout(resolve, 800)) // 자연스러운 애니메이션 효과를 위한 지연
      ]);

      if (data) {
        setResult(data);
      } else {
        alert("추천해 드릴 축제 데이터가 존재하지 않습니다.");
      }
    } catch (error) {
      console.error("랜덤 축제 추천 실패:", error);
      alert("축제 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsSpinning(false);
    }
  };

  // 상세 페이지 이동 시 조회수 증가 처리 핸들러
  const handleFestivalClick = async (contentId) => {
    try {
      await festivalService.increaseViewCount(contentId);
    } catch (error) {
      console.error("조회수 증가 요청 실패:", error);
    }
  };

  return (
    <section className="bg-purple-50 rounded-[2.5rem] p-8 border border-purple-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center text-center transition-all duration-300 hover:shadow-md hover:border-purple-200">
      <div className="relative z-10 w-full flex flex-col items-center">
        <h3 className="text-xl font-black mb-1 text-purple-900">어디 갈지 고민인가요?</h3>
        <p className="text-purple-400 text-[10px] font-bold opacity-80 mb-8 uppercase tracking-widest">Random Pick</p>

        <div className="min-h-[110px] w-full flex items-center justify-center mb-8">
          {isSpinning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-purple-400 animate-pulse uppercase tracking-wider">Finding Destiny...</p>
            </div>
          ) : result ? (
            <Link 
              to={`/festival/${result.content_id}`} 
              onClick={() => handleFestivalClick(result.content_id)}
              className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-purple-100/70 animate-in zoom-in duration-500 block w-full max-w-[90%] hover:bg-gray-50 hover:border-purple-400 hover:scale-[1.01] active:scale-[0.97] active:bg-gray-100 transition-all duration-150 ease-in-out cursor-pointer"
            >
              <span className="text-purple-700 font-black text-lg block mb-1">✨ {result.title}</span>
              <span className="text-[11px] text-purple-400 font-bold block">당신에게 딱 맞는 축제를 찾았어요!</span>
            </Link>
          ) : (
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-purple-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <span className="text-3xl">🎲</span>
            </div>
          )}
        </div>

        <button
          onClick={handlePick}
          disabled={isSpinning}
          className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl hover:bg-purple-700 transition-all duration-300 active:scale-95 disabled:opacity-50 shadow-lg shadow-purple-200"
        >
          {isSpinning ? '두구두구...' : '랜덤 축제 뽑기!'}
        </button>
      </div>
    </section>
  );
};

export default RandomFestival;