import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  updateMemberProfile, 
  sendVerificationCode, 
  verifyEmailCode,
  checkEmailDuplicate,
  updatePassword,
  deleteMember
} from '../../../api/memberApi';
import { getSidoList, getSigunguList } from '../../../api/regionApi';
import useAuthStore from '../../../store/useAuthStore';

const MyAccountSettingsTab = ({ userDetails, onRefresh }) => {
  if (!userDetails) return null;
  const { member } = userDetails;
  const { updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  // 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);

  // 비밀번호 변경 상태
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // 계정 삭제 상태
  const [isDeleting, setIsDeleting] = useState(false);

  // 기본 정보 수정 상태
  const [phone, setPhone] = useState(member.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  // 거주지(지역) 관련 상태
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [selectedSido, setSelectedSido] = useState(member.reside_area_code || '');
  const [selectedSigungu, setSelectedSigungu] = useState(member.reside_sigungu_code || '');
  const [isSigunguLoading, setIsSigunguLoading] = useState(false);

  // 이메일 변경 관련 상태
  const [isEmailChanging, setIsEmailChanging] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 초기 시/도 목록 로드
  useEffect(() => {
    const fetchSido = async () => {
      try {
        const res = await getSidoList();
        setSidoList(res.data || []);
      } catch (error) {
        console.error('시/도 목록 로드 실패:', error);
      }
    };
    fetchSido();
  }, []);

  // 시/도가 선택되어 있을 경우 시/군/구 목록 로드
  useEffect(() => {
    const fetchSigungu = async () => {
      if (!selectedSido) {
        setSigunguList([]);
        return;
      }
      setIsSigunguLoading(true);
      try {
        const res = await getSigunguList(selectedSido);
        setSigunguList(res.data || []);
      } catch (error) {
        console.error('시/군/구 목록 로드 실패:', error);
        setSigunguList([]);
      } finally {
        setIsSigunguLoading(false);
      }
    };
    fetchSigungu();
  }, [selectedSido]);

  // 수정 취소 시 상태 초기화
  const handleCancel = () => {
    setIsEditing(false);
    setPhone(member.phone || '');
    setSelectedSido(member.reside_area_code || '');
    setSelectedSigungu(member.reside_sigungu_code || '');
    resetEmailChange();
  };

  // 이메일 변경 프로세스 리셋
  const resetEmailChange = () => {
    setIsEmailChanging(false);
    setNewEmail('');
    setVerificationCode('');
    setIsCodeSent(false);
    setIsEmailVerified(false);
  };

  // 백엔드 응답 키가 isAvailable / available / success 중 무엇이 와도 처리
  const isAvailableResponse = (data) => {
    return (
      data?.isAvailable === true ||
      data?.available === true ||
      data?.success === true
    );
  };

  // 1단계: 인증번호 발송
  const handleSendCode = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast.warn('유효한 이메일을 입력해 주세요.');
      return;
    }

    try {
      setIsVerifying(true);
      
      // 1. 이메일 중복 확인
      const emailCheck = await checkEmailDuplicate(newEmail);
      const emailData = emailCheck?.data ?? emailCheck;

      if (!isAvailableResponse(emailData)) {
        toast.error(emailData?.message || '이미 사용 중인 이메일입니다.');
        return;
      }

      // 2. 인증번호 발송
      const response = await sendVerificationCode(newEmail);
      const data = response?.data ?? response;

      if (data.success || data.isSuccess || data.status === 'success') {
        setIsCodeSent(true);
        toast.success('인증번호가 발송되었습니다.');
      } else {
        toast.error(data?.message || '인증번호 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('인증번호 발송 실패:', error);
      toast.error('인증번호 발송 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 2단계: 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.warn('인증번호를 입력해 주세요.');
      return;
    }

    try {
      setIsVerifying(true);
      await verifyEmailCode(newEmail, verificationCode);
      setIsEmailVerified(true);
      toast.success('이메일 인증이 완료되었습니다.');
    } catch (error) {
      console.error('인증 확인 실패:', error);
      toast.error('인증번호가 일치하지 않거나 만료되었습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 개인정보 저장
  const handleSaveInfo = async () => {
    setIsSaving(true);
    try {
      const updateData = new FormData();
      updateData.append('phone', phone);
      updateData.append('reside_area_code', selectedSido);
      updateData.append('reside_sigungu_code', selectedSigungu);
      
      // 거주지 텍스트 추가
      const selectedSidoObj = sidoList.find(s => String(s.region_code) === String(selectedSido));
      const selectedSigunguObj = sigunguList.find(s => String(s.sigungu_code) === String(selectedSigungu));
      
      if (selectedSidoObj) {
        updateData.append('addr_sido', selectedSidoObj.region_name);
      }
      if (selectedSigunguObj) {
        updateData.append('addr_sigungu', selectedSigunguObj.sigungu_name);
      }

      // 이름, 닉네임 등 기존 필드 유지
      updateData.append('nickname', member.nickname);

      if (isEmailVerified) {
        updateData.append('email', newEmail);
      }

      await updateMemberProfile(member.member_id, updateData);
      
      // 전역 상태(useAuthStore) 업데이트
      const updatedInfo = {
        phone: phone,
        reside_area_code: selectedSido,
        reside_sigungu_code: selectedSigungu,
        addr_sido: selectedSidoObj?.region_name || member.addr_sido,
        addr_sigungu: selectedSigunguObj?.sigungu_name || member.addr_sigungu
      };
      
      if (isEmailVerified) {
        updatedInfo.email = newEmail;
      }
      
      updateUser(updatedInfo);
      
      toast.success('정보가 성공적으로 저장되었습니다.');
      
      setIsEditing(false);
      if (onRefresh) onRefresh();
      resetEmailChange();
    } catch (error) {
      console.error('정보 저장 실패:', error);
      toast.error('정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 비밀번호 변경 취소
  const handlePasswordCancel = () => {
    setIsPasswordEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  // 비밀번호 변경 저장
  const handlePasswordUpdate = async () => {
    if (!currentPassword) {
      toast.warn('현재 비밀번호를 입력해 주세요.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.warn('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsPasswordSaving(true);
    try {
      await updatePassword({
        member_id: member.member_id,
        current_password: currentPassword,
        new_password: newPassword
      });
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      handlePasswordCancel();
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      const errorMsg = error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.';
      toast.error(errorMsg);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // 회원 탈퇴 처리
  const handleAccountDeletion = async () => {
    const confirmDelete = window.confirm(
      '정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.'
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteMember(member.member_id);
      toast.success('회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.');
      logout();
      navigate('/');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      toast.error('회원 탈퇴 처리 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <header className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">계정 설정</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">개인 정보와 계정 보안 설정을 관리하세요.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <span className="text-xl">👤</span> 개인정보 수정
            </h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs font-black text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-xl transition-all"
              >
                정보 수정하기
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이름 (읽기 전용) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">이름</label>
              <input 
                type="text" 
                value={member.name || '미등록'}
                disabled
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
              />
            </div>

            {/* 생년월일 (읽기 전용) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">생년월일</label>
              <input 
                type="text" 
                value={member.birthdate || '미등록'}
                disabled
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
              />
            </div>

            {/* 연락처 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">연락처</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder="010-0000-0000"
                className={`w-full border-none rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${
                  isEditing ? 'bg-white ring-2 ring-purple-100 text-gray-700' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="hidden md:block" />

            {/* 거주지 설정 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">거주지 (시/도)</label>
              <select
                value={selectedSido}
                disabled={!isEditing}
                onChange={(e) => {
                  setSelectedSido(e.target.value);
                  setSelectedSigungu('');
                }}
                className={`w-full border-none rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all appearance-none ${
                  isEditing ? 'bg-white ring-2 ring-purple-50 text-gray-700' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <option value="">시/도 선택</option>
                {sidoList.map((sido) => (
                  <option key={sido.region_code} value={sido.region_code}>
                    {sido.region_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">거주지 (시/군/구)</label>
              <select
                value={selectedSigungu}
                onChange={(e) => setSelectedSigungu(e.target.value)}
                disabled={!isEditing || !selectedSido || isSigunguLoading}
                className={`w-full border-none rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all appearance-none ${
                  isEditing && selectedSido ? 'bg-white ring-2 ring-purple-50 text-gray-700' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <option value="">{isSigunguLoading ? '로딩 중...' : '시/군/구 선택'}</option>
                {sigunguList.map((sigungu) => (
                  <option key={sigungu.sigungu_code} value={sigungu.sigungu_code}>
                    {sigungu.sigungu_name}
                  </option>
                ))}
              </select>
            </div>

            {/* 이메일 주소 */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">이메일 주소</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  value={isEmailChanging ? newEmail : member.email}
                  disabled={!isEmailChanging || isEmailVerified}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={`flex-grow border-none rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${
                    isEmailChanging && !isEmailVerified ? 'bg-white ring-2 ring-purple-100 text-gray-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                />
                {isEditing && !isEmailChanging && (
                  <button 
                    onClick={() => setIsEmailChanging(true)}
                    className="px-6 py-3.5 bg-gray-900 text-white text-xs font-black rounded-2xl hover:bg-gray-800 transition-all shrink-0"
                  >
                    변경하기
                  </button>
                )}
                {isEmailChanging && !isEmailVerified && (
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={handleSendCode}
                      disabled={isVerifying}
                      className="px-4 py-3.5 bg-purple-600 text-white text-xs font-black rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                      {isCodeSent ? '재발송' : '인증번호 발송'}
                    </button>
                    <button 
                      onClick={resetEmailChange}
                      className="px-4 py-3.5 bg-gray-100 text-gray-500 text-xs font-black rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      취소
                    </button>
                  </div>
                )}
                {isEmailVerified && (
                  <span className="px-6 py-3.5 bg-green-50 text-green-600 text-xs font-black rounded-2xl border border-green-100 flex items-center gap-2 shrink-0">
                    ✓ 인증 완료
                  </span>
                )}
              </div>

              {isEmailChanging && isCodeSent && !isEmailVerified && (
                <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <input 
                    type="text" 
                    placeholder="인증번호 6자리 입력"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="flex-grow bg-white border-2 border-purple-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-700 focus:border-purple-500 outline-none transition-all"
                  />
                  <button 
                    onClick={handleVerifyCode}
                    disabled={isVerifying}
                    className="px-8 py-3.5 bg-purple-600 text-white text-xs font-black rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50"
                  >
                    확인
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
              <button 
                onClick={handleCancel}
                className="px-8 py-3.5 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all"
              >
                취소
              </button>
              <button 
                onClick={handleSaveInfo}
                disabled={isSaving}
                className="px-10 py-3.5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 disabled:opacity-50"
              >
                {isSaving ? '저장 중...' : '변경사항 저장'}
              </button>
            </div>
          )}
        </section>

        {/* Security Section */}
        <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <span className="text-xl">🔒</span> 보안 설정
          </h3>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border transition-all ${isPasswordEditing ? 'bg-purple-50/30 border-purple-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-800">비밀번호 변경</p>
                  <p className="text-xs text-gray-500 mt-0.5">주기적인 비밀번호 변경으로 계정을 안전하게 보호하세요.</p>
                </div>
                {!isPasswordEditing && (
                  <button 
                    onClick={() => setIsPasswordEditing(true)}
                    className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 text-xs font-black rounded-xl hover:bg-gray-50 transition-all"
                  >
                    변경하기
                  </button>
                )}
              </div>

              {isPasswordEditing && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">현재 비밀번호</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호 입력"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:border-purple-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">새 비밀번호</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="8자 이상 입력"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:border-purple-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">새 비밀번호 확인</label>
                      <input 
                        type="password" 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="다시 한번 입력"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:border-purple-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      onClick={handlePasswordCancel}
                      className="px-5 py-2.5 bg-gray-100 text-gray-500 text-xs font-black rounded-xl hover:bg-gray-200 transition-all"
                    >
                      취소
                    </button>
                    <button 
                      onClick={handlePasswordUpdate}
                      disabled={isPasswordSaving}
                      className="px-5 py-2.5 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50"
                    >
                      {isPasswordSaving ? '변경 중...' : '비밀번호 저장'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Account Deletion */}
        <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <span className="text-xl">👋</span> 서비스 탈퇴
            </h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed px-1">
            탈퇴 시 모든 활동 기록 및 저장된 플래너 데이터가 삭제되며 복구할 수 없습니다. 
            신중하게 결정해 주세요.
          </p>
          <div className="pt-2 flex justify-start">
            <button 
              onClick={handleAccountDeletion}
              disabled={isDeleting}
              className="text-sm font-bold text-gray-400 hover:text-rose-500 hover:underline transition-all disabled:opacity-50"
            >
              {isDeleting ? '탈퇴 처리 중...' : '계정을 삭제하시겠습니까?'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyAccountSettingsTab;
