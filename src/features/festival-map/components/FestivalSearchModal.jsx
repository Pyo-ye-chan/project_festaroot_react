import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Loader2, Calendar, Tag, ChevronDown, Check } from 'lucide-react';
import useMapStore from '../../../store/useMapStore';
import useAuthStore from '../../../store/useAuthStore';
import { saveActivityLog } from '../../../api/activityApi';
import { getThemeList } from '../../../api/themeApi';


function FestivalSearchModal({ isOpen, onClose, onSelect }) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [allThemes, setAllThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const { isLoggedIn } = useAuthStore();
  const { 
    festivals, 
    fetchAllFestivals, 
    isLoading,
    searchParams,
    setDates
  } = useMapStore();

  const { startDate, endDate } = searchParams;

  useEffect(() => {
    if (isOpen) {
      fetchAllFestivals();
      // 테마 목록 가져오기
      const fetchThemes = async () => {
        try {
          const response = await getThemeList();
          setAllThemes(response.data || []);
        } catch (error) {
          console.error('Error fetching themes:', error);
        }
      };
      fetchThemes();
    }
  }, [isOpen, fetchAllFestivals]);

  if (!isOpen) return null;

  const toggleTheme = (themeName) => {
    setSelectedThemes(prev => 
      prev.includes(themeName) 
        ? prev.filter(t => t !== themeName)
        : [...prev, themeName]
    );
  };

  const filteredFestivals = festivals.filter(festival => {
    // 1. 텍스트 검색 (이름 또는 주소 또는 테마)
    const title = festival.title || '';
    const addr = festival.addr1 || '';
    const themesStr = festival.themes ? festival.themes.map(t => t.theme_name).join(' ') : '';
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      title.toLowerCase().includes(search) || 
      addr.toLowerCase().includes(search) ||
      themesStr.toLowerCase().includes(search);
    
    // 2. 테마 필터링
    const matchesTheme = selectedThemes.length === 0 || 
      (festival.themes && festival.themes.some(t => selectedThemes.includes(t.theme_name)));

    // 3. 기간 검색 (기본적으로 비어있으면 모든 축제 표시)
    if (!startDate && !endDate) return matchesSearch && matchesTheme;

    const festivalStart = festival.event_start_date;
    const festivalEnd = festival.event_end_date;
    const filterStart = startDate ? startDate.replace(/-/g, '') : '00000000';
    const filterEnd = endDate ? endDate.replace(/-/g, '') : '99999999';

    const matchesDate = (festivalStart <= filterEnd) && (festivalEnd >= filterStart);

    return matchesSearch && matchesDate && matchesTheme;
  });

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col mt-20 mb-8 max-h-[calc(100vh-120px)] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800">축제 선택하기</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">원하는 축제와 기간을 확인해보세요</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Search & Filter Section */}
        <div className="p-6 bg-slate-50/50 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="축제 이름, 지역 또는 테마를 검색해보세요"
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B46FE]/20 focus:border-[#6B46FE] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Date Picker Section */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setDates(e.target.value, endDate)} 
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[12px] text-slate-700 outline-none focus:border-[#6B46FE] transition-all" 
              />
            </div>
            <span className="text-slate-400 text-xs font-bold">~</span>
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setDates(startDate, e.target.value)} 
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[12px] text-slate-700 outline-none focus:border-[#6B46FE] transition-all" 
              />
            </div>
          </div>

          {/* Theme Filter Trigger */}
          <div className="relative">
            <button 
              onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[12px] text-slate-600 hover:border-[#6B46FE] transition-all"
            >
              <div className="flex items-center gap-2">
                <Tag size={14} className={selectedThemes.length > 0 ? "text-[#6B46FE]" : "text-slate-400"} />
                {selectedThemes.length > 0 ? (
                  <span className="text-[#6B46FE] font-bold">테마 {selectedThemes.length}개 선택됨</span>
                ) : (
                  <span>테마로 필터링하기</span>
                )}
              </div>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isThemePickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Theme Picker Dropdown */}
            {isThemePickerOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 animate-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-[11px] font-bold text-slate-400">테마 선택</span>
                  <button 
                    onClick={() => setSelectedThemes([])}
                    className="text-[10px] text-slate-400 hover:text-[#6B46FE] font-bold"
                  >
                    초기화
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {allThemes.map((theme) => {
                    const isSelected = selectedThemes.includes(theme.theme_name);
                    return (
                      <button
                        key={theme.theme_id}
                        onClick={() => toggleTheme(theme.theme_name)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                          isSelected 
                            ? "bg-[#6B46FE] text-white shadow-md shadow-purple-100" 
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                        }`}
                      >
                        {isSelected && <Check size={10} />}
                        {theme.theme_name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Festival List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[12px] font-semibold text-slate-500">검색 결과 {filteredFestivals.length}건</span>
            {selectedThemes.length > 0 && (
              <div className="flex flex-wrap justify-end gap-1">
                {selectedThemes.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-[#6B46FE]/10 text-[#6B46FE] text-[9px] font-bold rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm">축제 목록을 불러오고 있습니다...</p>
            </div>
          ) : filteredFestivals.length > 0 ? (
            filteredFestivals.map((festival, index) => (
              <div
                key={festival.content_id || `festival-${index}`}
                onClick={() => {
                  onSelect(festival);
                  
                  // 축제 선택 시 로그인 상태라면 조회 로그 저장
                  if (isLoggedIn) {
                    saveActivityLog({
                      type: 'MAP',
                      festivalId: festival.content_id
                    });
                  }
                  
                  onClose();
                }}
                className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:border-[#6B46FE] hover:bg-purple-50/30 cursor-pointer transition-all group"
              >
                <img
                  src={festival.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&q=80'}
                  alt={festival.title}
                  className="w-20 h-20 rounded-xl object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0 py-1">
                  <h4 className="font-bold text-slate-800 group-hover:text-[#6B46FE] transition-colors truncate">{festival.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar size={12} className="text-[#6B46FE]" />
                    {festival.event_start_date} ~ {festival.event_end_date}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{festival.addr1}</p>
                  
                  {/* 테마 정보 출력 */}
                  {festival.themes && festival.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {festival.themes.map((theme, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 bg-[#6B46FE]/10 text-[#6B46FE] text-[10px] font-bold rounded-md"
                        >
                          #{theme.theme_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
              <Search size={40} className="text-slate-200" />
              <p className="text-[13px]">{searchTerm || (startDate !== "" || endDate !== "") ? '조건에 맞는 결과가 없습니다.' : '등록된 축제가 없습니다.'}</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                }}
                className="mt-2 text-[12px] text-[#6B46FE] font-bold hover:underline"
              >
                검색 조건 초기화
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-center gap-4 sticky bottom-0 z-10">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default FestivalSearchModal;

