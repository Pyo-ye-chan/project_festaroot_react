import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const NaverCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const parentOrigin = window.location.origin; // https://festaroute.site

    const sendMessageAndClose = (payload) => {
      window.opener?.postMessage(payload, parentOrigin);
      window.close();
    };

    console.log('NAVER CALLBACK PAGE 실행');
    console.log('NAVER CALLBACK FULL URL:', window.location.href);
    console.log('NAVER CALLBACK CODE:', code);
    console.log('NAVER CALLBACK STATE:', state);
    console.log('API_BASE_URL:', API_BASE_URL);

    if (error) {
      sendMessageAndClose({
        type: 'NAVER_LOGIN_FAIL',
        message: errorDescription || `네이버 로그인 실패: ${error}`,
      });
      return;
    }

    if (!code) {
      sendMessageAndClose({
        type: 'NAVER_LOGIN_FAIL',
        message: '네이버 인가코드가 없습니다.',
      });
      return;
    }

    if (!state) {
      sendMessageAndClose({
        type: 'NAVER_LOGIN_FAIL',
        message: '네이버 state 값이 없습니다.',
      });
      return;
    }

    if (!API_BASE_URL) {
      sendMessageAndClose({
        type: 'NAVER_LOGIN_FAIL',
        message: 'API 주소가 설정되지 않았습니다.',
      });
      return;
    }

    const naverLogin = async () => {
      try {
        const url = new URL('/oauth/naver/callback', API_BASE_URL);
        url.searchParams.set('code', code);
        url.searchParams.set('state', state);

        console.log('NAVER BACKEND REQUEST URL:', url.toString());

        const res = await fetch(url.toString(), {
          method: 'GET',
        });

        const text = await res.text();

        console.log('NAVER BACKEND STATUS:', res.status);
        console.log('NAVER BACKEND RESPONSE:', text);

        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { message: text };
        }

        if (!res.ok) {
          throw new Error(data.message || text || '네이버 로그인 요청 실패');
        }

        sendMessageAndClose({
          type: 'NAVER_LOGIN_SUCCESS',
          data,
        });
      } catch (err) {
        console.error('네이버 로그인 처리 실패:', err);

        sendMessageAndClose({
          type: 'NAVER_LOGIN_FAIL',
          message: err.message || '네이버 로그인 처리 중 오류가 발생했습니다.',
        });
      }
    };

    naverLogin();
  }, [searchParams]);

  return <div>네이버 로그인 처리중...</div>;
};

export default NaverCallbackPage;