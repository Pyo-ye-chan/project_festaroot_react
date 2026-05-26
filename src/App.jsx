import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 opacity-60">
            <img 
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2070" 
              alt="Festival background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center px-4">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
              함께 즐기는 모든 순간, <br/>
              <span className="text-purple-400">축제로</span>부터
            </h2>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
              전국의 모든 축제 정보를 한눈에 확인하고 나만의 완벽한 여행 계획을 세워보세요.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-purple-500/30">
                축제 찾기
              </button>
              <button className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-full transition-all shadow-lg">
                지도에서 보기
              </button>
            </div>
          </div>
        </section>

        {/* Placeholder Content for Scroll */}
        <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">실시간 인기 축제</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/${i + 10}/800/600`} 
                    alt="Festival" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                    D-12
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-purple-600 text-sm font-bold uppercase tracking-wider">서울 / 문화예술</span>
                  <h4 className="text-xl font-bold text-gray-900 mt-2 mb-3">2026 별빛 밤거리 페스티벌</h4>
                  <div className="flex items-center text-gray-500 text-sm gap-4">
                    <span className="flex items-center gap-1">📍 서울 중구</span>
                    <span className="flex items-center gap-1">📅 05.28 - 06.01</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
