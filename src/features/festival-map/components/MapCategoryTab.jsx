import useMapStore from '../../../store/useMapStore';

function MapCategoryTab() {
  const { activeCategory, setActiveCategory } = useMapStore();

  const tabs = [
    { name: '전체', icon: '📍' },
    { name: '음식점', icon: '🍽️' },
    { name: '관광지', icon: '⛰️' },
    { name: '문화시설', icon: '🏛️' }
  ];

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 max-w-[calc(100%-32px)]">
      {tabs.map((tab, idx) => (
        <button 
          key={idx} 
          onClick={() => setActiveCategory(tab.name)}
          className={`px-4 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
            activeCategory === tab.name 
              ? "bg-[#6B46FE] text-white shadow-purple-200" 
              : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
          }`}
        >
          <span>{tab.icon}</span>
          {tab.name}
        </button>
      ))}
    </div>
  );
}

export default MapCategoryTab;