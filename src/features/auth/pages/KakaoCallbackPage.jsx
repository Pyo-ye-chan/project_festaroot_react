import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const KakaoCallbackPage = () => {

  const [searchParams] = useSearchParams();

  useEffect(() => {

    const code = searchParams.get('code');

    if (!code) return;

    // 백엔드 요청
    fetch(`http://localhost:5173/oauth/kakao/callback?code=${code}`)
      .then(res => res.json())
      .then(data => {

        console.log(code);

        // 부모창으로 전달
        window.opener.postMessage(
          {
            type: 'KAKAO_LOGIN_SUCCESS',
            token: data.token,
            user: data.user
          },
          '*'
        );

        // 팝업 닫기
        window.close();

      });

  }, []);

  return <div>카카오 로그인 처리중...</div>;
};

export default KakaoCallbackPage;