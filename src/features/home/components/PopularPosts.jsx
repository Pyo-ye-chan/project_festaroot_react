import React from 'react';

const PopularPosts = () => {
  const posts = [
    { id: 1, title: '양평 딸기축제 다녀왔어요! 🍓 너무 재밌네요', author: '축제요정', date: '2시간 전', views: '1.2k', likes: 45 },
    { id: 2, title: '서울 밤거리 페스티벌 주차 꿀팁 공유합니다 (필독)', author: '베스트드라이버', date: '5시간 전', views: '2.5k', likes: 120 },
    { id: 3, title: '강릉 커피축제 웨이팅 실시간 현황 알려드려요', author: '커피러버', date: '12시간 전', views: '980', likes: 32 },
    { id: 4, title: '이번 주말에 가기 좋은 가성비 축제 추천 리스트', author: '여행박사', date: '1일 전', views: '3.1k', likes: 210 },
    { id: 5, title: '경주 벚꽃 축제 교촌마을 근처 맛집 추천', author: '미식가', date: '2일 전', views: '1.5k', likes: 88 },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">실시간 인기 게시글</h3>
          <p className="text-gray-500 mt-2 font-bold text-sm">커뮤니티에서 지금 가장 핫한 소식들을 확인하세요.</p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-sm shadow-sm active:scale-95">
          더보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} className="flex items-center gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-500 group cursor-pointer">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-50 rounded-2xl text-2xl font-black text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              {index + 1}
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm group-hover:border-purple-100 transition-all duration-500">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-purple-600/70 group-hover:text-purple-600 transition-colors duration-500">{post.author}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-500">
                {post.title}
              </h4>
            </div>
            <div className="flex-shrink-0 flex items-center gap-6 text-sm font-bold text-gray-400">
              <div className="flex items-center gap-1.5 transition-colors duration-500 group-hover:text-gray-600">
                <span className="text-lg">👁️</span>
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-500 transition-transform duration-500 group-hover:scale-110">
                <span className="text-lg">❤️</span>
                <span>{post.likes}</span>
              </div>
              <span className="hidden md:inline text-gray-300 font-medium ml-2">{post.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularPosts;