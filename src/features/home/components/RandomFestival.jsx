import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RandomFestival = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const handlePick = () => {
    setIsSpinning(true);
    setTimeout(() => { setResult({ id: 1, name: '2026 별빛 밤거리 페스티벌' }); setIsSpinning(false); }, 800);
  };
  return (
    <section className="bg-purple-50 rounded-[2.5rem] p-8 border border-purple-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center text-center transition-all duration-300 hover:shadow-md hover:border-purple-200">
      <div className="relative z-10">
        <h3 className="text-xl font-black mb-1 text-purple-900 font-black">어디 갈지 고민인가요?</h3>
        <p className="text-purple-400 text-[10px] font-bold opacity-80 mb-8 uppercase tracking-widest">Random Pick</p>

        <div className="min-h-[100px] flex items-center justify-center mb-8">
          {isSpinning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-purple-400 animate-pulse uppercase tracking-wider">Finding Destiny...</p>
            </div>
          ) : result ? (
            <Link to={`/festival/${result.id}`} className="bg-white p-5 rounded-[2rem] shadow-sm border border-purple-100 animate-in zoom-in duration-500 block hover:border-purple-300 transition-all">
              <span className="text-purple-700 font-black text-base block mb-1">✨ {result.name}</span>
              <span className="text-[10px] text-purple-400 font-bold">당신에게 딱 맞는 축제를 찾았어요!</span>
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