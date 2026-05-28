import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Calendar,
  MapPin,
  Check,
  ChevronRight,
  Phone,
  Info,
  Mail
} from 'lucide-react';

import useAuthStore from '../../../store/useAuthStore';
import AuthLayout from '../components/AuthLayout';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';  

const SignupPage = () => {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useAuthStore();

  const [formData, setFormData] = useState({
    member_id: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
    nickname: '',
    gender: '',
    birthdate: '',
    email: '',
    addr_sido: '',
    addr_sigungu: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeLocation: false,
    ...signupData
  });

  const [errors, setErrors] = useState({});

  const passwordMatch =
    formData.confirmPassword === '' ||
    formData.password === formData.confirmPassword;

  const cities = {
    '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '인천광역시': ['계양구', '미추홀구', '남동구', '동구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군'],
    '경기도': ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '남양주시', '안양시', '화성시', '평택시', '시흥시', '파주시', '의정부시', '김포시', '광주시', '광명시', '군포시', '하남시', '오산시', '양주시', '이천시', '구리시', '안성시', '포천시', '의왕시', '양평군', '여주시', '동두천시', '가평군', '과천시', '연천군'],
    '강원특별자치도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
    '충청북도': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
    '충청남도': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
    '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
    '세종특별자치시': ['세종시'],
    '전라북도': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
    '전라남도': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
    '광주광역시': ['광산구', '동구', '서구', '남구', '북구'],
    '경상북도': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
    '경상남도': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
    '대구광역시': ['남구', '달서구', '동구', '북구', '서구', '수성구', '중구', '달성군'],
    '울산광역시': ['남구', '동구', '북구', '중구', '울주군'],
    '부산광역시': ['강서구', '금정구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구', '기장군'],
    '제주특별자치도': ['제주시', '서귀포시']
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...signupData
    }));
  }, [signupData]);

  const validate = () => {
    const newErrors = {};

    const idRegex = /^[a-zA-Z0-9]{6,20}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!idRegex.test(formData.member_id || '')) {
      newErrors.member_id = '아이디는 6~20자 영문, 숫자여야 합니다.';
    }

    if (!passwordRegex.test(formData.password || '')) {
      newErrors.password = '비밀번호는 8자 이상 영문/숫자 혼합이어야 합니다.';
    }

    if ((formData.password || '') !== (formData.confirmPassword || '')) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!phoneRegex.test(formData.phone || '')) {
      newErrors.phone = '전화번호 형식이 올바르지 않습니다. 예: 010-0000-0000';
    }

    if (!emailRegex.test(formData.email || '')) {
      newErrors.email = '이메일 형식이 올바르지 않습니다.';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    }

    if (!formData.birthdate) {
      newErrors.birthdate = '생년월일을 선택해주세요.';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.';
    }

    if (!formData.addr_sido) {
      newErrors.addr_sido = '시/도를 선택해주세요.';
    }

    if (!formData.addr_sigungu) {
      newErrors.addr_sigungu = '시/군/구를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'addr_sido' ? { addr_sigungu: '' } : {})
    };

    setFormData(newData);
    setSignupData(newData);
  };

  const handleGenderChange = (gender) => {
    const newData = {
      ...formData,
      gender
    };

    setFormData(newData);
    setSignupData(newData);
  };

  const handleAllAgreeChange = (e) => {
    const v = e.target.checked;

    const newData = {
      ...formData,
      agreeTerms: v,
      agreePrivacy: v,
      agreeLocation: v
    };

    setFormData(newData);
    setSignupData(newData);
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

    setSignupData(formData);
    console.log('Signup step 1 complete:', formData);

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

    <>
    <Header />
    <main>
    <AuthLayout
      title="회원가입"
      subtitle="축제로와 함께 설레는 여행을 시작하세요"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <SectionTitle>계정 정보</SectionTitle>

          <div className="space-y-5">
            <div>
              <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                아이디
              </label>

              <div className="relative">
                <InputIcon>
                  <User size={19} />
                </InputIcon>

                <input
                  type="text"
                  name="member_id"
                  value={formData.member_id || ''}
                  onChange={handleChange}
                  placeholder="아이디 입력"
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>

              <ErrorText message={errors.member_id} />
            </div>

            <div>
              <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                비밀번호
              </label>

              <div className="relative">
                <InputIcon>
                  <Lock size={19} />
                </InputIcon>

                <input
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  placeholder="8자 이상 영문/숫자 혼합"
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>

              <ErrorText message={errors.password} />
            </div>

            <div>
              <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                비밀번호 확인
              </label>

              <div className="relative">
                <InputIcon>
                  <Check size={19} />
                </InputIcon>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword || ''}
                  onChange={handleChange}
                  placeholder="비밀번호 다시 입력"
                  className={`${inputClass} pl-11 ${
                    !passwordMatch && formData.confirmPassword
                      ? 'border-red-400 focus:ring-red-50'
                      : ''
                  }`}
                  required
                />
              </div>

              {!passwordMatch && formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-2 ml-2 flex items-center gap-1 font-bold">
                  <Info size={13} />
                  비밀번호가 일치하지 않습니다.
                </p>
              )}

              <ErrorText message={errors.confirmPassword} />
            </div>
          </div>
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
                  name="addr_sido"
                  value={formData.addr_sido || ''}
                  onChange={handleChange}
                  className={`${inputClass} px-5 bg-white appearance-none`}
                  required
                >
                  <option value="">시/도 선택</option>
                  {Object.keys(cities).map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                  name="addr_sigungu"
                  value={formData.addr_sigungu || ''}
                  onChange={handleChange}
                  className={`${inputClass} px-5 bg-white appearance-none ${
                    !formData.addr_sido
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      : ''
                  }`}
                  required
                  disabled={!formData.addr_sido}
                >
                  <option value="">시/군/구 선택</option>
                  {(cities[formData.addr_sido] || []).map((d) => (
                    <option key={d} value={d}>
                      {d}
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

        <button
          type="submit"
          className="w-full h-[64px] bg-festival-purple text-white font-[900] text-lg rounded-2xl shadow-xl shadow-purple-100 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          다음 단계로 진행
          <ChevronRight size={22} />
        </button>
      </form>
    </AuthLayout>
    </main>
    <Footer />
    </> 
  );
};

export default SignupPage;