import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const KakaoCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const parentOrigin = window.location.origin; // https://festaroute.site

    const sendMessageAndClose = (payload) => {
      window.opener?.postMessage(payload, parentOrigin);
      window.close();
    };

    if (error) {
      sendMessageAndClose({
        type: 'KAKAO_LOGIN_FAIL',
        message: `카카오 로그인 실패: ${error}`,
      });
      return;
    }

    if (!code) {
      sendMessageAndClose({
        type: 'KAKAO_LOGIN_FAIL',
        message: '카카오 인가코드가 없습니다.',
      });
      return;
    }

    if (!API_BASE_URL) {
      sendMessageAndClose({
        type: 'KAKAO_LOGIN_FAIL',
        message: 'API 주소가 설정되지 않았습니다.',
      });
      return;
    }

    const kakaoLogin = async () => {
      try {
        const url = new URL('/oauth/kakao/callback', API_BASE_URL);
        url.searchParams.set('code', code);

        console.log('KAKAO CALLBACK FULL URL:', window.location.href);
        console.log('KAKAO CALLBACK CODE:', code);
        console.log('KAKAO BACKEND REQUEST URL:', url.toString());

        const res = await fetch(url.toString(), {
          method: 'GET',
        });

        const text = await res.text();

        console.log('KAKAO BACKEND STATUS:', res.status);
        console.log('KAKAO BACKEND RESPONSE:', text);

        if (!res.ok) {
          throw new Error(text || '카카오 로그인 요청 실패');
        }

        const data = text ? JSON.parse(text) : {};

        sendMessageAndClose({
          type: 'KAKAO_LOGIN_SUCCESS',
          data,
        });
      } catch (error) {
        console.error('카카오 로그인 처리 실패:', error);

        sendMessageAndClose({
          type: 'KAKAO_LOGIN_FAIL',
          message: error.message || '카카오 로그인 처리 중 오류가 발생했습니다.',
        });
      }
    };

    kakaoLogin();
  }, [searchParams]);

  return <div>카카오 로그인 처리중...</div>;
};

export default KakaoCallbackPage;