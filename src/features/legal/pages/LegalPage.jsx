import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getActiveTerms } from '../../../api/authApi';
import {
  LEGAL_DOCUMENTS,
  LEGAL_DOCUMENT_LIST,
} from '../legalDocuments';

const documentByType = LEGAL_DOCUMENT_LIST.reduce((acc, item) => {
  acc[item.type] = item;
  return acc;
}, {});

const LegalPage = () => {
  const { slug } = useParams();
  const fallbackDocument = LEGAL_DOCUMENTS[slug] || LEGAL_DOCUMENTS.terms;
  const [activeTerms, setActiveTerms] = useState([]);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await getActiveTerms();
        setActiveTerms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('약관 정보를 불러오지 못했습니다:', error);
      }
    };

    fetchTerms();
  }, []);

  const document = useMemo(() => {
    const matchedTerm = activeTerms.find(
      (item) =>
        item.terms_type === fallbackDocument.type ||
        item.termsType === fallbackDocument.type,
    );

    if (!matchedTerm) {
      return fallbackDocument;
    }

    return {
      ...fallbackDocument,
      title: matchedTerm.title || fallbackDocument.title,
      versionLabel: matchedTerm.version
        ? `버전 ${matchedTerm.version}`
        : fallbackDocument.versionLabel,
      content: matchedTerm.content || fallbackDocument.content,
    };
  }, [activeTerms, fallbackDocument]);

  return (
    <div className="relative overflow-hidden bg-gray-50">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-violet-100/70 via-white to-transparent" />

      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-[32px] border border-violet-100 bg-white/95 shadow-[0_24px_80px_rgba(91,33,182,0.08)] backdrop-blur">
          <div className="border-b border-gray-100 px-6 py-8 sm:px-10 sm:py-10">
            <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
              FESTAROUTE LEGAL
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              {document.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              {document.description}
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
              {document.versionLabel}
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="rounded-[28px] border border-gray-100 bg-gray-50/80 p-5 sm:p-7">
              <pre className="whitespace-pre-wrap break-words text-sm font-medium leading-7 text-gray-700 sm:text-[15px]">
                {document.content}
              </pre>
            </div>

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
