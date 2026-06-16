import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen p-4 bg-warm-white text-dark-gray">
      <h1 className="text-3xl font-bold mb-6 text-deep-festival-purple">관리자 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-festival-yellow">
          <h2 className="text-xl font-semibold mb-2 text-deep-festival-purple">회원 수</h2>
          <p className="text-4xl font-bold text-festival-yellow">1,234</p>
          <p className="text-sm text-dark-gray mt-2">총 사용자 수</p>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-festival-yellow">
          <h2 className="text-xl font-semibold mb-2 text-deep-festival-purple">축제 데이터</h2>
          <p className="text-4xl font-bold text-festival-yellow">567</p>
          <p className="text-sm text-dark-gray mt-2">등록된 축제 수</p>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-festival-yellow">
          <h2 className="text-xl font-semibold mb-2 text-deep-festival-purple">게시글 수</h2>
          <p className="text-4xl font-bold text-festival-yellow">8,910</p>
          <p className="text-sm text-dark-gray mt-2">총 커뮤니티 게시글</p>
        </div>

        {/* Metric Card 4 - Responsive example */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-festival-yellow col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-2 text-deep-festival-purple">신고 현황</h2>
          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            <p className="text-2xl font-bold text-soft-purple">34</p>
            <span className="text-sm text-dark-gray">처리 대기 중</span>
          </div>
        </div>

        {/* Metric Card 5 */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-festival-yellow">
          <h2 className="text-xl font-semibold mb-2 text-deep-festival-purple">문의 현황</h2>
          <p className="text-4xl font-bold text-festival-yellow">12</p>
          <p className="text-sm text-dark-gray mt-2">미처리 문의</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;