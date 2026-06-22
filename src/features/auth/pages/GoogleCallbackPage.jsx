import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost';
    const parentOrigin = window.location.origin; // https://festaroute.site

    const sendMessageAndClose = (payload) => {
      window.opener?.postMessage(payload, parentOrigin);
      window.close();
    };

    console.log('GOOGLE CALLBACK PAGE 실행');
    console.log('GOOGLE CALLBACK FULL URL:', window.location.href);
    console.log('GOOGLE CALLBACK CODE:', code);
    console.log('API_BASE_URL:', API_BASE_URL);

    if (error) {
      sendMessageAndClose({
        type: 'GOOGLE_LOGIN_FAIL',
        message: errorDescription || `구글 로그인 실패: ${error}`,
      });
      return;
    }

    if (!code) {
      sendMessageAndClose({
        type: 'GOOGLE_LOGIN_FAIL',
        message: '구글 인가코드가 없습니다.',
      });
      return;
    }

    const googleLogin = async () => {
      try {
        const url = new URL('/oauth/google/callback', API_BASE_URL);
        url.searchParams.set('code', code);

        console.log('GOOGLE BACKEND REQUEST URL:', url.toString());

        const res = await fetch(url.toString(), {
          method: 'GET',
        });

        const text = await res.text();

        console.log('GOOGLE BACKEND STATUS:', res.status);
        console.log('GOOGLE BACKEND RESPONSE:', text);

        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = { message: text };
        }

        if (!res.ok) {
          throw new Error(data.message || text || '구글 로그인 요청 실패');
        }

        sendMessageAndClose({
          type: 'GOOGLE_LOGIN_SUCCESS',
          data,
        });
      } catch (err) {
        console.error('구글 로그인 처리 실패:', err);

        sendMessageAndClose({
          type: 'GOOGLE_LOGIN_FAIL',
          message: err.message || '구글 로그인 처리 중 오류가 발생했습니다.',
        });
      }
    };

    googleLogin();
  }, [searchParams]);

  return <div>구글 로그인 처리중...</div>;
};

export default GoogleCallbackPage;
