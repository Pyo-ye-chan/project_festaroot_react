import React from 'react';
import festivalService from '../../../api/festivalService';
import useLoadingStore from '../../../store/useLoadingStore';

const Hero = () => {
  const { startLoading, stopLoading } = useLoadingStore();

  const handleUpdateDB = async () => {
    if (confirm("축제API 데이터가 DB에 업데이트 됩니다. 진행하시겠습니까?")) {
      try {
        startLoading();
        const result = await festivalService.upsertFestivals();
        console.log(result)
        alert(result)
      } catch (error) {
        console.error("메인에서 잡은 에러 : ", error)
        alert("서버 연결에 실패했거나 업데이트 중 오류가 발생했습니다.")
      } finally {
        stopLoading();
      }
    } else {
      alert("업데이트가 취소되었습니다.")
    }
  }

  return (
    <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2070"
          alt="Festival background"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/60"></div>
      </div>
      <div className="relative z-10 w-full max-w-4xl px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 drop-shadow-lg leading-tight">
          함께 즐기는 모든 순간, <br />
          <span className="text-purple-400">축제로</span>부터
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 text-lg active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            축제 찾기
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 text-lg active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            지도에서 찾기
          </button>

          <button onClick={handleUpdateDB} className="px-8 py-4 bg-green-500/10 backdrop-blur-md border border-green-500/20 hover:bg-green-500/20 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 text-lg active:scale-95">
            축제 데이터 DB 업데이트 하기
          </button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['#인기축제', '#가족과함께', '#서울야경', '#먹거리축제'].map(tag => (
            <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white border border-white/20 cursor-default hover:bg-white/20 transition-colors duration-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;