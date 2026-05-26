import React from 'react';

const Hero = () => {
  return (
    <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background with Overlay */}
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
          함께 즐기는 모든 순간, <br/>
          <span className="text-purple-400">축제로</span>부터
        </h2>
        
        {/* Search Bar - Common in Wireframe 1 */}
        <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
          <div className="flex-grow flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-gray-100 py-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="가고 싶은 축제나 지역을 검색해 보세요" 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-medium placeholder-gray-400"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/30 whitespace-nowrap">
            축제 찾기
          </button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['#인기축제', '#가족과함께', '#서울야경', '#먹거리축제'].map(tag => (
            <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white border border-white/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
