import React from 'react';

const Footer = () => {
  const primaryPurple = '#6B46FE';
  const accentYellow = '#FFB800';
  const lightBg = '#F9FAFB';
  const textColor = '#1F2937';
  const mutedText = '#6B7280';

  const footerStyle = {
    backgroundColor: lightBg,
    color: textColor,
    padding: '60px 20px 40px',
    borderTop: `1px solid #E5E7EB`,
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: primaryPurple,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const headingStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: textColor,
  };

  const linkStyle = {
    color: mutedText,
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  };

  const bottomStyle = {
    maxWidth: '1200px',
    margin: '40px auto 0',
    paddingTop: '20px',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    fontSize: '0.85rem',
    color: mutedText,
  };

  const socialIconStyle = {
    display: 'flex',
    gap: '12px',
  };

  const iconCircle = {
    width: '36px',
    height: '36px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: mutedText,
    fontSize: '1.2rem',
    cursor: 'pointer',
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* Brand Column */}
        <div style={{ ...columnStyle, gridColumn: 'span 2' }}>
          <div style={logoStyle}>
            <span style={{ color: primaryPurple }}>축제로</span>
          </div>
          <p style={{ ...linkStyle, lineHeight: '1.6', maxWidth: '300px' }}>
            전국의 다양한 축제와 여행 정보를 한눈에!<br />
            축제로와 함께 특별한 하루를 만들어보세요.
          </p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <span style={{ backgroundColor: accentYellow, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', color: '#FFF', fontWeight: '600' }}>
              #대한민국축제
            </span>
            <span style={{ backgroundColor: primaryPurple, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', color: '#FFF', fontWeight: '600' }}>
              #축제정보
            </span>
          </div>
        </div>

        {/* Menu Columns */}
        <div style={columnStyle}>
          <h4 style={headingStyle}>서비스</h4>
          <a href="#" style={linkStyle}>축제 찾기</a>
          <a href="#" style={linkStyle}>지역별 축제</a>
          <a href="#" style={linkStyle}>테마별 추천</a>
          <a href="#" style={linkStyle}>여행 정보</a>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>커뮤니티</h4>
          <a href="#" style={linkStyle}>축제 후기</a>
          <a href="#" style={linkStyle}>자유게시판</a>
          <a href="#" style={linkStyle}>이벤트</a>
          <a href="#" style={linkStyle}>뉴스레터</a>
        </div>

        <div style={columnStyle}>
          <h4 style={headingStyle}>고객센터</h4>
          <a href="#" style={linkStyle}>공지사항</a>
          <a href="#" style={linkStyle}>자주 묻는 질문</a>
          <a href="#" style={linkStyle}>1:1 문의</a>
          <a href="#" style={linkStyle}>제휴 문의</a>
        </div>
      </div>

      <div style={bottomStyle}>
        <div>
          <p>© {new Date().getFullYear()} 축제로 (Chukjero). All rights reserved.</p>
          <div style={{ marginTop: '8px', display: 'flex', gap: '16px' }}>
            <a href="#" style={{ ...linkStyle, fontWeight: '600', color: textColor }}>개인정보처리방침</a>
            <a href="#" style={linkStyle}>이용약관</a>
          </div>
        </div>
        
        <div style={socialIconStyle}>
          <div style={iconCircle} title="Instagram">📸</div>
          <div style={iconCircle} title="Facebook">📘</div>
          <div style={iconCircle} title="Blog">📝</div>
          <div style={iconCircle} title="YouTube">🎬</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
