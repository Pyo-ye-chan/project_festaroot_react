import React, { useState, useEffect, useRef } from 'react';
import { updateMemberProfile } from '../../../api/memberApi';
import { getSidoList } from '../../../api/regionApi';
import { getThemeList } from '../../../api/themeApi';
import { toast } from 'react-toastify';

const MyProfileTab = ({ userDetails, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editRegions, setEditRegions] = useState([]);
  const [editThemes, setEditThemes] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  
  const [allSidos, setAllSidos] = useState([]);
  const [allThemes, setAllThemes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // 모달 상태 추가
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [sidoResp, themeResp] = await Promise.all([
          getSidoList(),
          getThemeList()
        ]);
        setAllSidos(sidoResp.data);
        setAllThemes(themeResp.data);
      } catch (error) {
        console.error('옵션 데이터 로드 실패:', error);
      }
    };
    fetchOptions();
  }, []);

  if (!userDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg font-bold">사용자 정보를 불러올 수 없습니다.</p>
        <p className="text-sm">로그인 상태를 확인해 주세요.</p>
      </div>
    );
  }

  const { member, interestRegions, interestThemes, recentLogs ,likedFestivals,level,titleName,currentExp,nextLevelExp} = userDetails;

  // 성장 정보 추출 (백엔드 DTO 매핑)
  // const { 
  //   level = 1, 
  //   titleName = '초보 여행자', 
  //   currentExp = 0, 
  //   nextLevelExp = 100 
  // } = member;

  const handleEditStart = () => {
    setEditNickname(member.nickname);
    setEditRegions(interestRegions || []);
    setEditThemes(interestThemes || []);
    setProfilePreview(member.profile_image_url);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfilePreview(null);
    setProfileFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRegion = (region) => {
    setEditRegions(prev => 
      prev.find(r => r.region_code === region.region_code)
        ? prev.filter(r => r.region_code !== region.region_code)
        : [...prev, region]
    );
  };

  const toggleTheme = (theme) => {
    setEditThemes(prev => 
      prev.find(t => t.theme_code === theme.theme_code)
        ? prev.filter(t => t.theme_code !== theme.theme_code)
        : [...prev, theme]
    );
  };

  const handleSave = async () => {
    if (!editNickname.trim()) {
      toast.warn('닉네임을 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('nickname', editNickname);
      formData.append('regions', JSON.stringify(editRegions.map(r => r.region_code)));
      formData.append('themes', JSON.stringify(editThemes.map(t => t.theme_code)));
      if (profileFile) {
        formData.append('profile_image', profileFile);
      }

      await updateMemberProfile(member.member_id, formData);
      // const { achievements } = response.data; // 이제 인터셉터에서 처리함

      setIsEditing(false);
      if (onRefresh) onRefresh();
      
      toast.success('프로필이 수정되었습니다.');

    } catch (error) {
      console.error('프로필 수정 실패:', error);
      toast.error('프로필 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 가입일 포맷팅
  const formatDate = (dateStr) => {
    if (!dateStr) return '날짜 정보 없음';
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">내 프로필</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">활동 내역과 프로필 정보를 확인하세요.</p>
      </header>

      {/* Region Selection Modal */}
      {isRegionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsRegionModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-purple-50/50">
              <h3 className="text-lg font-black text-gray-800">📍 관심 지역 선택</h3>
              <button onClick={() => setIsRegionModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allSidos.map(s => {
                  const isSelected = editRegions.find(r => r.region_code === s.region_code);
                  return (
                    <button
                      key={s.region_code}
                      onClick={() => toggleRegion(s)}
                      className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                        isSelected 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-100' 
                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-white hover:border-purple-200'
                      }`}
                    >
                      {s.region_name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsRegionModalOpen(false)}
                className="px-8 py-3 bg-purple-600 text-white text-sm font-black rounded-xl shadow-lg shadow-purple-100"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Selection Modal */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsThemeModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50">
              <h3 className="text-lg font-black text-gray-800">🎨 관심 테마 선택</h3>
              <button onClick={() => setIsThemeModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {allThemes.map(t => {
                  const isSelected = editThemes.find(et => et.theme_code === t.theme_code);
                  return (
                    <button
                      key={t.theme_code}
                      onClick={() => toggleTheme(t)}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                        isSelected 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-white hover:border-indigo-200'
                      }`}
                    >
                      # {t.theme_name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsThemeModalOpen(false)}
                className="px-8 py-3 bg-indigo-600 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-100"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-10">
        <div className="relative group">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-purple-100 overflow-hidden border-4 border-white shadow-lg relative">
            <img 
              src={isEditing && profilePreview ? profilePreview : (member.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.nickname}`)} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
            {isEditing && (
              <div 
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-white text-xs font-bold">변경</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*"
          />
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-purple-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black border-4 border-white shadow-md text-xs sm:text-sm">
            {level}
          </div>
        </div>
        
        <div className="flex-grow text-center md:text-left space-y-4 w-full">
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 mb-1 sm:mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  className="text-xl sm:text-2xl font-black text-gray-800 border-b-2 border-purple-500 focus:outline-none bg-transparent px-1"
                  placeholder="닉네임 입력"
                />
              ) : (
                <h2 className="text-xl sm:text-2xl font-black text-gray-800">
                  {member.nickname}
                </h2>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 bg-yellow-100 text-yellow-700 text-[10px] sm:text-xs font-bold rounded-full border border-yellow-200">
                ✨ {titleName}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-500 font-medium">{member.email}</p>
          </div>

          {/* EXP Bar */}
          <div className="w-full max-w-md mx-auto md:mx-0 space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
              <span className="text-purple-600">Experience</span>
              <span className="text-gray-400">{currentExp?.toLocaleString()} / {nextLevelExp?.toLocaleString()}</span>
            </div>
            <div className="h-2 sm:h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((currentExp / nextLevelExp) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold">다음 레벨까지 {(nextLevelExp - currentExp)?.toLocaleString()} EXP 남았습니다.</p>
          </div>

          {/* Interests Section */}
          <div className="pt-2 space-y-4">
            {/* Regions */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider block w-fit mx-auto md:mx-0">나의 관심지역</span>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                {(isEditing ? editRegions : interestRegions)?.length > 0 ? (
                  (isEditing ? editRegions : interestRegions).map(r => (
                    <span 
                      key={r.region_code} 
                      onClick={() => isEditing && toggleRegion(r)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm transition-all ${
                        isEditing 
                        ? 'bg-purple-600 text-white border-purple-600 cursor-pointer hover:bg-purple-700' 
                        : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      📍 {r.region_name} {isEditing && '×'}
                    </span>
                  ))
                ) : !isEditing && (
                  <span className="text-[11px] text-gray-400">설정된 지역이 없습니다.</span>
                )}
                {isEditing && (
                  <button 
                    onClick={() => setIsRegionModalOpen(true)}
                    className="text-[11px] font-bold bg-gray-50 border border-gray-200 border-dashed px-3 py-1 rounded-full text-gray-400 hover:border-purple-300 hover:text-purple-500 transition-all"
                  >
                    + 추가하기
                  </button>
                )}
              </div>
            </div>

            {/* Themes */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider block w-fit mx-auto md:mx-0">나의 관심테마</span>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                {(isEditing ? editThemes : interestThemes)?.length > 0 ? (
                  (isEditing ? editThemes : interestThemes).map(t => (
                    <span 
                      key={t.theme_code} 
                      onClick={() => isEditing && toggleTheme(t)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm transition-all ${
                        isEditing 
                        ? 'bg-indigo-600 text-white border-indigo-600 cursor-pointer hover:bg-indigo-700' 
                        : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      ✨ {t.theme_name} {isEditing && '×'}
                    </span>
                  ))
                ) : !isEditing && (
                  <span className="text-[11px] text-gray-400">설정된 테마가 없습니다.</span>
                )}
                {isEditing && (
                  <button 
                    onClick={() => setIsThemeModalOpen(true)}
                    className="text-[11px] font-bold bg-gray-50 border border-gray-200 border-dashed px-3 py-1 rounded-full text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all"
                  >
                    + 추가하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
          {isEditing ? (
            <div className="flex flex-row md:flex-col gap-2 w-full">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-5 py-2.5 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50"
              >
                {isSaving ? '저장 중' : '저장'}
              </button>
              <button 
                onClick={handleCancel}
                className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-500 text-xs font-black rounded-xl hover:bg-gray-200 transition-all"
              >
                취소
              </button>
            </div>
          ) : (
            <button 
              onClick={handleEditStart}
              className="w-full px-5 py-2.5 bg-white text-gray-700 border border-gray-200 text-xs font-black rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              프로필 수정
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: '작성글', value: member.post_count || 0, color: 'text-blue-600', bg: 'bg-blue-50', icon: '📝' },
          { label: '댓글', value: member.comment_count || 0, color: 'text-purple-600', bg: 'bg-purple-50', icon: '💬' },
          { label: '찜한 축제', value: likedFestivals.length || 0, color: 'text-rose-600', bg: 'bg-rose-50', icon: '❤️' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-xl flex items-center justify-center text-xl sm:text-2xl sm:mb-4 shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-400 sm:mb-1">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="bg-white p-6 sm:p-8 md:p-10 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            최근 활동 내역
          </h3>
          <button className="text-xs sm:text-sm font-bold text-purple-600 hover:underline transition-all">전체보기</button>
        </div>
        
        {recentLogs?.length > 0 ? (
          <div className="space-y-4">
            {recentLogs.slice(0, 5).map((log) => (
              <div key={log.log_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    log.type === 'VIEW' ? 'bg-blue-100 text-blue-600' : 
                    log.type === 'SEARCH' ? 'bg-amber-100 text-amber-600' : 
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {log.type === 'VIEW' ? '👀' : log.type === 'SEARCH' ? '🔍' : '📍'}
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">{log.title || log.searchQuery}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{formatDate(log.created_at)}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                  log.type === 'VIEW' ? 'bg-blue-50 text-blue-600' : 
                  log.type === 'SEARCH' ? 'bg-amber-50 text-amber-600' : 
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {log.type === 'VIEW' ? '조회' : log.type === 'SEARCH' ? '검색' : '지도'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl sm:text-3xl opacity-20">📂</span>
            </div>
            <p className="text-gray-400 font-bold text-base sm:text-lg">아직 활동 내역이 없습니다.</p>
            <p className="text-gray-400 text-xs sm:text-sm">축제를 탐색하고 소통을 시작해보세요!</p>
            <button className="mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100">
              축제 보러가기
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyProfileTab;
