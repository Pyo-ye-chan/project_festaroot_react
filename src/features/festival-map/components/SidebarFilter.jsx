import { useState } from 'react';
import { Calendar, RotateCcw, X } from 'lucide-react';

function SidebarFilter() {
  // 1. 기준 축제 더미 상태 (X 버튼 누르면 지워지는 효과용)
  const [selectedFestival, setSelectedFestival] = useState({
    name: "태안 세계튤립축제",
    period: "2025.04.12 ~ 2025.05.07",
    location: "충청남도 태안군",
    image: "https://images.unsplash.com/photo-1526310283981-d25a8166c4c0?w=150&q=80" // 임시 튤립 이미지
  });

  // 2. 추천 범위 상태 (5km, 10km, 20km)
  const [radius, setRadius] = useState(5);

  // 3. 기간 설정 상태
  const [startDate, setStartDate] = useState("2025-04-12");
  const [endDate, setEndDate] = useState("2025-05-07");

  // 4. 카테고리 체크박스 상태
  const [categories, setCategories] = useState({
    food: true,
    tour: true,
    festival: true
  });

  // 카테고리 변경 핸들러
  const handleCategoryChange = (type) => {
    setCategories(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // 검색 초기화
  const handleReset = () => {
    setRadius(5);
    setStartDate("2025-04-12");
    setEndDate("2025-05-07");
    setCategories({ food: true, tour: true, festival: true });
  };

  // 검색하기 제출
  const handleSearch = () => {
    alert(`검색 조건 실행!\n반경: ${radius}km\n기간: ${startDate} ~ ${endDate}\n카테고리: ${JSON.stringify(categories)}`);
    // 💡 나중에 여기에 Zustand 액션이나 백엔드 axios 요청을 넣으면 됩니다!
  };

  return (
    <div style={styles.sidebar}>
      {/* 타이틀 영역 */}
      <div style={styles.header}>
        <h2 style={styles.title}>축제 기반 주변 여행 정보</h2>
        <p style={styles.subtitle}>기준 축제를 선택하면 주변 여행 정보를 추천해드려요!</p>
      </div>

      <div style={styles.divider} />

      {/* 1. 기준 축제 선택 */}
      <div style={styles.section}>
        <label style={styles.sectionLabel}>1. 기준 축제 선택</label>
        {selectedFestival ? (
          <div style={styles.festivalCard}>
            <button style={styles.closeButton} onClick={() => setSelectedFestival(null)}>
              <X size={16} color="#666" />
            </button>
            <div style={styles.cardContent}>
              <img src={selectedFestival.image} alt="축제" style={styles.cardImage} />
              <div>
                <h4 style={styles.cardTitle}>{selectedFestival.name}</h4>
                <p style={styles.cardDate}>{selectedFestival.period}</p>
                <p style={styles.cardLocation}>{selectedFestival.location}</p>
              </div>
            </div>
            <button style={styles.detailButton}>축제 상세보기</button>
          </div>
        ) : (
          <div style={styles.emptyFestival}>축제를 먼저 선택해주세요.</div>
        )}
      </div>

      {/* 2. 추천 범위 설정 */}
      <div style={styles.section}>
        <label style={styles.sectionLabel}>2. 추천 범위 설정</label>
        <div style={styles.badgeContainer}>
          <button style={radius === 0 ? styles.activeBadge : styles.badge} onClick={() => setRadius(0)}>내 주변</button>
          <button style={radius === 5 ? styles.activeBadge : styles.badge} onClick={() => setRadius(5)}>반경 5km</button>
          <button style={radius === 10 ? styles.activeBadge : styles.badge} onClick={() => setRadius(10)}>반경 10km</button>
          <button style={radius === 20 ? styles.activeBadge : styles.badge} onClick={() => setRadius(20)}>반경 20km</button>
        </div>
        {/* 슬라이더 바 */}
        <div style={styles.sliderContainer}>
          <input 
            type="range" 
            min="0" 
            max="20" 
            value={radius} 
            onChange={(e) => setRadius(Number(e.target.value))}
            style={styles.slider} 
          />
          <div style={styles.sliderLabels}>
            <span>0km</span>
            <span>5km</span>
            <span>10km</span>
            <span>20km</span>
          </div>
        </div>
      </div>

      {/* 3. 기간 설정 */}
      <div style={styles.section}>
        <label style={styles.sectionLabel}>3. 기간 설정</label>
        <div style={styles.datePickerContainer}>
          <div style={styles.dateInputWrapper}>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.dateInput} />
          </div>
          <span style={{ color: '#666' }}>~</span>
          <div style={styles.dateInputWrapper}>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={styles.dateInput} />
          </div>
        </div>
      </div>

      {/* 4. 카테고리 선택 */}
      <div style={sectionStyle(4)}>
        <label style={styles.sectionLabel}>4. 카테고리 선택 <span style={styles.subText}>(복수 선택 가능)</span></label>
        <div style={styles.checkboxContainer}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={categories.food} onChange={() => handleCategoryChange('food')} style={styles.checkbox} />
            음식점
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={categories.tour} onChange={() => handleCategoryChange('tour')} style={styles.checkbox} />
            관광지
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={categories.festival} onChange={() => handleCategoryChange('festival')} style={styles.checkbox} />
            축제/행사
          </label>
        </div>
      </div>

      {/* 하단 버튼 구역 */}
      <div style={styles.buttonContainer}>
        <button style={styles.searchButton} onClick={handleSearch}>검색하기</button>
        <button style={styles.resetButton} onClick={handleReset}>
          <RotateCcw size={14} style={{ marginRight: '5px' }} /> 검색 초기화
        </button>
      </div>

      {/* 하단 푸터 안내문구 */}
      <div style={styles.tourApiNotice}>
        💡 한국관광공사 관광정보 API(TourAPI)를 활용하여 제공됩니다.
      </div>
    </div>
  );
}

// 카테고리 선택 섹션만 아래 여백을 유연하게 주기 위한 함수형 스타일
const sectionStyle = (num) => ({
  ...styles.section,
  marginBottom: num === 4 ? '30px' : '24px'
});

// 🎨 스타일시트 정의 (디자인 시안 컬러 감성 최대한 반영)
const styles = {
  sidebar: {
    width: '360px',
    height: '100vh',
    backgroundColor: '#F8FAFC', // 매우 연한 블루그레이 배경
    borderRight: '1px solid #E2E8F0',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    marginBottom: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
    lineHeight: '1.4',
  },
  divider: {
    height: '1px',
    backgroundColor: '#E2E8F0',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '12px',
  },
  subText: {
    fontSize: '11px',
    color: '#94A3B8',
    fontWeight: '400',
  },
  festivalCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '16px',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  cardContent: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  },
  cardImage: {
    width: '70px',
    height: '70px',
    borderRadius: '6px',
    objectFit: 'cover',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0 0 4px 0',
  },
  cardDate: {
    fontSize: '12px',
    color: '#64748B',
    margin: '0 0 2px 0',
  },
  cardLocation: {
    fontSize: '12px',
    color: '#94A3B8',
    margin: 0,
  },
  detailButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #6366F1', // 보라색 테두리
    borderRadius: '6px',
    color: '#6366F1',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyFestival: {
    padding: '20px',
    textAlign: 'center',
    color: '#94A3B8',
    border: '1px dashed #CBD5E1',
    borderRadius: '8px',
    fontSize: '13px',
  },
  badgeContainer: {
    display: 'flex',
    gap: '6px',
    marginBottom: '12px',
  },
  badge: {
    flex: 1,
    padding: '6px 0',
    fontSize: '12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    color: '#64748B',
    cursor: 'pointer',
  },
  activeBadge: {
    flex: 1,
    padding: '6px 0',
    fontSize: '12px',
    backgroundColor: '#6366F1', // 활성화 시 보라색 변환
    border: '1px solid #6366F1',
    borderRadius: '6px',
    color: '#FFFFFF',
    fontWeight: '600',
    cursor: 'pointer',
  },
  sliderContainer: {
    padding: '0 4px',
  },
  slider: {
    width: '100%',
    accentColor: '#6366F1', // 슬라이더 버튼 색상 변경
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'between', // 레이아웃 균등분할용 보정
    fontSize: '11px',
    color: '#94A3B8',
    marginTop: '4px',
  },
  datePickerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#334155',
    boxSizing: 'border-box',
  },
  checkboxContainer: {
    display: 'flex',
    gap: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#334155',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#6366F1',
    width: '16px',
    height: '16px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: 'auto', // 사이드바 맨 밑으로 버튼 밀어내기
  },
  searchButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#6366F1', // 메인 브랜드 보라색
    border: 'none',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resetButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    color: '#64748B',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  tourApiNotice: {
    marginTop: '16px',
    fontSize: '11px',
    color: '#94A3B8',
    backgroundColor: '#EFF6FF', // 연한 하늘색 박스 안내문
    padding: '10px',
    borderRadius: '6px',
    lineHeight: '1.4',
  }
};

export default SidebarFilter;