import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { MapPin, ChevronLeft, Sparkles, Heart } from 'lucide-react';
import { signup } from '../../../api/memberApi';
import useAuthStore from '../../../store/useAuthStore';

const SignupPreferencesPage = () => {
  const navigate = useNavigate();
  const { signupData, resetSignupData } = useAuthStore();

  const [selectedRegions, setSelectedRegions] = useState(signupData.regions || []);
  const [selectedThemes, setSelectedThemes] = useState(signupData.themes || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regions = [
    '전국', '서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종',
    '전북', '전남', '광주', '경북', '경남', '대구', '울산', '부산', '제주'
  ];

  const themes = [
    '힐링', '체험', '먹거리', '축제', '공연', '자연', '역사', '문화', '쇼핑', '캠핑',
    '등산', '바다', '카페', '야경', '데이트', '가족여행', '반려동물', '레저', '온천', '예술',
    '사진', '드라이브', '테마파크', '전통시장', '사찰/종교', '섬 여행', '미술관', '박물관',
    '클래식', '음악페스티벌', '스포츠관람', '액티비티', '워터파크', '스키/보드', '골프',
    '낚시', '플로깅', '호캉스', '기차여행', '자전거', '숲캉스', '미식투어', '로컬체험', '교육/학습'
  ];

  const handleRegionToggle = (region) => {
    if (region === '전국') {
      setSelectedRegions((prev) => (prev.includes('전국') ? [] : ['전국']));
      return;
    }

    setSelectedRegions((prev) => {
      const filtered = prev.filter((item) => item !== '전국');

      if (filtered.includes(region)) {
        return filtered.filter((item) => item !== region);
      }

      return [...filtered, region];
    });
  };

  const handleThemeToggle = (theme) => {
    setSelectedThemes((prev) => {
      if (prev.includes(theme)) {
        return prev.filter((item) => item !== theme);
      }

      return [...prev, theme];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signupData.email) {
      alert('이메일 정보가 없습니다. 이전 단계에서 이메일을 입력해주세요.');
      navigate('/signup');
      return;
    }

    const finalData = {
      ...signupData,

      // 백엔드 MEMBER 필수/기본값 보정
      email: signupData.email || '',
      social_provider: signupData.social_provider || 'LOCAL',
      profile_image_url: signupData.profile_image_url || '',
      title_id: signupData.title_id || 1,

      // TourAPI 코드 임시값
      reside_area_code: signupData.reside_area_code || '0',
      reside_sigungu_code: signupData.reside_sigungu_code || '0',

      // 취향 정보
      regions: selectedRegions,
      themes: selectedThemes
    };

    try {
      setIsSubmitting(true);

      console.log('최종 회원가입 데이터:', finalData);

      const response = await signup(finalData);

      if (response.data === 'success') {
        alert('회원가입이 완료되었습니다!');
        resetSignupData();
        navigate('/login');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="취향 설정"
      subtitle="나에게 딱 맞는 축제와 여행 정보를 추천해드릴게요"
      maxWidth="max-w-2xl"
    >
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full text-festival-purple text-sm font-bold">
          <Sparkles size={16} />
          <span>마지막 단계입니다!</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={20} className="text-festival-purple" />
              어디로 떠나고 싶으신가요?
            </h3>
            <span className="text-xs text-gray-400 font-medium">복수 선택 가능</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => handleRegionToggle(region)}
                className={`h-11 rounded-xl text-sm font-bold transition-all border ${
                  selectedRegions.includes(region)
                    ? 'bg-festival-purple border-festival-purple text-white shadow-md shadow-purple-100'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-festival-purple hover:text-festival-purple'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Heart size={20} className="text-red-400" />
              어떤 테마를 좋아하시나요?
            </h3>
            <span className="text-xs text-gray-400 font-medium">복수 선택 가능</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => handleThemeToggle(theme)}
                className={`px-5 h-10 rounded-full text-sm font-bold transition-all border ${
                  selectedThemes.includes(theme)
                    ? 'bg-festival-yellow border-festival-yellow text-gray-900 shadow-md shadow-yellow-50'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-festival-yellow hover:text-gray-900'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </section>

        <div className="pt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="flex-1 h-14 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} />
            이전으로
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] h-14 rounded-2xl bg-festival-purple text-white font-bold shadow-lg shadow-purple-100 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? '가입 처리 중...' : '가입 완료하기'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPreferencesPage;