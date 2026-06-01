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

        if (!code) return;

        fetch(
            `http://localhost/oauth/naver/callback?code=${code}&state=${state}`
        )
            .then(res => res.json())
            .then(data => {

                window.opener.postMessage(
                    {
                        type: 'NAVER_LOGIN_SUCCESS',
                        data
                    },
                    'http://localhost:5173'
                );

                window.close();
            })
            .catch(err => {
                console.error(err);

                window.opener.postMessage(
                    {
                        type: 'NAVER_LOGIN_FAIL'
                    },
                    'http://localhost:5173'
                );

                window.close();
            });

    }, []);

    return <div>네이버 로그인 처리중...</div>;
};

export default NaverCallbackPage;