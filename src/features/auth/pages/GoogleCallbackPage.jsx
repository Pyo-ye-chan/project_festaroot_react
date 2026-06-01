import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const calledRef = useRef(false);


    useEffect(() => {


        if (calledRef.current) return;
        calledRef.current = true;

        const code = searchParams.get('code');

        if (!code) return;

        fetch(
            `http://localhost/oauth/google/callback?code=${code}`
        )
            .then(res => res.json())
            .then(data => {

                window.opener.postMessage(
                    {
                        type: 'GOOGLE_LOGIN_SUCCESS',
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
                        type: 'GOOGLE_LOGIN_FAIL'
                    },
                    'http://localhost:5173'
                );

                window.close();
            });

    }, []);

    return <div>구글 로그인 처리중...</div>;
};

export default GoogleCallbackPage;