import React, { useState } from 'react';

const RandomFestival = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const handlePick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setResult('강원도 대관령 양떼목장 축제');
      setIsSpinning(false);
    }, 800);
  };

  return (
    <section className="bg-purple-600 rounded-3xl p-8 text-white shadow-lg shadow-purple-200 relative overflow-hidden h-full flex flex-col justify-center">
      {/* Decorative background circle */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full opacity-50"></div>
      
      <div className="relative z-10 text-center">
        <h3 className="text-2xl font-black mb-2">어디 갈지 고민인가요?</h3>
        <p className="text-purple-100 text-sm mb-8">오늘의 랜덤 축제를 뽑아보세요!</p>
        
        <div className="min-h-[60px] flex items-center justify-center mb-8">
          {isSpinning ? (
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          ) : result ? (
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl animate-in zoom-in duration-300">
              <span className="font-bold text-lg">✨ {result}</span>
            </div>
          ) : (
            <div className="text-purple-200 font-bold italic">행운의 축제를 뽑아주세요!</div>
          )}
        </div>

        <button 
          onClick={handlePick}
          disabled={isSpinning}
          className="w-full bg-white text-purple-600 font-black py-4 rounded-2xl hover:bg-purple-50 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSpinning ? '두구두구...' : '랜덤 축제 뽑기 🎲'}
        </button>
      </div>
    </section>
  );
};

export default RandomFestival;
