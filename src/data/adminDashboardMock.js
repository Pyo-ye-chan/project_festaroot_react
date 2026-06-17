export const adminDashboardMock = {
  summary: {
    memberCount: 1284,
    todayNewMembers: 18,
    festivalCount: 2458,
    visibleFestivalCount: 2301,
    postCount: 18726,
    todayPostCount: 32,
    reportCount: 156,
    waitingReportCount: 19,
    waitingInquiryCount: 24,
    todayInquiryCount: 6,
    noticeCount: 12,
    visibleNoticeCount: 5,
  },

  weeklyStats: [
    { day: '6/10', members: 12, posts: 25, reports: 3 },
    { day: '6/11', members: 16, posts: 34, reports: 4 },
    { day: '6/12', members: 10, posts: 21, reports: 2 },
    { day: '6/13', members: 22, posts: 42, reports: 6 },
    { day: '6/14', members: 18, posts: 31, reports: 5 },
    { day: '6/15', members: 25, posts: 48, reports: 7 },
    { day: '6/16', members: 18, posts: 32, reports: 4 },
  ],

  festivalStatusStats: [
    { label: '진행중', count: 342, percent: 42 },
    { label: '예정', count: 518, percent: 36 },
    { label: '종료', count: 1398, percent: 18 },
    { label: '숨김', count: 200, percent: 4 },
  ],

  regionStats: [
    { region: '서울', count: 286, percent: 86 },
    { region: '경기', count: 251, percent: 76 },
    { region: '부산', count: 184, percent: 58 },
    { region: '전북', count: 162, percent: 49 },
    { region: '강원', count: 148, percent: 44 },
  ],

  popularFestivals: [
    {
      rank: 1,
      name: '서울빛초롱페스티벌',
      region: '서울특별시',
      views: 125430,
      likes: 8912,
      status: '진행중',
    },
  ],

  recentReports: [
    {
      id: 'RPT-00621',
      type: '부적절한 게시글',
      target: '축제 자유게시판',
      reporter: 'user_2048',
      date: '2026.06.16 14:32',
      status: '접수',
    },
  ],

  recentIssues: [
    {
      type: 'inquiry',
      title: '새 문의가 접수되었습니다.',
      description: '축제 정보 수정 요청 · QNA-0612',
      time: '5분 전',
      status: '대기',
    },
  ],
};