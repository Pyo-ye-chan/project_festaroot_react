import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getActiveTerms } from '../../../api/authApi';

const TERMS_TYPE_BY_SLUG = {
  terms: 'TERMS',
  privacy: 'PRIVACY',
  location: 'LOCATION',
};

const LegalPage = () => {
  const { slug } = useParams();

  const termsType = TERMS_TYPE_BY_SLUG[slug];

  const [termsList, setTermsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTerms = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const res = await getActiveTerms();
        const data = res?.data ?? res;

        if (!isMounted) return;

        setTermsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('약관 정보를 불러오지 못했습니다:', error);

        if (!isMounted) return;

        setTermsList([]);
        setErrorMessage('약관 정보를 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTerms();

    return () => {
      isMounted = false;
    };
  }, []);


  // 유효하지 않은 주소 처리
  const legalDocument = useMemo(() => {
    if (!termsType) {
      return null;
    }

    return (
      termsList.find((item) => {
        const itemType = item.terms_type ?? item.termsType ?? '';

        return itemType.toUpperCase() === termsType;
      }) ?? null
    );
  }, [termsList, termsType]);

  // 예: /legal/terms → TERMS
  //     /legal/privacy → PRIVACY
  //     /legal/location → LOCATION



  const title = legalDocument?.title ?? '약관 안내';

  const description =
    legalDocument?.description ??
    'FESTAROUTE 서비스 이용에 필요한 약관을 안내합니다.';

  const versionLabel = legalDocument?.version
    ? `버전 ${legalDocument.version}`
    : '';

  const effectiveDate =
    legalDocument?.effective_date ?? legalDocument?.effectiveDate;

  return (
    <div className="relative overflow-hidden bg-gray-50">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-violet-100/70 via-white to-transparent" />

      <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-[32px] border border-violet-100 bg-white/95 shadow-[0_24px_80px_rgba(91,33,182,0.08)] backdrop-blur">
          <div className="border-b border-gray-100 px-6 py-8 sm:px-10 sm:py-10">
            <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
              FESTAROUTE LEGAL
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h1>

            {!isLoading && legalDocument && (
              <>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                  {description}
                </p>

                {(versionLabel || effectiveDate) && (
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    {versionLabel}

                    {versionLabel && effectiveDate && (
                      <span className="mx-2">·</span>
                    )}

                    {effectiveDate && `시행일 ${effectiveDate}`}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {isLoading && (
              <div
                role="status"
                className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-8 text-center"
              >
                <p className="text-sm font-bold text-gray-500">
                  약관 정보를 불러오는 중입니다.
                </p>
              </div>
            )}

            {!isLoading && errorMessage && (
              <div
                role="alert"
                className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-center"
              >
                <p className="text-sm font-bold text-red-600">
                  {errorMessage}
                </p>
              </div>
            )}

            {!isLoading && !errorMessage && !legalDocument && (
              <div className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-8 text-center">
                <p className="text-sm font-bold text-gray-500">
                  현재 게시된 약관이 없습니다.
                </p>
              </div>
            )}

            {!isLoading && !errorMessage && legalDocument && (
              <div className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-5 sm:p-7">
                <pre className="whitespace-pre-wrap break-words text-sm font-medium leading-7 text-gray-700 sm:text-[15px]">
                  {legalDocument.content}
                </pre>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Link
                to="/"
                className="inline-flex items-center rounded-2xl bg-[#5b21b6] px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(91,33,182,0.22)] transition-all hover:bg-[#4c1d95]"
              >
                홈으로 가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;