import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 경로(pathname)가 바뀔 때마다 스크롤을 최상단(0, 0)으로 이동
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // 화면에 그리는 건 없으므로 null 반환
};

export default ScrollToTop;