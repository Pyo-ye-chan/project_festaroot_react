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

import useMemberStore from '../../../store/useMemberStore';
import AuthLayout from '../components/AuthLayout';
import TermsModal from '../components/TermsModal';
import { getSidoList, getSigunguList } from '../../../api/regionApi';
import {
  sendVerificationCode,
  verifyEmailCode,
  checkIdDuplicate,
  checkNicknameDuplicate,
  checkEmailDuplicate,
} from '../../../api/memberApi';
import { getActiveTerms } from '../../../api/authApi';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useMemberStore();

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
    reside_area_code: '',
    reside_sigungu_code: '',

    agreeTerms: false,
    agreePrivacy: false,
    agreeLocation: false,
    ...signupData
  });

  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  const [isCheckingId, setIsCheckingId] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);
  const [isIdConfirmed, setIsIdConfirmed] = useState(false);
  const [idMessage, setIdMessage] = useState('');

  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [isNicknameConfirmed, setIsNicknameConfirmed] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');

  const [errors, setErrors] = useState({});
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [isSigunguLoading, setIsSigunguLoading] = useState(false);

  const [termsList, setTermsList] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState(null); // 약관 상태 관련 모달

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(formData.email || '');

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
    const loadTerms = async () => {
      try {
        const res = await getActiveTerms();

        console.log('약관 API 응답:', res);

        const data = res?.data ?? res;

        console.log('약관 data:', data);

        setTermsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('약관 조회 실패:', error);
      }
    };

    loadTerms();
  }, []);


  const closeTermsModal = () => {
    setSelectedTerms(null);
  };

  const getTermsByType = (type) => {
    return termsList.find((terms) => terms.terms_type === type);
  };

  const handleShowTerms = (id) => {
    const typeMap = {
      agreeTerms: 'TERMS',
      agreePrivacy: 'PRIVACY',
      agreeLocation: 'LOCATION'
    };

    console.log('termsList:', termsList);
    console.log('찾는 타입:', typeMap[id]);

    const term = termsList.find(
      item =>
        item.terms_type === typeMap[id] ||
        item.termsType === typeMap[id]
    );

    console.log('선택된 약관:', term);

    setSelectedTerms(term || null);
  };

  // 이전 단계나 store에 저장된 회원가입 데이터 복원
  useEffect(() => {
    if (signupData) {
      setFormData((prev) => ({
        ...prev,
        ...signupData
      }));
    }
  }, []);

  const passwordMatch =
    formData.confirmPassword === '' ||
    formData.password === formData.confirmPassword;

  // 백엔드 응답 키가 isAvailable / available / success 중 무엇이 와도 처리
  const isAvailableResponse = (data) => {
    return (
      data?.isAvailable === true ||
      data?.available === true ||
      data?.success === true
    );
  };

  // 이메일 인증번호 발송
  const handleSendVerificationCode = async () => {
    if (!isValidEmail) {
      setVerificationMessage('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setIsSendingCode(true);
    setVerificationMessage('');
    setEmailVerified(false);

    try {
      // 1. 이메일 중복 확인
      const emailCheck = await checkEmailDuplicate(formData.email);
      const emailData = emailCheck?.data ?? emailCheck;

      console.log(emailData);
      if (!isAvailableResponse(emailData)) {
        setVerificationMessage(
          emailData?.message || '이미 사용 중인 이메일입니다.'
        );
        return;
      }

      // 2. 인증번호 발송
      const response = await sendVerificationCode(formData.email);
      const data = response?.data ?? response;

      if (data.success) {
        setVerificationMessage(
          '인증번호가 발송되었습니다. 5분 이내로 입력해주세요.'
        );
        setCountdown(300);
      } else {
        setVerificationMessage(
          data?.message || '인증번호 발송 실패. 이메일을 확인해주세요.'
        );
      }
    } catch (error) {
      console.error('인증번호 발송 실패:', error);
      setVerificationMessage('인증번호 발송 중 오류가 발생했습니다.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyCode = async () => {
    if (!emailCode) {
      setVerificationMessage('인증번호를 입력해주세요.');
      return;
    }

    setIsVerifyingCode(true);
    setVerificationMessage('');

    try {
      const response = await verifyEmailCode(formData.email, emailCode);
      const data = response?.data ?? response;

      if (data.success) {
        setEmailVerified(true);
        setVerificationMessage('이메일 인증이 완료되었습니다.');
        setCountdown(0);
      } else {
        setEmailVerified(false);
        setVerificationMessage(data?.message || '인증번호가 일치하지 않습니다. 다시 입력해 주세요.');
      }
    } catch (error) {
      console.error('인증번호 확인 실패:', error);
      setVerificationMessage('인증번호 확인 중 오류가 발생했습니다.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // 아이디 중복 확인
  const handleCheckIdDuplicate = async () => {
    const idRegex = /^[a-zA-Z0-9]{6,20}$/;

    if (!formData.member_id || !idRegex.test(formData.member_id)) {
      setIsIdAvailable(false);
      setIsIdConfirmed(false);
      setIdMessage('아이디는 6~20자 영문, 숫자여야 합니다.');
      return;
    }

    setIsCheckingId(true);
    setIdMessage('');
    setIsIdAvailable(false);
    setIsIdConfirmed(false);

    try {
      const response = await checkIdDuplicate(formData.member_id);
      const data = response?.data ?? response;

      console.log('아이디 중복체크 응답:', data);

      if (isAvailableResponse(data)) {
        const confirmUse = window.confirm(
          `'${formData.member_id}' 아이디를 사용하시겠습니까?\n\n확인: 사용하기\n취소: 다시 입력하기`
        );

        if (confirmUse) {
          setIsIdAvailable(true);
          setIsIdConfirmed(true);
          setIdMessage('사용하기로 확정된 아이디입니다.');
          setErrors((prev) => ({ ...prev, member_id: '' }));
        } else {
          setIsIdAvailable(false);
          setIsIdConfirmed(false);
          setIdMessage('아이디를 다시 입력해주세요.');
        }
      } else {
        setIsIdAvailable(false);
        setIsIdConfirmed(false);
        setIdMessage(data?.message || '이미 사용 중인 아이디입니다.');
      }
    } catch (error) {
      console.error('아이디 중복 확인 실패:', error);
      setIsIdAvailable(false);
      setIsIdConfirmed(false);
      setIdMessage('아이디 중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingId(false);
    }
  };

  // 닉네임 중복 확인
  const handleCheckNicknameDuplicate = async () => {
    if (!formData.nickname) {
      setIsNicknameAvailable(false);
      setIsNicknameConfirmed(false);
      setNicknameMessage('닉네임을 입력해주세요.');
      return;
    }

    setIsCheckingNickname(true);
    setNicknameMessage('');
    setIsNicknameAvailable(false);
    setIsNicknameConfirmed(false);

    try {
      const response = await checkNicknameDuplicate(formData.nickname);
      const data = response?.data ?? response;

      console.log('닉네임 중복체크 응답:', data);

      if (isAvailableResponse(data)) {
        const confirmUse = window.confirm(
          `'${formData.nickname}' 닉네임을 사용하시겠습니까?\n\n확인: 사용하기\n취소: 다시 입력하기`
        );

        if (confirmUse) {
          setIsNicknameAvailable(true);
          setIsNicknameConfirmed(true);
          setNicknameMessage('사용하기로 확정된 닉네임입니다.');
          setErrors((prev) => ({ ...prev, nickname: '' }));
        } else {
          setIsNicknameAvailable(false);
          setIsNicknameConfirmed(false);
          setNicknameMessage('닉네임을 다시 입력해주세요.');
        }
      } else {
        setIsNicknameAvailable(false);
        setIsNicknameConfirmed(false);
        setNicknameMessage(data?.message || '이미 사용 중인 닉네임입니다.');
      }
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      setIsNicknameAvailable(false);
      setIsNicknameConfirmed(false);
      setNicknameMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 이메일 인증 카운트다운
  useEffect(() => {
    let timer;

    if (countdown > 0 && !emailVerified) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (
      countdown === 0 &&
      !emailVerified &&
      verificationMessage.includes('발송되었습니다')
    ) {
      setVerificationMessage('인증번호 유효 시간이 만료되었습니다. 다시 시도해주세요.');
    }

    return () => clearInterval(timer);
  }, [countdown, emailVerified, verificationMessage]);

  const validate = () => {
    const newErrors = {};
    const idRegex = /^[a-zA-Z0-9]{6,20}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    const phoneRegex = /^010-\d{4}-\d{4}$/;

    if (!idRegex.test(formData.member_id || '')) {
      newErrors.member_id = '아이디는 6~20자 영문, 숫자여야 합니다.';
    } else if (!isIdConfirmed) {
      newErrors.member_id = '아이디 중복 확인을 완료해주세요.';
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
    } else if (!emailVerified) {
      newErrors.email = '이메일 인증을 완료해주세요.';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (!isNicknameConfirmed) {
      newErrors.nickname = '닉네임 중복 확인을 완료해주세요.';
    }

    if (!formData.birthdate) {
      newErrors.birthdate = '생년월일을 선택해주세요.';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.';
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

  // 입력값 변경 시 관련 검증 상태 초기화
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'phone') {

      val = val.replace(/[^0-9]/g, '');

      if (val.length <= 3) {
        val = val;
      } else if (val.length <= 7) {
        val = `${val.slice(0, 3)}-${val.slice(3)}`;
      } else {
        val =
          `${val.slice(0, 3)}-` +
          `${val.slice(3, 7)}-` +
          `${val.slice(7, 11)}`;
      }
    }

    const newData = {
      ...formData,
      [name]: val,
      ...(name === 'addr_sido' ? { addr_sigungu: '' } : {})
    };

    setFormData(newData);
    setSignupData({ [name]: val });

    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'member_id') {
      setIsIdAvailable(false);
      setIsIdConfirmed(false);
      setIdMessage('');
    }

    if (name === 'nickname') {
      setIsNicknameAvailable(false);
      setIsNicknameConfirmed(false);
      setNicknameMessage('');
    }

    if (name === 'email') {
      setEmailVerified(false);
      setVerificationMessage('');
      setEmailCode('');
      setCountdown(0);
    }
  };

  const handleSidoChange = async (e) => {
    const regionCode = e.target.value;
    const selectedSido = sidoList.find((item) => item.region_code === regionCode);

    const update = {
      reside_area_code: regionCode,
      addr_sido: selectedSido?.region_name || '',
      reside_sigungu_code: '',
      addr_sigungu: ''
    };

    const newData = { ...formData, ...update };

    setFormData(newData);
    setSignupData(update);
    setSigunguList([]);

    if (!regionCode) return;

    try {
      setIsSigunguLoading(true);
      const res = await getSigunguList(regionCode);
      setSigunguList(res.data);
    } catch (error) {
      console.error('시/군/구 목록 조회 실패:', error);
      setSigunguList([]);
    } finally {
      setIsSigunguLoading(false);
    }
  };

  const handleSigunguChange = (e) => {
    const sigunguCode = e.target.value;
    const selectedSigungu = sigunguList.find(
      (item) => item.sigungu_code === sigunguCode
    );

    const update = {
      reside_sigungu_code: sigunguCode,
      addr_sigungu: selectedSigungu?.sigungu_name || ''
    };

    setFormData((prev) => ({ ...prev, ...update }));
    setSignupData(update);
  };

  const handleGenderChange = (gender) => {
    const update = { gender };

    setFormData((prev) => ({ ...prev, ...update }));
    setSignupData(update);
  };

  const handleAllAgreeChange = (e) => {
    const v = e.target.checked;

    const update = {
      agreeTerms: v,
      agreePrivacy: v,
      agreeLocation: v
    };

    setFormData((prev) => ({ ...prev, ...update }));
    setSignupData(update);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (!isIdConfirmed) {
      alert('아이디 중복 확인을 완료해주세요.');
      return;
    }

    if (!isNicknameConfirmed) {
      alert('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy || !formData.agreeLocation) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

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

  const allChecked = !!(
    formData.agreeTerms &&
    formData.agreePrivacy &&
    formData.agreeLocation
  );

  return (
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

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <InputIcon>
                    <User size={19} />
                  </InputIcon>

                  <input
                    type="text"
                    name="member_id"
                    value={formData.member_id || ''}
                    onChange={handleChange}
                    placeholder="아이디 입력"
                    className={`${inputClass} pl-11 ${isIdConfirmed ? 'border-green-500 bg-green-50' : ''
                      }`}
                    required
                    disabled={isCheckingId || isIdConfirmed}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCheckIdDuplicate}
                  disabled={
                    isCheckingId ||
                    isIdConfirmed ||
                    !formData.member_id ||
                    errors.member_id
                  }
                  className={`w-[120px] h-[56px] rounded-2xl text-[14px] font-bold transition-all whitespace-nowrap ${isCheckingId ||
                    isIdConfirmed ||
                    !formData.member_id ||
                    errors.member_id
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-festival-purple text-white hover:bg-[#4c1d95] shadow-[0_10px_24px_rgba(91,33,182,0.18)]'
                    }`}
                >
                  {isCheckingId
                    ? '확인 중...'
                    : isIdConfirmed
                      ? '확정완료'
                      : '중복확인'}
                </button>
              </div>

              <ErrorText message={errors.member_id} />

              {idMessage && (
                <p
                  className={`text-sm mt-2 ml-2 ${isIdConfirmed ? 'text-green-600' : 'text-red-500'
                    }`}
                >
                  {idMessage}
                </p>
              )}
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
                  className={`${inputClass} pl-11 ${!passwordMatch && formData.confirmPassword
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

              <div className="flex gap-2">
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname || ''}
                  onChange={handleChange}
                  placeholder="닉네임"
                  className={`${inputClass} px-5 flex-1 ${isNicknameConfirmed ? 'border-green-500 bg-green-50' : ''
                    }`}
                  required
                  disabled={isCheckingNickname || isNicknameConfirmed}
                />

                <button
                  type="button"
                  onClick={handleCheckNicknameDuplicate}
                  disabled={
                    isCheckingNickname ||
                    isNicknameConfirmed ||
                    !formData.nickname ||
                    errors.nickname
                  }
                  className={`w-[120px] h-[56px] rounded-2xl text-[14px] font-bold transition-all whitespace-nowrap ${isCheckingNickname ||
                    isNicknameConfirmed ||
                    !formData.nickname ||
                    errors.nickname
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-festival-purple text-white hover:bg-[#4c1d95] shadow-[0_10px_24px_rgba(91,33,182,0.18)]'
                    }`}
                >
                  {isCheckingNickname
                    ? '확인 중...'
                    : isNicknameConfirmed
                      ? '확정완료'
                      : '중복확인'}
                </button>
              </div>

              <ErrorText message={errors.nickname} />

              {nicknameMessage && (
                <p
                  className={`text-sm mt-2 ml-2 ${isNicknameConfirmed ? 'text-green-600' : 'text-red-500'
                    }`}
                >
                  {nicknameMessage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                이메일
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <InputIcon>
                    <Mail size={19} />
                  </InputIcon>

                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={`${inputClass} pl-11 ${emailVerified ? 'border-green-500 bg-green-50' : ''
                      }`}
                    required
                    disabled={emailVerified || isSendingCode}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={isSendingCode || emailVerified || !isValidEmail}
                  className={`w-[120px] h-[56px] rounded-2xl text-[14px] font-bold transition-all whitespace-nowrap ${isSendingCode || emailVerified || !isValidEmail
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-festival-purple text-white hover:bg-[#4c1d95] shadow-[0_10px_24px_rgba(91,33,182,0.18)]'
                    }`}
                >
                  {isSendingCode ? '전송 중...' : '인증번호 발송'}
                </button>
              </div>

              <ErrorText message={errors.email} />

              {verificationMessage && (emailVerified || countdown === 0) && (
                <p
                  className={`text-sm mt-2 ml-2 ${emailVerified ? 'text-green-600' : 'text-red-500'
                    }`}
                >
                  {verificationMessage}
                </p>
              )}

              {countdown > 0 && (
                <p className="text-sm text-gray-600 mt-2 ml-2">
                  남은 시간:{' '}
                  {Math.floor(countdown / 60).toString().padStart(2, '0')}:
                  {(countdown % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>

            {countdown > 0 && !emailVerified && (
              <div>
                <label className="block text-[14px] font-[700] text-[#444] mb-2 ml-1">
                  인증번호
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <InputIcon>
                      <Mail size={19} />
                    </InputIcon>

                    <input
                      type="text"
                      name="emailCode"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      placeholder="인증번호 6자리 입력"
                      className={`${inputClass} pl-11`}
                      required
                      disabled={isVerifyingCode}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isVerifyingCode || !emailCode}
                    className={`w-[120px] h-[56px] rounded-2xl text-[14px] font-bold transition-all whitespace-nowrap ${isVerifyingCode || !emailCode
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-festival-purple text-white hover:bg-[#4c1d95] shadow-[0_10px_24px_rgba(91,33,182,0.18)]'
                      }`}
                  >
                    {isVerifyingCode ? '확인 중...' : '인증확인'}
                  </button>
                </div>

                {verificationMessage && (
                  <p
                    className={`text-sm mt-2 ml-2 ${emailVerified ? 'text-green-600' : 'text-red-500'
                      }`}
                  >
                    {verificationMessage}
                  </p>
                )}
              </div>
            )}

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
                  maxLength={13}
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
                    className={`flex-1 rounded-xl text-[14px] font-bold transition-all ${formData.gender === 'M'
                      ? 'bg-white text-festival-purple shadow-md'
                      : 'text-gray-400'
                      }`}
                  >
                    남성
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenderChange('F')}
                    className={`flex-1 rounded-xl text-[14px] font-bold transition-all ${formData.gender === 'F'
                      ? 'bg-white text-festival-purple shadow-md'
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
                  className={`${inputClass} px-5 bg-white appearance-none ${!formData.reside_area_code
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
          <label
            className="flex items-center gap-3 cursor-pointer mb-6"
            htmlFor="agreeAll"
          >
            <input
              id="agreeAll"
              type="checkbox"
              className="sr-only"
              checked={allChecked}
              onChange={handleAllAgreeChange}
            />

            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${allChecked
                ? 'bg-festival-purple border-festival-purple shadow-lg shadow-purple-200'
                : 'bg-white border-gray-300'
                }`}
            >
              <Check
                size={16}
                className={`text-white transition-opacity duration-200 ${allChecked ? 'opacity-100' : 'opacity-0'
                  }`}
              />
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
            ].map((item) => {
              const isChecked = !!formData[item.id];

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <label
                    className="flex items-center gap-3 cursor-pointer group"
                    htmlFor={item.id}
                  >
                    <input
                      id={item.id}
                      type="checkbox"
                      name={item.id}
                      className="sr-only"
                      checked={isChecked}
                      onChange={handleChange}
                    />

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isChecked
                        ? 'bg-festival-purple border-festival-purple'
                        : 'bg-white border-gray-300 group-hover:border-festival-purple'
                        }`}
                    >
                      <Check
                        size={14}
                        className={`text-white transition-opacity duration-200 ${isChecked ? 'opacity-100' : 'opacity-0'
                          }`}
                      />
                    </div>

                    <span className="text-sm text-gray-600 font-bold group-hover:text-gray-900 transition-colors">
                      {item.label}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleShowTerms(item.id)}
                    className="text-xs text-gray-400 font-bold hover:text-festival-purple underline underline-offset-4"
                  >
                    보기
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <TermsModal
          isOpen={!!selectedTerms}
          terms={selectedTerms}
          onClose={() => setSelectedTerms(null)}
        />

        <div className="pt-4 sm:pt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex-1 sm:flex-none sm:w-[140px] h-[52px] sm:h-[56px] rounded-2xl border border-[#e5e7eb] bg-white text-[#666] text-[14px] sm:text-[15px] font-[700] transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
          >
            취소
          </button>

          <button
            type="submit"
            className="flex-[1.5] h-[52px] sm:h-[56px] rounded-2xl bg-[#5b21b6] text-white text-[14px] sm:text-[16px] font-[800] shadow-[0_10px_24px_rgba(91,33,182,0.18)] transition-all hover:bg-[#4c1d95] active:scale-[0.98] flex items-center justify-center gap-2 whitespace-nowrap"
          >
            다음 단계로 진행
            <ChevronRight size={20} />
          </button>
        </div>
      </form>
    </AuthLayout>


  );
};

export default SignupPage;