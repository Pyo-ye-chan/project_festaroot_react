import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import {
  MapPin,
  ChevronLeft,
  Sparkles,
  Heart
} from 'lucide-react';
import { signup } from '../../../api/memberApi';
import useMemberStore from '../../../store/useMemberStore';
import { getSidoList } from '../../../api/regionApi';
import { getThemeList } from '../../../api/themeApi';

const SignupPreferencesPage = () => {
  const navigate = useNavigate();
  const { signupData, resetSignupData } = useMemberStore();

  const [sidoOptions, setSidoOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);

  const [selectedRegions, setSelectedRegions] = useState(signupData.regions || []);
  const [selectedThemes, setSelectedThemes] = useState(signupData.themes || []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log(signupData)
    const fetchInitialData = async () => {
      try {
        const [sidoRes, themeRes] = await Promise.all([
          getSidoList(),
          getThemeList()
        ]);

        setSidoOptions(sidoRes.data || []);
        setThemeOptions(themeRes.data || []);
      } catch (error) {
        console.error('초기 코드 목록 조회 실패:', error);
        alert('지역/테마 정보를 불러오지 못했습니다.');
      }
    };

    fetchInitialData();
  }, []);

  const handleRegionToggle = (regionCode) => {
    const code = String(regionCode);

    if (code === 'ALL') {
      setSelectedRegions((prev) => (prev.includes('ALL') ? [] : ['ALL']));
      return;
    }

    setSelectedRegions((prev) => {
      const filtered = prev.filter((item) => item !== 'ALL');

      if (filtered.includes(code)) {
        return filtered.filter((item) => item !== code);
      }

      return [...filtered, code];
    });
  };

  const handleThemeToggle = (themeCode) => {
    const code = String(themeCode);

    setSelectedThemes((prev) => {
      if (prev.includes(code)) {
        return prev.filter((item) => item !== code);
      }

      return [...prev, code];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;


    if (!signupData.email) {
      alert('이메일 정보가 없습니다.');
      navigate(
        signupData.social_provider && signupData.social_provider !== 'LOCAL'
          ? '/signup/social-info'
          : '/signup'
      );
      return;
    }

    if (selectedRegions.length === 0) {
      alert('관심 지역을 1개 이상 선택해주세요.');
      return;
    }

    if (selectedThemes.length === 0) {
      alert('관심 테마를 1개 이상 선택해주세요.');
      return;
    }

    const isSocial =
      signupData.social_provider &&
      signupData.social_provider !== 'LOCAL';

    const uniqueRegions = [...new Set(selectedRegions || [])].filter(
      (code) => code && code !== 'ALL'
    );

    const uniqueThemes = [...new Set(selectedThemes || [])].filter(
      (code) => code
    );

    const finalData = {
      member_id: isSocial
        ? `${signupData.social_provider.toLowerCase()}${signupData.social_id}`
        : signupData.member_id,

      password: isSocial ? null : signupData.password,

      name: signupData.name,
      nickname: signupData.nickname,
      phone: signupData.phone,
      email: signupData.email,
      gender: signupData.gender,
      birthdate: signupData.birthdate,

      social_provider: signupData.social_provider || 'LOCAL',
      social_id: signupData.social_id || null,

      profile_image_url: signupData.profile_image_url || null,
      title_id: signupData.title_id ? String(signupData.title_id) : null,

      addr_sido: signupData.addr_sido || '',
      reside_area_code: signupData.reside_area_code || '',
      addr_sigungu: signupData.addr_sigungu || '',
      reside_sigungu_code: signupData.reside_sigungu_code || '',

      regions: uniqueRegions,
      themes: uniqueThemes,
    };

    try {
      setIsSubmitting(true);

      console.log('최종 회원가입 데이터:', finalData);

      const response = await signup(finalData);

      console.log('회원가입 응답:', response);

      if (response === 'success' || response?.success === true) {
        alert('회원가입이 완료되었습니다!');
        resetSignupData();
        navigate('/login');
      } else {
        alert(response?.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      console.error('서버 응답:', error.response?.data);

      alert(error.response?.data?.message || '서버 오류가 발생했습니다.');
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h3 className="text-[17px] sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={20} className="text-festival-purple shrink-0" />
              어디로 떠나고 싶으신가요?
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              복수 선택 가능
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleRegionToggle('ALL')}
              className={`min-w-[72px] h-11 px-4 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${selectedRegions.includes('ALL')
                ? 'bg-festival-purple border-festival-purple text-white shadow-md shadow-purple-100'
                : 'bg-white border-gray-100 text-gray-500 hover:border-festival-purple hover:text-festival-purple'
                }`}
            >
              전국
            </button>

            {sidoOptions.map((region) => {
              const regionCode = String(region.region_code);

              return (
                <button
                  key={regionCode}
                  type="button"
                  onClick={() => handleRegionToggle(regionCode)}
                  className={`min-w-[72px] h-11 px-4 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${selectedRegions.includes(regionCode)
                    ? 'bg-festival-purple border-festival-purple text-white shadow-md shadow-purple-100'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-festival-purple hover:text-festival-purple'
                    }`}
                >
                  {region.region_name}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h3 className="text-[17px] sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Heart size={20} className="text-red-400 shrink-0" />
              어떤 테마를 좋아하시나요?
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              복수 선택 가능
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {themeOptions.map((theme) => {
              const themeCode = String(theme.theme_code);

              return (
                <button
                  key={themeCode}
                  type="button"
                  onClick={() => handleThemeToggle(themeCode)}
                  className={`h-10 px-4 sm:px-5 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${selectedThemes.includes(themeCode)
                    ? 'bg-festival-yellow border-festival-yellow text-gray-900 shadow-md shadow-yellow-50'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-festival-yellow hover:text-gray-900'
                    }`}
                >
                  {theme.theme_name}
                </button>
              );
            })}
          </div>
        </section>

        <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full sm:flex-1 h-14 rounded-2xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} />
            이전으로
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-[2] h-14 rounded-2xl bg-festival-purple text-white font-bold shadow-lg shadow-purple-100 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? '가입 처리 중...' : '가입 완료하기'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPreferencesPage;