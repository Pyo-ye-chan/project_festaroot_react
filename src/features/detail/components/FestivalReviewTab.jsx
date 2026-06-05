import { Camera, Star } from 'lucide-react';

const FestivalReviewTab = ({ festival, sortType, setSortType }) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            방문자 후기
            <span className="text-purple-600">
              {festival.review_count || 0}
            </span>
          </h3>

          <div className="flex items-center gap-1 mt-1">
            <Star size={16} fill="#FACC15" className="text-yellow-400" />
            <span className="text-lg font-black text-gray-800">
              {festival.rating_avg ? festival.rating_avg.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-gray-400 font-bold ml-1">/ 5.0</span>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
          {['최신순', '별점순'].map((type) => (
            <button
              key={type}
              onClick={() => setSortType(type)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                sortType === type
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <p className="text-gray-400 font-bold">아직 등록된 후기가 없습니다.</p>

      <button className="w-full mt-10 h-16 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-black hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600 transition-all flex items-center justify-center gap-2">
        <Camera size={20} />
        생생한 후기 작성하기
      </button>
    </div>
  );
};

export default FestivalReviewTab;