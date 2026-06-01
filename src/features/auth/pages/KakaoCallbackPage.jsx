import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const KakaoCallbackPage = () => {
  const [searchParams] = useSearchParams();

  const calledRef = useRef(false);

  useEffect(() => {

    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get('code');

    const parentOrigin = 'http://localhost:5173';

    if (!code) {
      window.opener?.postMessage(
        {
          type: 'KAKAO_LOGIN_FAIL',
          message: '카카오 인가코드가 없습니다.'
        },
        parentOrigin
      );

      window.close();
      return;
    }

    const kakaoLogin = async () => {
      try {
        console.log('카카오 인가코드:', code);

        const res = await fetch(
          `http://localhost/oauth/kakao/callback?code=${encodeURIComponent(code)}`
        );

        if (!res.ok) {
          throw new Error('카카오 로그인 요청 실패');
        }

        const data = await res.json();

        window.opener?.postMessage(
          {
            type: 'KAKAO_LOGIN_SUCCESS',
            data
          },
          parentOrigin
        );
        console.log(data);

        window.close();
      } catch (error) {
        console.error('카카오 로그인 처리 실패:', error);

        window.opener?.postMessage(
          {
            type: 'KAKAO_LOGIN_FAIL',
            message: '카카오 로그인 처리 중 오류가 발생했습니다.'
          },
          parentOrigin
        );

        window.close();
      }
    };

    kakaoLogin();
  }, [searchParams]);

  return <div>카카오 로그인 처리중...</div>;
};

export default KakaoCallbackPage;