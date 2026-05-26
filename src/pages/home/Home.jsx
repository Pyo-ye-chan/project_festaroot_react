import React from 'react';
import Hero from '../components/Hero';
import WeatherDetail from '../components/WeatherDetail';
import ClosingSoon from '../components/ClosingSoon';
import RandomFestival from '../components/RandomFestival';
import TopFestivalsByRegion from '../components/TopFestivalsByRegion';
import FestivalList from '../components/FestivalList';

const Home = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Wireframe 1: Hero Area */}
      <Hero />

      {/* Wireframe 2: Utilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weather Detail */}
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-xl font-black text-gray-900">오늘의 날씨</h3>
              <p className="text-gray-500 text-xs">축제 여행 전 확인하세요</p>
            </div>
            <WeatherDetail />
          </div>

          {/* Closing Soon */}
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-xl font-black text-gray-900">마감 임박</h3>
              <p className="text-gray-500 text-xs">서두르세요! 곧 끝나요</p>
            </div>
            <ClosingSoon />
          </div>

          {/* Random Picker */}
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-xl font-black text-gray-900">오늘의 추천</h3>
              <p className="text-gray-500 text-xs">어디 갈지 고민이라면?</p>
            </div>
            <RandomFestival />
          </div>
        </div>
      </section>

      {/* Wireframe 2: Region Popularity */}
      <section className="bg-white py-12 border-y border-gray-100">
        <TopFestivalsByRegion />
      </section>

      {/* Wireframe 3: Main Festival List */}
      <section>
        <FestivalList />
      </section>
    </div>
  );
};

export default Home;
