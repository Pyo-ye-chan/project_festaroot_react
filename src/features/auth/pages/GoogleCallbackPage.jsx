import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const calledRef = useRef(false);


    useEffect(() => {


        if (calledRef.current) return;
        calledRef.current = true;

        const code = searchParams.get('code');
        const API_BASE_URL = import.meta.env.VITE_API_URL;

        if (!code) return;

        fetch(
            `${API_BASE_URL}/oauth/google/callback?code=${code}`
        )
            .then(res => res.json())
            .then(data => {

                window.opener.postMessage(
                    {
                        type: 'GOOGLE_LOGIN_SUCCESS',
                        data
                    },
                    'https://festaroute.site'
                );

                window.close();
            })
            .catch(err => {
                console.error(err);

                window.opener.postMessage(
                    {
                        type: 'GOOGLE_LOGIN_FAIL'
                    },
                    'https://festaroute.site'
                );

                window.close();
            });

    }, []);

    return <div>구글 로그인 처리중...</div>;
};

export default GoogleCallbackPage;