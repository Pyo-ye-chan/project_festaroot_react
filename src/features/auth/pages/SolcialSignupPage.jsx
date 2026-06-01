import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Check,
  ChevronRight,
  Phone,
  Info,
  Mail,
  User
} from 'lucide-react';

import useMemberStore from '../../../store/useMemberStore';
import AuthLayout from '../components/AuthLayout';
import { getSidoList, getSigunguList } from '../../../api/regionApi';

const SocialSignupPage = () => {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useMemberStore();

  const [formData, setFormData] = useState({
    social_provider: signupData.social_provider || '',
    social_id: signupData.social_id || '',

    name: signupData.name || '',
    nickname: signupData.nickname || '',
    email: signupData.email || '',
    phone: signupData.phone || '',
    gender: signupData.gender || '',
    birthdate: signupData.birthdate || '',

    addr_sido: signupData.addr_sido || '',
    addr_sigungu: signupData.addr_sigungu || '',
    reside_area_code: signupData.reside_area_code || '',
    reside_sigungu_code: signupData.reside_sigungu_code || '',

    agreeTerms: signupData.agreeTerms || false,
    agreePrivacy: signupData.agreePrivacy || false,
    agreeLocation: signupData.agreeLocation || false,

    profile_image_url: signupData.profile_image_url || ''
  });

  const [errors, setErrors] = useState({});
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [isSigunguLoading, setIsSigunguLoading] = useState(false);

  useEffect(() => {
    const fetchSidoList = async () => {
      try {
        const res = await getSidoList();
        setSidoList(res.data);
      } catch (error) {
        console.error('시/도 목록 조회 실패:', error);
      }
    };

    fetchSidoList();
  }, []);

  useEffect(() => {
    const fetchSigunguList = async () => {
      if (!formData.reside_area_code) return;

      try {
        setIsSigunguLoading(true);
        const res = await getSigunguList(formData.reside_area_code);
        setSigunguList(res.data);
      } catch (error) {
        console.error('시/군/구 목록 조회 실패:', error);
        setSigunguList([]);
      } finally {
        setIsSigunguLoading(false);
      }
    };

    fetchSigunguList();
  }, [formData.reside_area_code]);

  const validate = () => {
    const newErrors = {};

    const phoneRegex = /^010-\d{4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.social_provider) {
      newErrors.social_provider = '소셜 로그인 정보가 없습니다.';
    }

    if (!formData.social_id) {
      newErrors.social_id = '소셜 사용자 정보가 없습니다.';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    }

    if (!emailRegex.test(formData.email || '')) {
      newErrors.email = '이메일 형식이 올바르지 않습니다.';
    }

    if (!phoneRegex.test(formData.phone || '')) {
      newErrors.phone = '전화번호 형식이 올바르지 않습니다. 예: 010-0000-0000';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.';
    }

    if (!formData.birthdate) {
      newErrors.birthdate = '생년월일을 선택해주세요.';
    }

    if (!formData.reside_area_code) {
      newErrors.addr_sido = '시/도를 선택해주세요.';
    }

    if (!formData.reside_sigungu_code) {
      newErrors.addr_sigungu = '시/군/구를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveFormData = (newData) => {
    setFormData(newData);
    setSignupData(newData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    saveFormData(newData);
  };

  const handleSidoChange = (e) => {
    const regionCode = e.target.value;

    const selectedSido = sidoList.find(
      (item) => item.region_code === regionCode
    );

    const newData = {
      ...formData,
      reside_area_code: regionCode,
      addr_sido: selectedSido?.region_name || '',
      reside_sigungu_code: '',
      addr_sigungu: ''
    };

    setSigunguList([]);
    saveFormData(newData);
  };

  const handleSigunguChange = (e) => {
    const sigunguCode = e.target.value;

    const selectedSigungu = sigunguList.find(
      (item) => item.sigungu_code === sigunguCode
    );

    const newData = {
      ...formData,
      reside_sigungu_code: sigunguCode,
      addr_sigungu: selectedSigungu?.sigungu_name || ''
    };

    saveFormData(newData);
  };

  const handleGenderChange = (gender) => {
    const newData = {
      ...formData,
      gender
    };

    saveFormData(newData);
  };

  const handleAllAgreeChange = (e) => {
    const checked = e.target.checked;

    const newData = {
      ...formData,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeLocation: checked
    };

    saveFormData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (
      !formData.agreeTerms ||
      !formData.agreePrivacy ||
      !formData.agreeLocation
    ) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    setSignupData({
      ...signupData,

      social_provider: formData.social_provider,
      social_id: formData.social_id,

      name: formData.name,
      nickname: formData.nickname,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      birthdate: formData.birthdate,

      addr_sido: formData.addr_sido,
      addr_sigungu: formData.addr_sigungu,
      reside_area_code: formData.reside_area_code,
      reside_sigungu_code: formData.reside_sigungu_code,

      agreeTerms: formData.agreeTerms,
      agreePrivacy: formData.agreePrivacy,
      agreeLocation: formData.agreeLocation,

      profile_image_url: formData.profile_image_url || ''
    });

    navigate('/signup/preferences');
  };

  const InputIcon = ({ children }) => (
    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#9ca3af]">
      {children}
    </span>
  );

  const SectionTitle = ({ children }) => (
    <h3 className="text-[17px] font-[800] tracking-[-0.03em] text-[#22114f] mb-4 mt-10 first:mt-0 flex items-center gap-2">
      <span className="w-1.5 h-5 rounded-full bg-festival-purple shadow-[0_0_8px_rgba(91,33,182,0.3)]" />
      {children}
    </h3>
  );

  const ErrorText = ({ message }) => {
    if (!message) return null;

    return (
      <p className="text-xs text-red-500 mt-2 ml-2 flex items-center gap-1 font-bold">
        <Info size={13} />
        {message}
      </p>
    );
  };

  const inputClass = `
    w-full h-[56px] rounded-2xl border border-[#e7e2f7] bg-white
    text-[15px] font-[500] text-[#111] placeholder:text-[#b8b2c7]
    outline-none transition-all focus:border-festival-purple focus:ring-4 focus:ring-[#f5f0ff]
  `;

  return (
    <AuthLayout
      title="소셜 간편가입"
      subtitle="추가 정보를 입력하고 축제로를 시작하세요"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-[#faf7ff] border border-[#e7e2f7] rounded-[28px] p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <User size={20} className="text-festival-purple" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#5b21b6]">
                {formData.social_provider || 'SOCIAL'} 계정으로 가입 중
              </p>
              <p className="text-xs text-gray-500 mt-1">
                소셜 인증은 완료되었습니다. 서비스 이용을 위한 추가 정보만 입력해주세요.
              </p>
            </div>
          </div>

          <ErrorText message={errors.social_provider} />
          <ErrorText message={errors.social_id} />
        </section>

        <section>
          <SectionTitle>개인 정보</SectionTitle>

          <div className="space-y-5">
            <div>
              <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                이름
              </label>

              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="실명 입력"
                className={`${inputClass} px-5`}
                required
              />

              <ErrorText message={errors.name} />
            </div>

            <div>
              <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                닉네임
              </label>

              <input
                type="text"
                name="nickname"
                value={formData.nickname || ''}
                onChange={handleChange}
                placeholder="닉네임"
                className={`${inputClass} px-5`}
                required
              />

              <ErrorText message={errors.nickname} />
            </div>

            <div>
              <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                이메일
              </label>

              <div className="relative">
                <InputIcon>
                  <Mail size={19} />
                </InputIcon>

                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>

              <ErrorText message={errors.email} />
            </div>

            <div>
              <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                연락처
              </label>

              <div className="relative">
                <InputIcon>
                  <Phone size={19} />
                </InputIcon>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>

              <ErrorText message={errors.phone} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                  성별
                </label>

                <div className="h-[56px] bg-[#f8f9ff] border border-[#e7e2f7] p-1.5 rounded-2xl flex">
                  <button
                    type="button"
                    onClick={() => handleGenderChange('M')}
                    className={`flex-1 rounded-xl text-[14px] font-bold transition-all ${
                      formData.gender === 'M'
                        ? 'bg-white text-festival-purple shadow-md shadow-purple-50'
                        : 'text-gray-400'
                    }`}
                  >
                    남성
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenderChange('F')}
                    className={`flex-1 rounded-xl text-[14px] font-bold transition-all ${
                      formData.gender === 'F'
                        ? 'bg-white text-festival-purple shadow-md shadow-purple-50'
                        : 'text-gray-400'
                    }`}
                  >
                    여성
                  </button>
                </div>

                <ErrorText message={errors.gender} />
              </div>

              <div>
                <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                  생년월일
                </label>

                <div className="relative">
                  <InputIcon>
                    <Calendar size={19} />
                  </InputIcon>

                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate || ''}
                    onChange={handleChange}
                    className={`${inputClass} pl-11 pr-4`}
                    required
                  />
                </div>

                <ErrorText message={errors.birthdate} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1 flex items-center gap-1">
                  <MapPin size={14} />
                  시/도
                </label>

                <select
                  name="reside_area_code"
                  value={formData.reside_area_code || ''}
                  onChange={handleSidoChange}
                  className={`${inputClass} px-5 bg-white appearance-none`}
                  required
                >
                  <option value="">시/도 선택</option>
                  {sidoList.map((sido) => (
                    <option key={sido.region_code} value={sido.region_code}>
                      {sido.region_name}
                    </option>
                  ))}
                </select>

                <ErrorText message={errors.addr_sido} />
              </div>

              <div>
                <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1 flex items-center gap-1">
                  <MapPin size={14} />
                  시/군/구
                </label>

                <select
                  name="reside_sigungu_code"
                  value={formData.reside_sigungu_code || ''}
                  onChange={handleSigunguChange}
                  className={`${inputClass} px-5 bg-white appearance-none ${
                    !formData.reside_area_code
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      : ''
                  }`}
                  required
                  disabled={!formData.reside_area_code || isSigunguLoading}
                >
                  <option value="">
                    {isSigunguLoading ? '로딩 중...' : '시/군/구 선택'}
                  </option>

                  {sigunguList.map((sigungu) => (
                    <option
                      key={sigungu.sigungu_code}
                      value={sigungu.sigungu_code}
                    >
                      {sigungu.sigungu_name}
                    </option>
                  ))}
                </select>

                <ErrorText message={errors.addr_sigungu} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 rounded-[32px] p-7 border border-[#eee]">
          <label className="flex items-center gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              className="hidden"
              checked={
                !!formData.agreeTerms &&
                !!formData.agreePrivacy &&
                !!formData.agreeLocation
              }
              onChange={handleAllAgreeChange}
            />

            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                formData.agreeTerms &&
                formData.agreePrivacy &&
                formData.agreeLocation
                  ? 'bg-festival-purple border-festival-purple shadow-lg shadow-purple-100'
                  : 'bg-white border-gray-300'
              }`}
            >
              <Check size={16} className="text-white" />
            </div>

            <span className="text-[16px] font-black text-gray-800">
              모든 약관에 동의합니다.
            </span>
          </label>

          <div className="space-y-4 ml-1">
            {[
              { id: 'agreeTerms', label: '서비스 이용약관 동의 (필수)' },
              { id: 'agreePrivacy', label: '개인정보 처리방침 동의 (필수)' },
              { id: 'agreeLocation', label: '위치정보 이용 동의 (필수)' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name={item.id}
                    className="hidden"
                    checked={!!formData[item.id]}
                    onChange={handleChange}
                  />

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      formData[item.id]
                        ? 'bg-festival-purple border-festival-purple'
                        : 'bg-white border-gray-300 group-hover:border-festival-purple'
                    }`}
                  >
                    <Check size={14} className="text-white" />
                  </div>

                  <span className="text-sm text-gray-600 font-bold group-hover:text-gray-900 transition-colors">
                    {item.label}
                  </span>
                </label>

                <button
                  type="button"
                  className="text-xs text-gray-400 font-bold hover:text-festival-purple underline underline-offset-4"
                >
                  보기
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4 sm:pt-6 flex gap-3">

          {/* Cancel */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="
      flex-1 sm:flex-none
      sm:w-[140px]
      h-[52px] sm:h-[56px]
      rounded-2xl
      border border-[#e5e7eb]
      bg-white
      text-[#666]
      text-[14px] sm:text-[15px]
      font-[700]
      transition-all
      hover:bg-gray-50
      hover:border-gray-300
      active:scale-[0.98]
      flex items-center justify-center gap-1.5 sm:gap-2
      whitespace-nowrap
    "
          >
            취소
          </button>

          {/* Next */}
          <button
            type="submit"
            className="
      flex-[1.5]
      h-[52px] sm:h-[56px]
      rounded-2xl
      bg-[#5b21b6]
      text-white
      text-[14px] sm:text-[16px]
      font-[800]
      shadow-[0_10px_24px_rgba(91,33,182,0.18)]
      transition-all
      hover:bg-[#4c1d95]
      active:scale-[0.98]
      flex items-center justify-center gap-2
      whitespace-nowrap
    "
          >
            다음 단계로 진행
            <ChevronRight size={20} />
          </button>

        </div>
      </form>
    </AuthLayout>
  );
};

export default SocialSignupPage;