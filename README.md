# 축제로 FestaRoute Frontend

국내 지역축제 정보를 지도 기반으로 탐색하고, 사용자 맞춤형 축제 추천 및 커뮤니티 기능을 제공하는 웹 서비스입니다.

## 프로젝트 소개

축제로는 한국관광공사 TourAPI 기반의 축제 정보를 활용하여 사용자가 지역, 날짜, 키워드, 테마별로 축제를 쉽게 찾을 수 있도록 만든 서비스입니다.

React 기반의 프론트엔드에서는 축제 지도 검색, 축제 상세 페이지, AI 플래너, 커뮤니티, 채팅, 마이페이지, 관리자 페이지 화면을 구현했습니다.

## 주요 기능

### 사용자 기능

- 회원가입 / 로그인
- 소셜 로그인
- 축제 지도 검색
- 지역, 날짜, 키워드 기반 축제 필터링
- 축제 상세 정보 조회
- 축제 후기 및 평점 확인
- AI 기반 축제 추천 및 여행 플래너
- 커뮤니티 게시글 작성 / 수정 / 삭제
- 댓글 및 대댓글
- 파일 첨부
- 실시간 채팅
- 마이페이지

### 관리자 기능

- 관리자 대시보드
- 회원 관리
- 축제 정보 관리
- 게시글 신고 관리
- 댓글 신고 관리
- 공지사항 관리
- 문의 관리

## 기술 스택

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Zustand
- React Router
- Axios
- TipTap Editor
- Lucide React

### API / 외부 서비스

- Kakao Map API
- Kakao Local API
- 한국관광공사 TourAPI
- 기상청 API
- Firebase Hosting

## 프로젝트 구조

```bash
src
├── api
├── assets
├── components
├── features
│   ├── admin
│   ├── auth
│   ├── chat
│   ├── community
│   ├── detail
│   ├── festival-map
│   ├── home
│   └── mypage
├── store
├── utils
├── App.jsx
└── main.jsx
