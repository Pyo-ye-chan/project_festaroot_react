import React from 'react';
import Hero from '../components/Hero';
import WeatherDetail from '../components/WeatherDetail';
import ClosingSoon from '../components/ClosingSoon';
import RandomFestival from '../components/RandomFestival';
import TopFestivalsByRegion from '../components/TopFestivalsByRegion';
import FestivalList from '../components/FestivalList';
import OngoingFestivals from '../components/OngoingFestivals';
import PopularPosts from '../components/PopularPosts';

const Home = () => {
  return (
    <div className="space-y-12 pb-20 bg-gray-50/30">
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeatherDetail />
          <ClosingSoon />
          <RandomFestival />
        </div>
      </section>
      <section className="bg-white py-12 border-y border-gray-100 transition-colors duration-500 hover:bg-gray-50/30">
        <TopFestivalsByRegion />
      </section>
      <section>
        <FestivalList />
      </section>
      <section>
        <OngoingFestivals />
      </section>
      <section>
        <PopularPosts />
      </section>
    </div>
  );
};

export default Home;